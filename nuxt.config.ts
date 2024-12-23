// https://nuxt.com/docs/api/configuration/nuxt-config
import Aura from "@primevue/themes/aura";

export default defineNuxtConfig({
  ssr: false,
  modules: [
    '@unocss/nuxt',
    '@nuxt/icon',
    '@primevue/nuxt-module'
  ],
  app: {
    head: {
      title: 'POS Sistemi'
    }
  },
  imports: {
    dirs: ['composables', 'composables/data']
  },
  build: {
    transpile: ['axios']
  },
  devtools: { enabled: true }
})