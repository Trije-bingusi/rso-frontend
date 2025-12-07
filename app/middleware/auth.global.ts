import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware(async (to) => {
  if (process.server) return

  const auth = useAuthStore()
  const { $oidc } = useNuxtApp()

  // Allow public routes
  const publicPaths = ['/', '/login', '/callback']
  if (publicPaths.includes(to.path)) return

  // Ensure restore completed
  if (!auth.isReady) {
    await $oidc.restore()
  }

  // If still no token -> go login
  if (!auth.token) {
    return navigateTo('/login')
  }
})
