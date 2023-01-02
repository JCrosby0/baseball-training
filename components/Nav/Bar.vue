<template>
  <nav class="bg-white border-gray-200 px-2 sm:px-4 py-2.5 rounded dark:bg-gray-900">
    <div class="container flex flex-wrap items-center justify-between mx-auto">
      <div href="/" class="flex h-fit">
        <NuxtLink class="p-3 text-xl font-semibold whitespace-nowrap dark:text-white" to="/">
          Baseball
          Training
        </NuxtLink>
      </div>
      <div class="flex items-center md:order-2">
        <button type="button"
          class="flex mr-3 text-sm bg-gray-800 rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
          id="user-menu-button" aria-expanded="false" data-dropdown-toggle="user-dropdown"
          data-dropdown-placement="bottom" @click="toggleAccount">
          <span class="sr-only">Open user menu</span>
          <!-- <img class="w-8 h-8 rounded-full" src="/docs/images/people/profile-picture-3.jpg" alt="user photo"> -->
          <span class="w-8 h-8 rounded-full text-2xl">👤</span>
        </button>
        <!-- Dropdown menu -->
        <div v-show="accountOpen"
          class="z-50 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700 dark:divide-gray-600 absolute top-14 right-4"
          id="user-dropdown">
          <NavAccount class="p-2" />
        </div>
        <button data-collapse-toggle="mobile-menu-2" type="button"
          class="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
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
      <div v-show="menuOpen" class="items-center justify-between  w-full md:flex md:w-auto md:order-1"
        id="mobile-menu-2">
        <ul
          class="flex flex-col p-4 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
          <li v-for="menuOption in menuOptions" :key="menuOption.path">
            <NuxtLink aria-current="page"
              class="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
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

const accountOpen = ref(false)
const menuOpen = ref(true)

const toggleAccount = () => {
  accountOpen.value = !accountOpen.value
}
const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
}
const closeMenu = () => {
  menuOpen.value = false
}
const closeAccount = () => {
  accountOpen.value = false
}

const menuOptions = [
  { display: 'Home', path: '/' },
  { display: 'About', path: '/about' },
  { display: 'Videos', path: '/videos' },
  { display: 'Scenarios', path: '/diamond' },
  { display: 'Contact', path: '/contact' },
]

</script>