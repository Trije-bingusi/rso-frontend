<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <NuxtLink to="/courses" class="text-sm opacity-70">← Back to courses</NuxtLink>
      <RoleBadge />
    </div>

    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-semibold tracking-tight">
        {{ lecture?.title ?? 'Lecture' }}
      </h1>
    </div>

    <div class="grid lg:grid-cols-3 gap-6">
      <!-- Video -->
      <div class="lg:col-span-2 space-y-4">
        <UCard v-if="videoUrl">
          <LecturePlayer :src="videoUrl" />
        </UCard>

        <UCard v-else-if="!videoUrl && !auth.isProfessor && !loadingVideo">
          <UAlert
            icon="i-heroicons-video-camera-slash"
            title="No video available"
            description="This lecture doesn't have a video source yet."
          />
        </UCard>

        <UCard v-else-if="loadingVideo">
          <div class="flex items-center justify-center py-8">
            <div class="text-sm opacity-70">Loading video...</div>
          </div>
        </UCard>

        <!-- Upload video (PROFESSORS ONLY) -->
        <UCard v-if="auth.isProfessor">
          <div class="space-y-3">
            <div class="font-semibold">Video Management</div>

            <div v-if="!videoUrl" class="space-y-2">
              <label class="block text-sm font-medium">Upload video</label>
              <input
                ref="fileInput"
                type="file"
                accept="video/*"
                @change="onFileSelected"
                class="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 dark:file:bg-primary-900 dark:file:text-primary-300 dark:hover:file:bg-primary-800"
              />
              <p v-if="selectedFile" class="text-xs opacity-70">
                Selected: {{ selectedFile.name }} ({{ formatFileSize(selectedFile.size) }})
              </p>

              <div v-if="uploadProgress > 0 && uploadProgress < 100" class="space-y-1">
                <div class="flex justify-between text-xs opacity-70">
                  <span>Uploading...</span>
                  <span>{{ uploadProgress }}%</span>
                </div>
                <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    class="bg-primary-600 h-2 rounded-full transition-all"
                    :style="{ width: `${uploadProgress}%` }"
                  />
                </div>
              </div>

              <div class="flex justify-end gap-2">
                <UButton
                  v-if="selectedFile"
                  variant="ghost"
                  @click="clearFile"
                >
                  Clear
                </UButton>
                <UButton
                  color="primary"
                  :disabled="!selectedFile || uploading"
                  :loading="uploading"
                  @click="uploadVideo"
                >
                  {{ uploading ? 'Uploading...' : 'Upload Video' }}
                </UButton>
              </div>
            </div>
            <div v-else class="text-sm opacity-70">
              Video is already uploaded. Delete it to upload a new one.
            </div>
          </div>
        </UCard>

        <!-- Transcription (PROFESSORS ONLY) -->
        <!-- COMMENTED OUT FOR NOW
        <UCard v-if="auth.isProfessor && videoUrl">
          <div class="space-y-3">
            <div class="font-semibold">Transcription</div>
            
            <div v-if="transcription.status === 'none'" class="space-y-2">
              <p class="text-sm opacity-70">Generate automatic transcription for this video.</p>
              <UButton
                color="primary"
                variant="outline"
                @click="startTranscription"
                :loading="transcribing"
              >
                Generate Transcription
              </UButton>
            </div>

            <div v-else-if="transcription.status === 'queued' || transcription.status === 'processing'" class="space-y-2">
              <UAlert
                icon="i-heroicons-clock"
                title="Transcription in progress"
                :description="`Status: ${transcription.status}`"
              />
              <UButton
                color="gray"
                variant="ghost"
                size="xs"
                @click="checkTranscriptionStatus"
              >
                Refresh Status
              </UButton>
            </div>

            <div v-else-if="transcription.status === 'done'" class="space-y-2">
              <UAlert
                icon="i-heroicons-check-circle"
                color="green"
                title="Transcription complete"
              />
              <div class="flex gap-2">
                <UButton
                  color="primary"
                  variant="outline"
                  size="sm"
                  @click="downloadTranscription('json')"
                >
                  Download JSON
                </UButton>
                <UButton
                  color="primary"
                  variant="outline"
                  size="sm"
                  @click="downloadTranscription('vtt')"
                >
                  Download VTT
                </UButton>
              </div>
            </div>

            <div v-else-if="transcription.status === 'failed'" class="space-y-2">
              <UAlert
                icon="i-heroicons-x-circle"
                color="red"
                title="Transcription failed"
                :description="transcription.error || 'Unknown error'"
              />
              <UButton
                color="primary"
                variant="outline"
                size="sm"
                @click="startTranscription"
                :loading="transcribing"
              >
                Retry
              </UButton>
            </div>
          </div>
        </UCard>
        -->
      </div>

      <!-- Notes (STUDENTS ONLY) -->
      <div v-if="auth.isStudent" class="space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold">Your notes</h2>
        </div>

        <UCard>
          <div class="space-y-3">
            <UTextarea
              v-model="content"
              :rows="4"
              placeholder="Write a note for this lecture..."
            />
            <div class="flex justify-end">
              <UButton color="primary" :disabled="!content" @click="createNote">
                Save note
              </UButton>
            </div>
          </div>
        </UCard>

        <div v-if="notes.length === 0" class="text-sm opacity-60">
          No notes yet.
        </div>

        <div class="grid gap-3">
          <UCard v-for="n in notes" :key="n.id">
            <div class="text-sm whitespace-pre-wrap">{{ n.content }}</div>
            <div class="text-[11px] opacity-60 mt-2">{{ n.created_at }}</div>
          </UCard>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const auth = useAuthStore()
