<template>
  <div class="space-y-6">
    <NuxtLink to="/courses" class="text-sm opacity-70">← Back</NuxtLink>

    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-semibold">Lectures</h1>
      <span class="text-xs opacity-60">
        {{ auth.isProfessor ? 'Professor view' : 'Student view' }}
      </span>
    </div>

    <UCard>
      <div class="flex flex-col md:flex-row gap-2">
        <UInput v-model="title" placeholder="Lecture title" class="flex-1" />
        <UInput
        v-model="manifest"
        placeholder="Manifest URL"
        />

        <UButton
          color="primary"
          :disabled="!auth.isProfessor || !title || !manifest"
          @click="createLecture"
        >
          Add
        </UButton>
      </div>

      <p v-if="!auth.isProfessor" class="text-xs opacity-60 mt-2">
        Only professors can create lectures.
      </p>
    </UCard>

    <div class="grid gap-3">
      <NuxtLink
        v-for="l in lectures"
        :key="l.id"
        :to="`/lectures/${l.id}`"
        class="rounded-xl border border-slate-200 dark:border-slate-800 p-4 hover:bg-slate-50 dark:hover:bg-slate-900/40 transition"
      >
        <div class="font-medium">{{ l.title }}</div>
        <div class="text-xs opacity-60">{{ l.created_at }}</div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const auth = useAuthStore()
const api = useApi()
const route = useRoute()

const courseId = computed(() => String(route.params.id))

const lectures = ref<any[]>([])
const title = ref('')
const manifest = ref('')

async function load() {
  lectures.value = await api(`/api/courses/${courseId.value}/lectures`)
}

async function createLecture() {
  if (!auth.isProfessor) return
  if (!title.value || !manifest.value) return

  await api(`/api/courses/${courseId.value}/lectures`, {
    method: 'POST',
    body: {
      title: title.value,
      manifest_url: manifest.value // no more null
    }
  })

  title.value = ''
  manifest.value = ''
  await load()
}

onMounted(load)
</script>
