import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware(async (to) => {
  if (process.server) return

  const auth = useAuthStore()
  const { $oidc } = useNuxtApp()

  const publicPaths = ['/login', '/callback']
  if (publicPaths.includes(to.path)) return

  if (!auth.isReady) {
    await $oidc.restore()
  }

  if (!auth.token) {
    return navigateTo('/login')
  }
})
