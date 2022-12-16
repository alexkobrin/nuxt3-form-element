// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      apiUrl: process.env.API_BASE_URL,
      strapi: {
        url: process.env.API_BASE_URL || 'http://localhost:1337',  
      },
    },
  },
  app: {
    head: {
      charset: "utf-16",

      title: "Nuxt 3 form",
      meta: [{ name: "description", content: "form " }],
      script: [{}],
    },
  },
  vite: {
    optimizeDeps: {
      include: ["element-plus"],
    },
  },
  modules: ['@nuxtjs/strapi'],
  
});
