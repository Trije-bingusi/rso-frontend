<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-semibold">Courses</h2>

      <UButton
        v-if="auth.isProfessor"
        color="primary"
        @click="openCreate = true"
      >
        New course
      </UButton>
    </div>

    <UCard>
      <div v-if="pending" class="py-6">
        <NuxtLoadingIndicator /> Loading...
      </div>

      <div v-else-if="(courses?.length ?? 0) === 0" class="text-gray-500">
        No courses yet.
      </div>

      <div v-else class="space-y-2">
        <NuxtLink
          v-for="c in courses"
          :key="c.id"
          :to="`/courses/${c.id}`"
          class="block rounded-lg px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <div class="font-medium">{{ c.name }}</div>
          <div class="text-xs text-gray-500">
            {{ new Date(c.created_at).toLocaleString() }}
          </div>
        </NuxtLink>
      </div>
    </UCard>

    <UModal v-model="openCreate">
      <UCard>
        <template #header>
          <div class="font-semibold">Create course</div>
        </template>

        <div class="space-y-3">
          <UInput v-model="newName" placeholder="Course name" />

          <div class="flex justify-end gap-2">
            <UButton variant="ghost" @click="openCreate = false">Cancel</UButton>
            <UButton color="primary" :disabled="!newName" @click="createCourse">
              Create
            </UButton>
          </div>
        </div>
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const auth = useAuthStore()
const api = useApi()

const openCreate = ref(false)
const newName = ref('')

const { data: courses, pending, refresh } = await useAsyncData(
  'courses',
  () => api('/api/courses'),
  { server: false }
)

async function createCourse() {
  await api('/api/courses', {
    method: 'POST',
    body: { name: newName.value }
  })
  newName.value = ''
  openCreate.value = false
  await refresh()
}
</script>
