<template >
  <div v-if="user" :class="{ dark: darkMode }">
    <NavBar />
    <NuxtPage />
  </div>
  <Auth v-else />

</template>

<script setup>

const config = useRuntimeConfig();
const appConfig = useAppConfig();

const darkMode = ref(true);

const { auth } = useSupabaseClient();
const user = useSupabaseUser();

</script>



<style>
#app,
body {
  min-height: 100vh;
}
</style>
