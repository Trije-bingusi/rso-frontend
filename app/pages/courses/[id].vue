<template>
  <div class="space-y-8">
    <div class="flex items-center justify-between">
      <NuxtLink to="/courses" class="text-sm opacity-70 hover:opacity-100 transition">
        ← Back to courses
      </NuxtLink>
      <RoleBadge />
    </div>

    <!-- Split view -->
    <div class="grid lg:grid-cols-[1fr_1px_520px] gap-8 items-start">
      <!-- LEFT: Lectures -->
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-semibold tracking-tight">Lectures</h1>
          <span class="text-xs opacity-60">
            {{ auth.isProfessor ? 'Professor view' : 'Student view' }}
          </span>
        </div>

        <!-- Add lecture (prof only) -->
        <UCard v-if="auth.isProfessor">
          <div class="space-y-4">
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-plus-circle" />
              <div class="font-semibold">Add lecture</div>
            </div>

            <UInput v-model="title" placeholder="Lecture title" />

            <div class="flex justify-end">
              <UButton
                color="primary"
                :disabled="!title || creating"
                :loading="creating"
                @click="createLecture"
              >
                {{ creating ? 'Creating...' : 'Create lecture' }}
              </UButton>
            </div>
          </div>
        </UCard>

        <UAlert
          v-else
          icon="i-heroicons-information-circle"
          title="Lectures are created by professors"
          description="You can view all lectures once they are published."
        />

        <!-- Lecture list -->
        <div v-if="lectures.length === 0" class="opacity-70 text-sm">
          No lectures yet.
        </div>

        <div class="grid md:grid-cols-2 gap-5">
          <!-- Keep existing LectureCard, but override how timestamp is shown via a wrapper slot-like layout:
               If LectureCard already prints its own timestamp internally, you can ignore this.
               In many setups LectureCard uses lecture.createdAt so we normalize data below as well. -->
          <LectureCard
            v-for="l in lectures"
            :key="l.id"
            :lecture="l"
          />
        </div>
      </div>

      <!-- divider -->
      <div class="hidden lg:block h-full w-px bg-gray-200/40 dark:bg-gray-800/60 rounded" />

      <!-- RIGHT: Forum -->
      <div class="space-y-6">
        <div class="space-y-1">
          <div class="flex items-end justify-between gap-4">
            <div>
              <div class="text-2xl font-semibold tracking-tight">Forum</div>
              <div class="text-xs opacity-60">Course threads & replies</div>
            </div>
            <div class="text-xs opacity-50">
              {{ (threads?.length ?? 0) }} thread{{ (threads?.length ?? 0) === 1 ? '' : 's' }}
            </div>
          </div>
        </div>

        <!-- Create thread -->
        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-chat-bubble-left-right" />
              <div class="font-semibold">Start a thread</div>
            </div>
          </template>

          <div class="space-y-4">
            <div class="grid sm:grid-cols-2 gap-3">
              <UInput v-model="newThreadTitle" placeholder="Thread title" />
              <div class="hidden sm:block" />
            </div>

            <UTextarea
              v-model="newThreadContent"
              :rows="3"
              placeholder="Write the first message..."
            />

            <div class="flex items-center justify-between">
              <p class="text-xs opacity-60">
                Threads are scoped to this course.
              </p>

              <UButton
                color="primary"
                :disabled="!newThreadTitle || !newThreadContent || creatingThread"
                :loading="creatingThread"
                @click="createThread"
              >
                Create thread
              </UButton>
            </div>
          </div>
        </UCard>

        <!-- Threads + Posts -->
        <UCard>
          <template #header>
            <div class="flex items-center justify-between gap-3">
              <div class="font-semibold">Threads</div>
              <div class="text-xs opacity-60">
                Select one to view replies
              </div>
            </div>
          </template>

          <div class="grid lg:grid-cols-[1fr_1px_1.4fr] gap-5">
            <!-- Thread list -->
            <div class="space-y-3">
              <div v-if="threadsPending" class="space-y-3">
                <UCard v-for="i in 3" :key="i" class="h-16 animate-pulse" />
              </div>

              <div v-else-if="(threads?.length ?? 0) === 0" class="text-sm opacity-70">
                No threads yet. Start one!
              </div>

              <button
                v-for="t in (threads ?? [])"
                :key="t.id"
                class="w-full text-left rounded-2xl border border-gray-200/50 dark:border-gray-800/60 px-4 py-3
                       hover:bg-gray-50/60 dark:hover:bg-gray-900/40 transition"
                :class="t.id === selectedThreadId ? 'bg-gray-50/80 dark:bg-gray-900/60 border-gray-300/50 dark:border-gray-700/60' : ''"
                @click="selectThread(t.id)"
              >
                <div class="flex items-start justify-between gap-3">
                  <div class="min-w-0">
                    <div class="font-medium truncate">{{ t.title }}</div>
                    <div class="text-xs opacity-60 mt-1">
                      {{ formatTime(t.updatedAt || t.createdAt) }}
                    </div>
                  </div>

                  <div class="shrink-0 flex items-center gap-2">
                    <span class="text-[11px] opacity-60">replies</span>
                    <span
                      class="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800/70 opacity-90"
                    >
                      {{ t.postsCount ?? 0 }}
                    </span>
                  </div>
                </div>
              </button>
            </div>

            <div class="hidden lg:block w-px bg-gray-200/40 dark:bg-gray-800/60 rounded" />

            <!-- Posts -->
            <div class="space-y-4">
              <div v-if="!selectedThreadId" class="text-sm opacity-70 py-2">
                Pick a thread on the left.
              </div>

              <template v-else>
                <div class="flex items-center justify-between">
                  <div class="text-sm font-semibold">Replies</div>
                  <div class="text-xs opacity-60">
                    {{ (posts?.length ?? 0) }} total
                  </div>
                </div>

                <div class="space-y-4 max-h-[460px] overflow-auto pr-1">
                  <div v-if="postsPending" class="space-y-3">
                    <UCard v-for="i in 3" :key="i" class="h-20 animate-pulse" />
                  </div>

                  <div v-else-if="(posts?.length ?? 0) === 0" class="text-sm opacity-70">
                    No replies yet.
                  </div>

                  <div
                    v-for="p in (posts ?? [])"
                    :key="p.id"
                    class="flex gap-3"
                  >
                    <!-- avatar -->
                    <div
                      class="mt-0.5 h-10 w-10 rounded-full bg-gray-200/70 dark:bg-gray-800/70
                             flex items-center justify-center text-xs opacity-60 shrink-0"
                      title="User"
                    >
                      •
                    </div>

                    <div class="min-w-0 flex-1">
                      <div class="text-xs opacity-60">
                        {{ formatTime(p.createdAt) }}
                      </div>
                      <div class="text-sm whitespace-pre-wrap break-words mt-1 leading-relaxed">
                        {{ p.content }}
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Reply box -->
                <div class="pt-4 border-t border-gray-200/40 dark:border-gray-800/60">
                  <UTextarea
                    v-model="newReply"
                    :rows="3"
                    placeholder="Write a reply..."
                  />
                  <div class="flex justify-end mt-3">
                    <UButton
                      color="primary"
                      size="sm"
                      :disabled="!newReply || creatingReply"
                      :loading="creatingReply"
                      @click="createReply"
                    >
                      Reply
                    </UButton>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </UCard>

        <UAlert
          v-if="forumError"
          icon="i-heroicons-exclamation-triangle"
          title="Forum error"
          :description="forumError"
          color="red"
          variant="soft"
        />
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

