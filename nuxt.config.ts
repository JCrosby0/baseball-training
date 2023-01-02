// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      test: process.env.NUXT_PUBLIC_VARIABLE,
      supabaseURL: process.env.NUXT_SUPABASE_URL,
      supabaseKey: process.env.NUXT_SUPABASE_ANON_KEY,
    },
    postgresDbPass: process.env.POSTGRES_DB_PASS,
    postgressDbURL: process.env.POSTGRES_DB_URL,
  },
  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt", "@nuxtjs/supabase"],
  css: ["@/assets/css/tailwind.css", "@/assets/css/main.css"],
});
