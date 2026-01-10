<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <NuxtLink to="/courses" class="text-sm opacity-70">← Back to courses</NuxtLink>
      <RoleBadge />
    </div>

    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-semibold tracking-tight">Lectures</h1>
      <span class="text-xs opacity-60">
        {{ auth.isProfessor ? 'Professor view' : 'Student view' }}
      </span>
    </div>

    <!-- Add lecture (prof only) -->
    <UCard v-if="auth.isProfessor">
      <div class="space-y-3">
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

    <div class="grid md:grid-cols-2 gap-4">
      <LectureCard
        v-for="l in lectures"
        :key="l.id"
        :lecture="l"
      />
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

async function load() {
  lectures.value = await api(`/courses/${courseId.value}/lectures`)
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

onMounted(load)
</script>