const courseId = computed(() => String(route.params.id))


const lectures = ref<any[]>([])
const title = ref('')
const creating = ref(false)

function formatTime(iso?: string) {
  if (!iso) return ''
  const d = new Date(iso)

  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yyyy = String(d.getFullYear())

  const hh = String(d.getHours()).padStart(2, '0')
  const min = String(d.getMinutes()).padStart(2, '0')
  const ss = String(d.getSeconds()).padStart(2, '0')

  return `${dd}/${mm}/${yyyy}, ${hh}:${min}:${ss}`
}

async function load() {
  const data = await api(`/courses/${courseId.value}/lectures`)

  // Normalize lecture timestamps if LectureCard prints lecture.createdAt internally
  lectures.value = (data ?? []).map((l: any) => ({
    ...l,
    // keep original in case something else needs it
    createdAtRaw: l.createdAt,
    createdAt: l.createdAt ? formatTime(l.createdAt) : l.createdAt
  }))
}

async function createLecture() {
  if (!auth.isProfessor || !title.value) return

  try {
    creating.value = true
    await api(`/api/courses/${courseId.value}/lectures`, {
      method: 'POST',
      body: {
        title: title.value,
        manifest_url: '' // No video initially
      }
    })

    title.value = ''
    await load()
  } catch (error) {
    console.error('Failed to create lecture:', error)
    alert('Failed to create lecture. Please try again.')
  } finally {
    creating.value = false
  }
}

