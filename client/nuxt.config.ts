// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      charset: 'utf-16',
      
      title: 'Nuxt 3 form',
      meta: [
        { name: 'description', content: 'form ' }
      ],
      script: [{}],
     
    },
  },
 
     vite: {
      optimizeDeps: {
        include: ['element-plus'],
      },
    },
});
