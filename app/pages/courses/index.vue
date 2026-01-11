<template>
  <div class="space-y-6">
    <div class="flex items-end justify-between">
      <div>
        <h1 class="text-2xl font-semibold tracking-tight">Courses</h1>
        <p class="text-xs opacity-60">
          {{ auth.isProfessor ? 'Professor view' : 'Student view' }}
        </p>
      </div>
    </div>

    <!-- Courses grid -->
    <div v-if="pending" class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <UCard v-for="i in 6" :key="i" class="h-28 animate-pulse" />
    </div>

    <template v-else>
      <div
        v-if="(courses?.length ?? 0) === 0"
        class="text-sm opacity-70"
      >
        No courses yet.
      </div>

      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <CourseCard
          v-for="c in (courses ?? [])"
          :key="c.id"
          :course="c"
        />
      </div>
    </template>

    <UCard v-if="auth.isProfessor">
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon name="i-heroicons-plus-circle" />
          <div class="font-semibold">Create course</div>
        </div>
      </template>

      <div class="space-y-3">
        <UInput
          v-model="newName"
          placeholder="Course name"
        />

        <div class="flex justify-end">
          <UButton
            color="primary"
            :disabled="!newName"
            @click="createCourse"
          >
            Add course
          </UButton>
        </div>

        <p class="text-xs opacity-60">
          This is visible only to professors.
        </p>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const auth = useAuthStore()
const api = useApi()

const newName = ref('')

const { data: courses, pending, refresh } = await useAsyncData(
  'courses',
  () => api('/courses'),
  { server: false }
)

async function createCourse() {
  if (!auth.isProfessor) return
  if (!newName.value) return

  await api('/courses', {
    method: 'POST',
    body: { name: newName.value }
  })

  newName.value = ''
  await refresh()
}
</script>
