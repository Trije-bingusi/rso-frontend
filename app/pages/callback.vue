<template>
  <div class="flex items-center gap-2">
    <NuxtLoadingIndicator />
    <span>Signing you in...</span>
  </div>
</template>

<script setup lang="ts">
const { $oidc } = useNuxtApp()

onMounted(async () => {
  await $oidc?.handleCallback?.()
  await navigateTo('/courses')
})
</script>
