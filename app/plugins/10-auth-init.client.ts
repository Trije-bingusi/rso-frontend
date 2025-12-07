import { useAuthStore } from '~/stores/auth'

export default defineNuxtPlugin(async (nuxtApp) => {
  const auth = useAuthStore()

  // $oidc may be unavailable
  const oidc = (nuxtApp as any).$oidc

  try {
    if (oidc?.restore) {
      await oidc.restore()
    } else {
      // Fallback so the UI doesn't hang forever
      auth.isReady = true
    }
  } catch (e) {
    auth.isReady = true
  }
})