const api = useApi()
const route = useRoute()
const config = useRuntimeConfig()

const lectureId = computed(() => String(route.params.id))

const lecture = ref<any | null>(null)
const notes = ref<any[]>([])
const content = ref('')
const selectedFile = ref<File | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const uploading = ref(false)
const uploadProgress = ref(0)
const videoUrl = ref<string | null>(null)
const loadingVideo = ref(false)
// TRANSCRIPTION COMMENTED OUT FOR NOW
// const transcribing = ref(false)
// const transcription = ref({
//   status: 'none',
//   job_id: null as string | null,
//   json_url: null as string | null,
//   vtt_url: null as string | null,
//   error: null as string | null
// })

async function loadLecture() {
  lecture.value = await api(`/lectures/${lectureId.value}`)
}

async function loadNotes() {
  if (!auth.isStudent) {
    notes.value = []
    return
  }
  notes.value = await api(`/lectures/${lectureId.value}/notes`)
}

async function loadVideo() {
  try {
    loadingVideo.value = true
    const result = await api(`/api/lectures/${lectureId.value}/videos`)
    videoUrl.value = result.videoUrl
  } catch (error: any) {
    // 404 means no video exists, which is fine
    if (error?.status !== 404) {
      console.error('Failed to load video:', error)
    }
    videoUrl.value = null
  } finally {
    loadingVideo.value = false
  }
}

async function createNote() {
  if (!auth.isStudent || !content.value) return

  await api(`/lectures/${lectureId.value}/notes`, {
    method: 'POST',
    body: { content: content.value }
  })
  content.value = ''
  await loadNotes()
}

function onFileSelected(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    selectedFile.value = target.files[0]
  }
}

function clearFile() {
  selectedFile.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
  uploadProgress.value = 0
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

async function uploadVideo() {
  if (!selectedFile.value || !auth.isProfessor) return

  try {
    uploading.value = true
    uploadProgress.value = 0

    // Step 1: Get SAS URL from the videos service
    const { uploadUrl, videoId } = await api(`/api/lectures/${lectureId.value}/videos`, {
      method: 'POST'
    })

    // Step 2: Upload the file directly to Azure Blob Storage using the SAS URL
    const xhr = new XMLHttpRequest()

    // Track upload progress
    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        uploadProgress.value = Math.round((e.loaded / e.total) * 100)
      }
    })

    // Handle upload completion
    await new Promise<void>((resolve, reject) => {
      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve()
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`))
        }
      })

      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed'))
      })

      xhr.addEventListener('abort', () => {
        reject(new Error('Upload cancelled'))
      })

      // Upload to Azure Blob Storage
      xhr.open('PUT', uploadUrl, true)
      xhr.setRequestHeader('x-ms-blob-type', 'BlockBlob')
      xhr.setRequestHeader('x-ms-blob-content-type', selectedFile.value!.type || 'video/mp4')
      xhr.send(selectedFile.value)
    })

    // Step 3: Poll backend to verify upload and get video URL
    let attempts = 0
    const maxAttempts = 30 // Poll for up to 30 seconds
    
    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      try {
        const videoStatus = await api(`/api/lectures/${lectureId.value}/videos`)
        if (videoStatus.videoId === videoId && videoStatus.videoUrl) {
          // Upload successful, update video URL
          videoUrl.value = videoStatus.videoUrl
          clearFile()
          uploadProgress.value = 100
          return
        }
      } catch (err) {
        // Video not ready yet, continue polling
      }
      
      attempts++
    }

    throw new Error('Upload verification timeout')

  } catch (error) {
    console.error('Failed to upload video:', error)
    alert('Failed to upload video. Please try again.')
    uploadProgress.value = 0
  } finally {
    uploading.value = false
  }
}

// TRANSCRIPTION FUNCTIONS COMMENTED OUT FOR NOW
// async function checkTranscriptionStatus() {
//   if (!auth.isProfessor || !lectureId.value) return

//   try {
//     const result = await api(`/api/lectures/${lectureId.value}/transcription`)
//     transcription.value = {
//       status: result.status || 'none',
//       job_id: result.job_id || null,
//       json_url: result.json_url || null,
//       vtt_url: result.vtt_url || null,
//       error: result.error || null
//     }
//   } catch (error) {
//     console.error('Failed to check transcription status:', error)
//   }
// }

// async function startTranscription() {
//   if (!auth.isProfessor || !lectureId.value) return
//   console.log('Starting transcription for lecture', lectureId.value)
//   try {
//     transcribing.value = true
//     console.log('Starting transcription for lecture', lectureId.value)

//     await api(`/api/lectures/${lectureId.value}/transcribe`, {
//       method: 'POST',
//       body: { language: 'sl' }
//     })

//     // Check status after starting
//     await checkTranscriptionStatus()
//   } catch (error) {
//     console.error('Failed to start transcription:', error)
//     alert('Failed to start transcription. Please try again.')
//   } finally {
//     transcribing.value = false
//   }
// }

// function downloadTranscription(type: 'json' | 'vtt') {
//   const url = type === 'json' ? transcription.value.json_url : transcription.value.vtt_url
//   if (!url) return

//   // Open in new tab to trigger download
//   window.open(url, '_blank')
// }

onMounted(async () => {
  await loadLecture()
  await loadVideo()
  await loadNotes()
  // TRANSCRIPTION COMMENTED OUT FOR NOW
  // if (auth.isProfessor && videoUrl.value) {
  //   await checkTranscriptionStatus()
  // }
})
</script>
