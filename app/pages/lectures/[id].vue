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
        <UCard v-if="lecture?.manifest_url">
          <LecturePlayer :src="lecture.manifest_url" />
        </UCard>

        <UAlert
          v-else
          icon="i-heroicons-video-camera-slash"
          title="No video available"
          description="This lecture doesn't have a video source yet."
        />
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

const lectureId = computed(() => String(route.params.id))

const lecture = ref<any | null>(null)
const notes = ref<any[]>([])
const content = ref('')

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

async function createNote() {
  if (!auth.isStudent || !content.value) return

  await api(`/lectures/${lectureId.value}/notes`, {
    method: 'POST',
    body: { content: content.value }
  })
  content.value = ''
  await loadNotes()
}

onMounted(async () => {
  await loadLecture()
  await loadNotes()
})
</script>
