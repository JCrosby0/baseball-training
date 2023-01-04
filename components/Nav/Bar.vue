<template>
  <nav class="container border-gray-200 px-2 sm:px-4 py-2.5 rounded ">
    <div class="w-full flex flex-wrap items-center justify-between">
      <!-- Title / Home Link -->
      <div href="/" class="flex h-fit">
        <NuxtLink class="text-xl font-semibold whitespace-nowrap " to="/">
          Baseball
          Training
        </NuxtLink>
      </div>

      <!-- User Menu -->
      <div class="flex md:order-2">

        <!-- Dark Mode Slider -->
        <Slider :status="darkMode" @toggle="toggleDarkMode" rounded class="pr-4">
          <template #before>○</template>
          <template #after>●</template>
        </Slider>

        <!-- User Icon -->
        <button type="button"
          class="flex mr-3 text-sm bg-gray-50 dark:bg-gray-800 rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
          id="user-menu-button" aria-expanded="false" data-dropdown-toggle="user-dropdown"
          data-dropdown-placement="bottom" @click="toggleAccount">
          <span class="sr-only">Open user menu</span>
          <!-- <img class="w-8 h-8 rounded-full" src="/docs/images/people/profile-picture-3.jpg" alt="user photo"> -->
          <span class="w-8 h-8 rounded-full text-2xl">👤</span>
        </button>

        <!-- User Dropdown menu -->
        <div v-show="accountOpen"
          class="z-50 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700 dark:divide-gray-600 absolute top-14 right-4"
          id="user-dropdown">
          <NavAccount class="p-2" />
        </div>

        <!-- Menu Hamburger -->
        <button data-collapse-toggle="mobile-menu-2" type="button"
          class="inline-flex p-2 ml-1 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="mobile-menu-2" aria-expanded="false" @click="toggleMenu">
          <span class="sr-only">Open main menu</span>
          <svg class="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clip-rule="evenodd"></path>
          </svg>
        </button>
      </div>
      <!-- Link Menu -->
      <div v-show="menuOpen" class=" justify-between  w-full md:flex md:w-auto md:order-1 h-full" id="mobile-menu-2">
        <ul
          class="flex flex-col mt-4 border border-gray-400 rounded-lg bg-gray-300 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0  dark:bg-gray-700  dark:border-gray-600">
          <li v-for="menuOption in menuOptions" :key="menuOption.path">
            <NuxtLink aria-current="page"
              class="block py-4 px-6 text-gray-700 rounded hover:bg-gray-50 dark:text-gray-400  dark:hover:bg-gray-700 dark:hover:text-white dark:border-gray-700"
              :to="menuOption.path">{{ menuOption.display }}</NuxtLink>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>


<style>
.nuxt-link-active {
  color: white;
  background: blue;
  border-radius: 50%;
  /* bg transparent above size threshold
   text blue above threshold */
}
</style>

<script setup>

const props = defineProps({
  darkMode: Boolean
})

const accountOpen = ref(false)
const menuOpen = ref(true)

const toggleAccount = () => {
  accountOpen.value = !accountOpen.value
}
const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
}

const emit = defineEmits(['toggleDarkMode'])
const toggleDarkMode = () => {
  emit('toggleDarkMode')
}
const closeMenu = () => {
  menuOpen.value = false
}
const closeAccount = () => {
  accountOpen.value = false
}

const menuOptions = [
  { display: 'Home', path: '/' },
  { display: 'Browse', path: '/browse' },
  { display: 'My Training', path: '/training' },
  { display: 'Scenarios', path: '/diamond' },
]

</script>