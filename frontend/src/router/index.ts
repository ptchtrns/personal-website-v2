import { createRouter, createWebHistory } from 'vue-router'

import SidebarLayout from '@/layouts/SidebarLayout.vue';
import IndexPage from '@/pages/Index.vue';
import ServicesPage from '@/pages/Services.vue';
import ContactPage from '@/pages/Contact.vue';
import MediaPage from '@/pages/Media.vue';
import AdminPage from '@/pages/Admin.vue';
import LoginPage from '@/pages/Login.vue';

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
        {
          path: 'services/',
          name: 'Services',
          component: ServicesPage,
        },
        {
          path: 'contact/',
          name: 'Contact me',
          component: ContactPage,
        },
        {
          path: 'media/',
          name: 'Media',
          component: MediaPage,
        },
        {
          path: 'admin/',
          name: 'Admin',
          component: AdminPage,
          meta: { requiresAuth: true }
        },
        {
          path: 'login/',
          name: 'Login',
          component: LoginPage,
          meta: { redirectIfAuth: true }
        },
      ],
    },
  ],
});

router.beforeEach(async (to) => {
  if (to.meta.requiresAuth) {
    try {
      const res = await fetch('api/me', { credentials: 'include' });
      if (!res.ok) return "/login";
    } catch {
      return "/login";
    }
  }

  if (to.meta.redirectIfAuth) {
    try {
      const res = await fetch('api/me', { credentials: 'include' });
      if (res.ok) return "/admin";
    } catch {}
  }
});

export default router
