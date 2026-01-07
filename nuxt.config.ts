export default defineNuxtConfig({
  modules: ['@nuxt/ui', '@pinia/nuxt'],
  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '/api',
      kcUrl: process.env.NUXT_PUBLIC_KC_URL || 'http://localhost:8080',
      kcRealm: process.env.NUXT_PUBLIC_KC_REALM || 'rso',
      kcClientId: process.env.NUXT_PUBLIC_KC_CLIENT_ID || 'rso-frontend',
    }
  },

  nitro: {
    routeRules: {
      '/api/**': {
        proxy: `${process.env.NUXT_API_PROXY_TARGET || 'http://localhost:8081'}/api/**`
      }
    }
  },

  devtools: { enabled: true }
})
