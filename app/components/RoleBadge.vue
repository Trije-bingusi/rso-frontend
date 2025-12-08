<template>
  <UBadge
    size="xs"
    variant="soft"
    :color="color"
  >
    {{ label }}
  </UBadge>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const auth = useAuthStore()

const label = computed(() => {
  if (auth.isProfessor) return 'Professor'
  if (auth.isStudent) return 'Student'
  return 'User'
})

const color = computed(() => {
  if (auth.isProfessor) return 'primary'
  if (auth.isStudent) return 'green'
  return 'gray'
})
</script>
