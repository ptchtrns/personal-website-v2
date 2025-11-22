import { createRouter, createWebHistory } from 'vue-router'

import SidebarLayout from '@/layouts/SidebarLayout.vue';
import IndexPage from '@/pages/Index.vue';
import GalleryPage from '@/pages/Gallery.vue';
import AudioPage from '@/pages/Audio.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: SidebarLayout,
      children: [
        {
          path: '/',
          name: 'Home',
          component: IndexPage,
        },
        {
          path: '/gallery/',
          name: 'Gallery',
          component: GalleryPage,
        },
        {
          path: '/audio/',
          name: 'Audio',
          component: AudioPage,
        },
      ],
    },
  ],
});

export default router
