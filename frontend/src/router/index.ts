import { createRouter, createWebHistory } from 'vue-router'

import SidebarLayout from '@/layouts/SidebarLayout.vue';
import IndexPage from '@/pages/Index.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: SidebarLayout,
      children: [
        {
          path: '',
          name: 'Home',
          component: IndexPage,
        },
      ],
    },
  ],
});

export default router
