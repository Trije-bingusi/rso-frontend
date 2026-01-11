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
      '/api/courses/**': {
        proxy: `${process.env.NUXT_API_PROXY_TARGET || 'http://localhost:8081'}/api/courses/**`
      },
      '/api/lectures/**': {
        proxy: `${process.env.NUXT_API_PROXY_TARGET || 'http://localhost:8081'}/api/lectures/**`
      },
      '/api/users/**': {
        proxy: `${process.env.NUXT_API_PROXY_TARGET || 'http://localhost:8081'}/api/users/**`
      },
      '/api/forum/**': {
        proxy: `${process.env.NUXT_API_PROXY_TARGET || 'http://localhost:8081'}/api/forum/**`
      },
      '/api/uploads/**': {
        proxy: `${process.env.NUXT_API_PROXY_TARGET || 'http://localhost:8081'}/api/uploads/**`
      },
      '/api/videos/**': {
        proxy: `${process.env.NUXT_API_PROXY_TARGET || 'http://localhost:8081'}/api/videos/**`
      },
      '/api/transcriptions/**': {
        proxy: `${process.env.NUXT_API_PROXY_TARGET || 'http://localhost:8081'}/api/transcriptions/**`
      },
    }
  },

  devtools: { enabled: true }
})