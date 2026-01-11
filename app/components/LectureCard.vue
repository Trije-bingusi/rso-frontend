<template>
  <NuxtLink
  :to="{ path: `/lectures/${lecture.id}`, query: { courseId: String(route.params.id) } }"
  class="block group">
    <UCard class="transition group-hover:shadow-sm">
      <div class="flex items-center justify-between">
        <div>
          <div class="font-medium">{{ lecture.title }}</div>
          <div class="text-xs opacity-60 mt-1">
            {{ formattedCreatedAt }}
          </div>
        </div>
        <UIcon name="i-heroicons-play-circle" class="opacity-50 text-xl" />
      </div>
    </UCard>
  </NuxtLink>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  lecture: { id: string | number, title: string, created_at: string }
}>()

const route = useRoute()

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

const formattedCreatedAt = computed(() => formatTime(props.lecture.created_at))
</script>
