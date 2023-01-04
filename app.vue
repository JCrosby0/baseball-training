<template >
  <div v-if="user" :class="{
  dark: darkMode
}" class=" h-full">
    <NavBar :darkMode="darkMode" @toggleDarkMode="toggleDarkMode" />
    <NuxtPage class="" />
  </div>
  <Auth v-else />

</template>

<script setup>

const config = useRuntimeConfig();
const appConfig = useAppConfig();

const darkMode = ref(false);

const { auth } = useSupabaseClient();
const user = useSupabaseUser();

const toggleDarkMode = () => {
  darkMode.value = !darkMode.value
  document.querySelector('body').classList.toggle('dark')
}

</script>



<style>
#app,
body,
#__nuxt {
  height: 100vh;

}
</style>
