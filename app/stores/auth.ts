import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(null)
  const roles = ref<string[]>([])
  const profile = ref<any>(null)
  const isReady = ref(false)

  const isLoggedIn = computed(() => !!token.value)
  const isProfessor = computed(() => roles.value.includes('professor'))
  const isStudent = computed(() => roles.value.includes('student'))

  function setToken(t: string, r: string[] = []) {
    token.value = t
    roles.value = r
    if (import.meta.client) {
      localStorage.setItem('rso_access_token', t)
      localStorage.setItem('rso_roles', JSON.stringify(r))
    }
  }

  function clear() {
    token.value = null
    roles.value = []
    profile.value = null
    isReady.value = true
    if (import.meta.client) {
      localStorage.removeItem('rso_access_token')
      localStorage.removeItem('rso_roles')
    }
  }

  function hasRole(role: string) {
    return roles.value.includes(role)
  }

  async function loadProfile() {
    if (!token.value) {
      profile.value = null
      return
    }
    try {
      const config = useRuntimeConfig()
      profile.value = await $fetch(`${config.public.apiBase}/api/users/me`, {
        headers: { Authorization: `Bearer ${token.value}` }
      })
    } catch {
      profile.value = null
    }
  }

  function restoreLocal() {
    if (!import.meta.client) return
    const t = localStorage.getItem('rso_access_token')
    const r = localStorage.getItem('rso_roles')
    if (t) token.value = t
    if (r) roles.value = JSON.parse(r)
  }

  return {
    token, roles, profile, isReady,
    isLoggedIn, isProfessor, isStudent,
    setToken, clear, hasRole, loadProfile, restoreLocal
  }
})