type Thread = {
  id: string
  courseId: string
  title: string
  createdAt: string
  updatedAt?: string
  postsCount?: number
}

type Post = {
  id: string
  threadId: string
  content: string
  createdAt: string
  createdBySub?: string
}

const threads = ref<Thread[] | null>(null)
const posts = ref<Post[] | null>(null)

const selectedThreadId = ref<string | null>(null)

const threadsPending = ref(false)
const postsPending = ref(false)
const creatingThread = ref(false)
const creatingReply = ref(false)
const forumError = ref<string | null>(null)

const newThreadTitle = ref('')
const newThreadContent = ref('')
const newReply = ref('')

async function loadThreads() {
  forumError.value = null
  threadsPending.value = true
  try {
    // Intentionally /forum/forum/... so gateway becomes /api/forum/forum/...
    const res = await api(`/forum/forum/courses/${courseId.value}/threads`)
    threads.value = res?.threads ?? []

    if (
      selectedThreadId.value &&
      !(threads.value ?? []).some(t => t.id === selectedThreadId.value)
    ) {
      selectedThreadId.value = null
      posts.value = null
    }
  } catch (e: any) {
    console.error('loadThreads failed', e)
    forumError.value = e?.message ?? 'Failed to load threads.'
  } finally {
    threadsPending.value = false
  }
}

async function loadPosts() {
  if (!selectedThreadId.value) return
  forumError.value = null
  postsPending.value = true
  try {
    const res = await api(`/forum/forum/threads/${selectedThreadId.value}/posts`)
    posts.value = res?.posts ?? []
  } catch (e: any) {
    console.error('loadPosts failed', e)
    forumError.value = e?.message ?? 'Failed to load replies.'
  } finally {
    postsPending.value = false
  }
}

async function selectThread(threadId: string) {
  selectedThreadId.value = threadId
  posts.value = null
  await loadPosts()
}

async function createThread() {
  if (!newThreadTitle.value || !newThreadContent.value) return
  forumError.value = null
  creatingThread.value = true

  try {
    // create thread
    const thread: Thread = await api(`/forum/forum/courses/${courseId.value}/threads`, {
      method: 'POST',
      body: { title: newThreadTitle.value, content: newThreadContent.value }
    })

    // create first post (because backend doesn't store content in thread doc)
    await api(`/forum/forum/threads/${thread.id}/posts`, {
      method: 'POST',
      body: { content: newThreadContent.value }
    })

    newThreadTitle.value = ''
    newThreadContent.value = ''

    // auto refresh after successful write
    await loadThreads()
    await selectThread(thread.id)
  } catch (e: any) {
    console.error('createThread failed', e)
    forumError.value = e?.message ?? 'Failed to create thread.'
  } finally {
    creatingThread.value = false
  }
}

async function createReply() {
  if (!selectedThreadId.value || !newReply.value) return
  forumError.value = null
  creatingReply.value = true

  try {
    await api(`/forum/forum/threads/${selectedThreadId.value}/posts`, {
      method: 'POST',
      body: { content: newReply.value }
    })

    newReply.value = ''

    // auto refresh after successful write
    await loadThreads() // updates counts/order
    await loadPosts()
  } catch (e: any) {
    console.error('createReply failed', e)
    forumError.value = e?.message ?? 'Failed to post reply.'
  } finally {
    creatingReply.value = false
  }
}

onMounted(async () => {
  await load()
  await loadThreads()
})

watch(courseId, async () => {
  selectedThreadId.value = null
  posts.value = null
  await load()
  await loadThreads()
})
</script>
