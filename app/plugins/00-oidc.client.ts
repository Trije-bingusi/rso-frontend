import { UserManager, WebStorageStateStore } from 'oidc-client-ts'
import { useAuthStore } from '~/stores/auth'

function base64UrlDecode(input: string) {
  // JWT payload is base64url, not plain base64
  const base64 = input.replace(/-/g, '+').replace(/_/g, '/')
  const pad = base64.length % 4
  const padded = pad ? base64 + '='.repeat(4 - pad) : base64
  return atob(padded)
}

function getRealmRolesFromToken(token?: string): string[] {
  if (!token) return []
  const parts = token.split('.')
  if (parts.length < 2) return []
  try {
    const payload = JSON.parse(base64UrlDecode(parts[1]))
    return payload?.realm_access?.roles ?? []
  } catch {
    return []
  }
}

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig().public
  const auth = useAuthStore()

  const authority = `${config.kcUrl}/realms/${config.kcRealm}`

  const mgr = new UserManager({
    authority,
    client_id: config.kcClientId,
    redirect_uri: `${window.location.origin}/callback`,
    post_logout_redirect_uri: `${window.location.origin}/`,
    response_type: 'code',
    scope: 'openid profile email',
    // Good for SPA sessions
    userStore: new WebStorageStateStore({ store: window.localStorage })
  })

  const api = {
    mgr,

    async login() {
      await mgr.signinRedirect()
    },

    async logout() {
      auth.clear()
      await mgr.signoutRedirect()
    },

    async handleCallback() {
      const user = await mgr.signinRedirectCallback()
      const token = user?.access_token || ''
      const roles = getRealmRolesFromToken(token)

      auth.setToken(token, roles)
      await auth.loadProfile()
      auth.isReady = true
    },

    async restore() {
      try {
        const user = await mgr.getUser()
        const token = user?.access_token

        if (token) {
          const roles = getRealmRolesFromToken(token)
          auth.setToken(token, roles)
          await auth.loadProfile()
        }
      } finally {
        auth.isReady = true
      }
    }
  }

  return {
    provide: {
      oidc: api
    }
  }
})
