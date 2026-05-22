// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  app: {
    head: {
      title: 'Демо',
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      ],
    },
  },
  modules: ['@nuxtjs/tailwindcss', '@tresjs/nuxt'],
  components: [
    { path: '~/components', pathPrefix: false },
  ],
  runtimeConfig: {
    public: {
      /** S3 (or CDN) folder without trailing slash; file name = `{modelId}.glb` */
      modelBaseUrl:
        process.env.NUXT_PUBLIC_MODEL_BASE_URL
        ?? 'https://s3.twcstorage.ru/namazov-pro/demo_3d',
    },
  },
  vite: {
    optimizeDeps: {
      include: [
        '@tresjs/cientos',
        '@tresjs/core',
        'three',
      ]
    }
  }
})