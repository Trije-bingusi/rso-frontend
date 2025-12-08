<template>
  <div class="max-w-md">
    <UCard>
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon name="i-heroicons-lock-closed" />
          <span class="font-semibold">Sign in to eUčilnica+</span>
        </div>
      </template>

      <div class="space-y-3">
        <p class="text-sm text-gray-600 dark:text-gray-300">
          Authentication is handled by Keycloak.
        </p>

        <UButton color="primary" block @click="login">
          Continue to Keycloak
        </UButton>

        <p class="text-xs text-gray-500">
          You can create an account from the Keycloak login screen.
        </p>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const { $oidc } = useNuxtApp()
const login = async () => {
  await $oidc.login()
}
</script>
