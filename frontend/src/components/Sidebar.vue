<template>
  <button
    @click="isOpen = !isOpen"
    class="md:hidden fixed top-6 left-0 z-50 bg-white dark:bg-stone-800 p-1.5 rounded-r-lg border-r border-b border-t border-stone-300 dark:border-stone-600 active:scale-95 transition-all"
  >
    <FontAwesomeIcon :icon="faBars" class="text-xl text-stone-800 dark:text-stone-200" />
  </button>

  <div :class="[
    'fixed top-0 left-0 bottom-0 right-0 backdrop-blur-3xl bg-gradien',
    'bg-linear-to-br via-transparent from-black/25 to-transparent dark:from-white/10 dark:to-white/5',
    isOpen ? 'fixed' : 'hidden']"
  />

  <nav
    :class="[
      'fixed w-64 xl:w-72 my-6 mx-12 transition-transform duration-300 md:translate-x-0',
      isOpen ? 'translate-x-0' : '-translate-x-120'
    ]"
  >
    <div class="bg-white dark:bg-stone-900 rounded-[17px] flex flex-col p-3 border border-stone-300 dark:border-stone-700">
      <div class="px-3 py-2 flex flex-col gap-2.5">
        <img src="/img/nikolai.jpg" alt="Nikolai Zakharov" class="rounded-full w-32" />
        <div>
          <h2 class="font-bold text-xl dark:text-stone-100">Nikolai Zakharov</h2>
          <span class="text-stone-700 dark:text-stone-400">&commat;ptchtrns</span>
        </div>
        <div class="flex gap-2">
          <a
            v-for="socialMediaIcon in socialMediaIcons"
            :key="socialMediaIcon.url"
            :href="socialMediaIcon.url"
            target="_blank"
            rel="noopener noreferrer"
            class="text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white active:scale-92 transition-all"
          >
            <FontAwesomeIcon :icon="socialMediaIcon.icon" class="text-xl" />
          </a>
        </div>
      </div>

      <ul class="flex flex-col">
        <li v-for="navItem in navItems" :key="navItem.url">
          <RouterLink
            :to="navItem.url"
            class="w-full py-1.5 px-3 flex gap-4
              text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white
              hover:bg-linear-to-r from-stone-100 via-stone-100 to-stone-50 dark:from-stone-800 dark:via-stone-800 dark:to-stone-900
              border border-transparent hover:border-stone-200 dark:hover:border-stone-600
              rounded-lg active:scale-99 transition-all"
          >
            <span class="w-4"><FontAwesomeIcon :icon="navItem.icon" /></span>
            <span>{{ navItem.title }}</span>
          </RouterLink>
        </li>
      </ul>
    </div>

    <footer class="px-6 flex justify-between mt-4">
      <div class="flex gap-2">
        <button
          v-for="theme in themes"
          :key="theme.theme"
          :class="[
            'cursor-pointer active:scale-92 transition-all',
            isActive(theme.theme) 
              ? 'text-blue-700' 
              : 'text-stone-400 hover:text-stone-600 dark:text-stone-400 dark:hover:text-stone-200'
          ]"
          @click="theme.action"
        >
          <FontAwesomeIcon :icon="theme.icon" />
        </button>
      </div>

      <div class="flex gap-2">
        <!-- Language switching placeholder -->
      </div>
    </footer>
  </nav>
</template>


<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faGithub, faLinkedin, type IconDefinition } from '@fortawesome/free-brands-svg-icons';
import { faBars, faCircleHalfStroke, faHeadphones, faImages, faMoon, faSun, faUser } from '@fortawesome/free-solid-svg-icons';
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { applyTheme, type Theme } from '@/theme';

const isOpen = ref(false)
const route = useRoute();

// Close menu on route change
watch(
  () => route.fullPath,
  () => {
    isOpen.value = false;
  }
);
const socialMediaIcons = [
  {
    url: "https://github.com/ptchtrns",
    icon: faGithub,
  },
  {
    url: "https://www.linkedin.com/in/ptchtrns/",
    icon: faLinkedin,
  },
]
const navItems = [
  {
    title: "About me",
    url: "/",
    icon: faUser,
  },
  {
    title: "Gallery",
    url: "/gallery",
    icon: faImages,
  },
  {
    title: "Audio",
    url: "/audio",
    icon: faHeadphones,
  },
]

const currentTheme = ref('system')

const updateCurrentTheme = () => {
  const saved = localStorage.getItem('theme')
  if (saved === 'dark' || saved === 'light') currentTheme.value = saved
  else currentTheme.value = 'system'
}

const handleSystemChange = (e: MediaQueryListEvent) => {
  if (!localStorage.getItem('theme')) {
    applyTheme(e.matches ? 'dark' : 'light')
    currentTheme.value = 'system'
  }
}

let mediaQuery: MediaQueryList | null = null

onMounted(() => {
  updateCurrentTheme()
  // Optionally watch system changes if needed
  mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  mediaQuery.addEventListener('change', handleSystemChange)
})

onBeforeUnmount(() => {
  if (mediaQuery) {
    mediaQuery.removeEventListener('change', handleSystemChange)
  }
})

const setDark = () => {
  applyTheme('dark')
  currentTheme.value = 'dark'
}
const setLight = () => {
  applyTheme('light')
  currentTheme.value = 'light'
}
const setSystem = () => {
  applyTheme('system')
  currentTheme.value = 'system'
}

const isActive = (theme: Theme) => currentTheme.value === theme

const themes: {theme: Theme, icon: IconDefinition, action: () => void}[] = [
  { theme: 'dark', icon: faMoon, action: setDark },
  { theme: 'light', icon: faSun, action: setLight },
  { theme: 'system', icon: faCircleHalfStroke, action: setSystem },
]
</script>