import { useGithubSettings } from '@/stores/githubSettings';
import SettingsView from '@/views/SettingsView.vue';
import { createRouter, createWebHashHistory } from 'vue-router'
import EditView from '../views/EditView.vue'
import { pinia } from '@/stores';

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: '/edit',
    },
    {
      path: '/settings',
      name: 'settings',
      component: SettingsView
    },
    {
      path: '/edit',
      name: 'edit-home',
      component: EditView,
      beforeEnter() {
        const pad = (n: number) => `0${n}`.substring(-2);
        const date = new Date();
        return { path: `/edit/notes/${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}.md` };
      }
    },
    {
      path: '/edit/:filepath(.*)',
      name: 'edit',
      component: EditView,
      props: true
    },
  ]
})

router.beforeEach((to, from) => {
  if (to.name === 'settings') {
    return;
  }

  const githubSettings = useGithubSettings(pinia);
  if(!githubSettings.token || !githubSettings.repo) {
    return { name: 'settings' };
  }
});

export default router
