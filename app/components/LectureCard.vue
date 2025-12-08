<template>
  <NuxtLink :to="`/lectures/${lecture.id}`" class="block group">
    <UCard class="transition group-hover:shadow-sm">
      <div class="flex items-center justify-between">
        <div>
          <div class="font-medium">{{ lecture.title }}</div>
          <div class="text-xs opacity-60 mt-1">
            {{ lecture.created_at }}
          </div>
        </div>
        <UIcon name="i-heroicons-play-circle" class="opacity-50 text-xl" />
      </div>
    </UCard>
  </NuxtLink>
</template>

<script setup lang="ts">
defineProps<{
  lecture: { id: string | number, title: string, created_at: string }
}>()
</script>
