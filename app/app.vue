<template>
  <UApp>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header class="border-b border-gray-200 dark:border-gray-800">
        <div class="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <UIcon name="i-heroicons-academic-cap" class="text-xl" />
            <NuxtLink to="/" class="font-semibold text-lg">RSO Portal</NuxtLink>
          </div>

          <div class="flex items-center gap-2">
            <UButton variant="ghost" to="/courses">Courses</UButton>

            <UChip v-if="auth.isLoggedIn" :text="auth.role" size="xs" />

            <UButton
              v-if="!auth.isLoggedIn"
              color="primary"
              to="/login"
            >
              Login
            </UButton>

            <UButton
              v-else
              variant="soft"
              color="red"
              @click="logout"
            >
              Logout
            </UButton>

            <UColorModeButton />
          </div>
        </div>
      </header>

      <main class="mx-auto max-w-6xl px-4 py-8">
        <NuxtPage />
      </main>
    </div>
  </UApp>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
const auth = useAuthStore()
const { $oidc } = useNuxtApp()

const logout = async () => {
  await $oidc.logout()
}
</script>
