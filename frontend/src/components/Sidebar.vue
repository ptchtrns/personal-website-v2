<template>
  <nav class="fixed w-64 xl:w-86 m-12">
    <div class="bg-white rounded-[17px] flex flex-col p-3 border border-stone-300">
      <div class="px-3 py-2 flex flex-col gap-2.5">
        <img src="/nikolai.jpg" alt="Nikolai Zakharov" class="rounded-full w-32" />
        <div>
          <h2 class="font-bold text-xl">Nikolai Zakharov</h2>
          <span class="text-stone-700">&commat;ptchtrns</span>
        </div>
        <div class="flex gap-2">
          <a v-for="socialMediaIcon in socialMediaIcons" :href="socialMediaIcon.url" target="_blank" rel="noopener noreferrer" class="text-stone-700 hover:text-stone-950">
            <FontAwesomeIcon :icon="socialMediaIcon.icon" class="text-lg" />
          </a>
        </div>
      </div>
      <ul class="flex flex-col">
        <li v-for="navItem in navItems" :key="navItem.url">
          <RouterLink
            :to="navItem.url"
              class="w-full py-1.5 px-3 flex gap-4
              text-stone-700 hover:text-stone-950
              hover:bg-linear-to-r from-stone-100 via-stone-100 to-stone-50
              border border-transparent hover:border-stone-200 rounded-lg
              active:scale-99 transition-all"
          >
            <span class="w-4"><FontAwesomeIcon :icon="navItem.icon" /></span>
            <span>{{ navItem.title }}</span>
          </RouterLink>
        </li>
      </ul>
    </div>
    <footer class="px-6 flex justify-between mt-4">
      <div class="flex gap-2">
        <button class="text-stone-600 cursor-pointer active:scale-92 transition-all">
          <FontAwesomeIcon :icon="faMoon" />
        </button>
        <button class="text-stone-400 hover:text-stone-600 cursor-pointer active:scale-92 transition-all">
          <FontAwesomeIcon :icon="faSun" />
        </button>
        <button class="text-stone-400 hover:text-stone-600 cursor-pointer active:scale-92 transition-all">
          <FontAwesomeIcon :icon="faCircleHalfStroke" />
        </button>
      </div>
      <div class="flex gap-2">
        <button class="text-stone-600 font-semibold cursor-pointer active:scale-92 transition-all">EN</button>
        <button class="text-stone-400 hover:text-stone-600 cursor-pointer active:scale-92 transition-all">FI</button>
      </div>
    </footer>
  </nav>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faCircleHalfStroke, faHeadphones, faImages, faMoon, faSun, faUser } from '@fortawesome/free-solid-svg-icons';

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
</script>