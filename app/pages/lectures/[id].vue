<template>
  <div class="space-y-6">
    <NuxtLink to="/courses" class="text-sm opacity-70">← Back to courses</NuxtLink>

    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-semibold">{{ lecture?.title ?? 'Lecture' }}</h1>
    </div>

    <!-- VIDEO -->
    <UCard v-if="lecture?.manifest_url">
      <LecturePlayer :src="lecture.manifest_url" />
    </UCard>

    <!-- NOTES -->
    <div class="space-y-4">
      <h2 class="text-xl font-semibold">Notes</h2>

      <UCard v-if="auth.isStudent">
        <div class="space-y-3">
          <UTextarea v-model="content" :rows="3" placeholder="Write a note..." />
          <div class="flex justify-end">
            <UButton color="primary" :disabled="!content" @click="createNote">
              Save note
            </UButton>
          </div>
        </div>
      </UCard>

      <UAlert
        v-else
        icon="i-heroicons-information-circle"
        title="Notes are student-only"
        description="Students can create and view their notes for each lecture."
      />

      <div class="grid gap-3">
        <UCard v-for="n in notes" :key="n.id">
          <div class="text-sm whitespace-pre-wrap">{{ n.content }}</div>
          <div class="text-xs opacity-60 mt-2">{{ n.created_at }}</div>
        </UCard>
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
  lecture.value = await api(`/api/lectures/${lectureId.value}`)
}

async function loadNotes() {
  notes.value = await api(`/api/lectures/${lectureId.value}/notes`)
}

async function createNote() {
  if (!auth.isStudent) return
  await api(`/api/lectures/${lectureId.value}/notes`, {
    method: 'POST',
    body: { content: content.value }
  })
  content.value = ''
  await loadNotes()
}

onMounted(async () => {
  await Promise.all([loadLecture(), loadNotes()])
})
</script>
