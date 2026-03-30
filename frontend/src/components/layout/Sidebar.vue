<template>
  <Button
    variant="outline"
    size="icon"
    @click="isOpen = !isOpen"
    aria-label="Open menu"
    class="md:hidden fixed top-6 left-0 z-50 rounded-l-none rounded-r-lg border-l-0 bg-white dark:bg-stone-800 border-stone-300 dark:border-stone-600 active:scale-95"
  >
    <FontAwesomeIcon :icon="faBars" class="text-stone-800 dark:text-stone-200" />
  </Button>

  <div :class="[
    'fixed top-0 left-0 bottom-0 right-0 backdrop-blur-3xl bg-gradient',
    'bg-linear-to-br via-transparent from-black/25 to-transparent dark:from-white/10 dark:to-white/5',
    isOpen ? 'block md:hidden fixed' : 'hidden']"
    @click="closeMenu"
  />

  <nav
    :class="[
      'fixed w-64 xl:w-72 my-6 mx-12 transition-transform duration-300 md:translate-x-0',
      isOpen ? 'translate-x-0' : '-translate-x-120'
    ]"
  >
    <Card class="bg-white dark:bg-stone-900 rounded-[17px] flex flex-col p-3 border border-stone-300 dark:border-stone-700">
      <div class="px-3 pt-2 flex flex-col gap-2.5">
        <img src="/img/nikolai.jpg" alt="Nikolai Zakharov" class="rounded-full w-32" />
        <div>
          <h2 class="font-bold text-xl dark:text-stone-100">Nikolai Zakharov</h2>
          <span class="text-stone-700 dark:text-stone-400">&commat;ptchtrns</span>
        </div>
      </div>

      <ul class="flex flex-col">
        <li v-for="navItem in navItems" :key="navItem.url">
          <RouterLink
            :to="navItem.url"
            :class="['w-full py-1.5 px-3 flex gap-4',
              route.path == navItem.url ? 'font-bold text-stone-950 dark:text-white' : 'text-stone-700 dark:text-stone-300',
              'hover:text-stone-950 dark:hover:text-white',
              'hover:bg-linear-to-r from-stone-100 via-stone-100 to-stone-50 dark:from-stone-800 dark:via-stone-800 dark:to-stone-900',
              'border border-transparent hover:border-stone-200 dark:hover:border-stone-600',
              'rounded-lg active:scale-99 transition-all']"
          >
            <span class="w-4"><FontAwesomeIcon :icon="navItem.icon" /></span>
            <span>{{ navItem.title }}</span>
          </RouterLink>
        </li>
      </ul>

      <Separator />

      <footer class="flex flex-col gap-2">
        <div class="flex">
          <Button
            v-for="socialMediaIcon in socialMediaIcons"
            :key="socialMediaIcon.url"
            as="a"
            variant="ghost"
            size="icon"
            :href="socialMediaIcon.url"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon :icon="socialMediaIcon.icon" class="text-lg" />
          </Button>
        </div>
      </footer>
    </Card>

    <div class="px-3 flex justify-between mt-4">
      <div class="flex">
        <Button
          v-for="theme in themes"
          :key="theme.theme"
          variant="ghost"
          size="icon-sm"
          @click="theme.action"
        >
          <FontAwesomeIcon :icon="theme.icon" />
        </Button>
      </div>

      <div class="flex gap-2">
        <!-- Language switching placeholder -->
      </div>
    </div>
  </nav>
</template>


<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faGithub, faLinkedin, type IconDefinition } from '@fortawesome/free-brands-svg-icons';
import { faBars, faCircleHalfStroke, faIdCardClip, faImages, faListUl, faMoon, faSun, faUser } from '@fortawesome/free-solid-svg-icons';
import { ref, watch } from 'vue';
import { useThemeStore, type Theme } from '@/stores/theme';
import Card from '../ui/card/Card.vue';
import Separator from '../ui/separator/Separator.vue';
import { Button } from '../ui/button';

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
    title: "Services",
    url: "/services",
    icon: faListUl,
  },
  {
    title: "Contact me",
    url: "/contact",
    icon: faIdCardClip,
  },
  {
    title: "Media",
    url: "/media",
    icon: faImages,
  },
]

function closeMenu() {
  isOpen.value = false
}

const themeStore = useThemeStore();

const themes: {theme: Theme, icon: IconDefinition, action: () => void}[] = [
  { theme: 'dark', icon: faMoon, action: () => themeStore.updateTheme('dark') },
  { theme: 'light', icon: faSun, action: () => themeStore.updateTheme('light') },
  { theme: 'system', icon: faCircleHalfStroke, action: () => themeStore.updateTheme('system') },
]
</script>