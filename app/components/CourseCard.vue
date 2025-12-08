<template>
  <NuxtLink :to="`/courses/${course.id}`" class="block group">
    <UCard
      class="h-full transition
             group-hover:-translate-y-0.5 group-hover:shadow-md"
    >
      <div class="flex items-start justify-between gap-3">
        <div>
          <div class="font-semibold">{{ course.name }}</div>
          <div class="text-xs opacity-60 mt-1">
            {{ new Date(course.created_at).toLocaleString() }}
          </div>
        </div>

        <UIcon name="i-heroicons-chevron-right" class="opacity-40 mt-1" />
      </div>
    </UCard>
  </NuxtLink>
</template>

<script setup lang="ts">
defineProps<{
  course: { id: string | number, name: string, created_at: string }
}>()
</script>
