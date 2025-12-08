<template>
  <header
    class="sticky top-0 z-40 border-b border-gray-200 dark:border-gray-800
           bg-white/80 dark:bg-gray-950/70 backdrop-blur"
  >
    <div class="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
      <!-- Brand -->
      <NuxtLink to="/" class="flex items-center gap-2">
        <div class="h-9 w-9 rounded-xl bg-primary-500/10 flex items-center justify-center">
          <UIcon name="i-heroicons-academic-cap" class="text-primary-500 text-xl" />
        </div>
        <div class="leading-tight">
          <div class="font-semibold tracking-tight">eUčilnica+</div>
          <div class="text-[10px] opacity-60">Learning portal</div>
        </div>
      </NuxtLink>

      <!-- Nav -->
      <nav class="hidden md:flex items-center gap-1">
        <UButton to="/courses" variant="ghost" icon="i-heroicons-squares-2x2">
          Courses
        </UButton>
      </nav>

      <!-- Actions -->
      <div class="flex items-center gap-2">
        <ThemeToggle />

        <template v-if="auth.isReady && auth.isLoggedIn">
          <RoleBadge class="hidden sm:inline-flex" />

          <span class="hidden sm:inline text-xs opacity-70">
            {{ auth.profile?.username ?? '' }}
          </span>

          <UButton
            variant="soft"
            color="red"
            icon="i-heroicons-arrow-right-on-rectangle"
            @click="logout"
          >
            Logout
          </UButton>
        </template>

        <template v-else>
          <UButton to="/login" color="primary" variant="soft">
            Sign in / Register
          </UButton>
        </template>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const auth = useAuthStore()
const nuxtApp = useNuxtApp()
const oidc = (nuxtApp as any).$oidc

const logout = async () => {
  await oidc?.logout?.()
}
</script>
