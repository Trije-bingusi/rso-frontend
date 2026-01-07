import { useAuthStore } from '~/stores/auth'

export const useApi = () => {
  const config = useRuntimeConfig()
  const auth = useAuthStore()

  return $fetch.create({
    baseURL: config.public.apiBase, // '/api'
    onRequest({ options }) {
      if (auth.token) {
        options.headers = {
          ...(options.headers as Record<string, string> ?? {}),
          Authorization: `Bearer ${auth.token}`
        }
      }
    }
  })
}
