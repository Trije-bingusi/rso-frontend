<template>
  <ClientOnly>
    <UButton variant="ghost" @click="toggle" aria-label="Toggle theme">
      <UIcon :name="isDark ? 'i-heroicons-moon' : 'i-heroicons-sun'" />
    </UButton>

    <template #fallback>
      <UButton variant="ghost" aria-label="Toggle theme" disabled>
        <UIcon name="i-heroicons-sun" />
      </UButton>
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')
const toggle = () => {
  colorMode.preference = isDark.value ? 'light' : 'dark'
}
</script>
