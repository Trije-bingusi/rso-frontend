<template>
  <div class="min-h-dvh bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-50">
    <header class="sticky top-0 z-40 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur">
      <div class="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <NuxtLink to="/" class="flex items-center gap-2">
          <div class="h-8 w-8 rounded-xl bg-primary-500/15 flex items-center justify-center">
            <UIcon name="i-heroicons-academic-cap" class="text-primary-500" />
          </div>
          <span class="font-semibold tracking-tight">eUčilnica+</span>
        </NuxtLink>

        <nav class="hidden md:flex items-center gap-1">
          <UButton to="/courses" variant="ghost">Courses</UButton>
        </nav>

        <div class="flex items-center gap-2">
          <!-- keep your existing theme toggle if you already have one -->
          <ThemeToggle />

          <template v-if="auth.isReady && auth.isLoggedIn">
            <UDropdown :items="userItems">
              <UButton variant="soft">
                <UIcon name="i-heroicons-user-circle" />
                <span class="hidden sm:inline">
                  {{ auth.profile?.username ?? 'Account' }}
                </span>
              </UButton>
            </UDropdown>
          </template>

          <template v-else>
            <UButton to="/login" color="primary" variant="soft">
              Sign in
            </UButton>
          </template>
        </div>
      </div>
    </header>

    <main class="mx-auto max-w-6xl px-4 py-8">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const auth = useAuthStore()
const { $oidc } = useNuxtApp()

const userItems = computed(() => [
  [
    {
      label: auth.isProfessor ? 'Professor' : auth.isStudent ? 'Student' : 'User',
      disabled: true
    }
  ],
  [
    {
      label: 'Logout',
      icon: 'i-heroicons-arrow-right-on-rectangle',
      click: async () => {
        await $oidc.logout()
      }
    }
  ]
])
</script>
