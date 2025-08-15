// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  nitro: {
    prerender: {
      concurrency: 4,
      interval: 500,
    },
    compressPublicAssets: { gzip: true, brotli: true },
    routeRules: {
      "/_nuxt/**": {
        headers: { "Cache-Control": "public, max-age=31536000, immutable" },
      },
      "/public/**": {
        headers: { "Cache-Control": "public, max-age=2592000, immutable" }, // 30 дней
      },
      "/image/**": {
        headers: { "Cache-Control": "public, max-age=604800, immutable" }, // 7 дней
      },
    },
  },
  app: {
    head: {
      viewport:
        "width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=no",
      htmlAttrs: { dir: "ltr", lang: "ru" },
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon/favicon.ico" },
      ],
      meta: [
        { name: "mobile-web-app-capable", content: "yes" },
        { name: "apple-mobile-web-app-status-bar-style", content: "default" },
      ],
    },
    baseURL: "/",
  },
  ssr: true,

  components: [
    {
      path: "~/components",
    },
  ],

  css: ["~/assets/scss/main.scss"],

  devtools: {
    enabled: true,
    timeline: {
      enabled: true,
    },
  },
  modules: [
    "@pinia/nuxt",
    "@nuxt/image",
    "nuxt-lazy-hydrate",
    "nuxt-svgo",
    "nuxt-viewport",
  ],

  viewport: {
    breakpoints: {
      mobile: 375,
      tablet: 960,
      desktop: 1440,
    },
  },

  pages: true,

  experimental: {
    componentIslands: {
      selectiveClient: true,
    },
  },

  vite: {
    build: {
      target: ["esnext", "es2022"],
    },
    esbuild: {
      target: "es2022",
    },
    optimizeDeps: {
      esbuildOptions: {
        target: "es2022",
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @use "~/assets/scss/color-variables" as *;
            @use "~/assets/scss/fonts/typography" as *;
          `,
        },
      },
    },
  },


  svgo: {
    global: false,
  },

  runtimeConfig: {
    public: {
      apiUrl: process.env.NUXT_API_URL,
    },
  },

  compatibilityDate: '2025-07-15',
})
