<template>
  <UButton variant="ghost" @click="toggle" aria-label="Toggle theme">
    <UIcon :name="isDark ? 'i-heroicons-moon' : 'i-heroicons-sun'" />
  </UButton>
</template>

<script setup lang="ts">
const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')
const toggle = () => {
  colorMode.preference = isDark.value ? 'light' : 'dark'
}
</script>
