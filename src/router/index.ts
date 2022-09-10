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
      beforeEnter(to) {
        return { name: 'edit-home', query: to.query };
      }
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
      beforeEnter(to) {
        const pad = (n: number) => `0${n}`.slice(-2);
        const date = new Date();
        return { 
          path: `/edit/notes/${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}.md`, 
          query: to.query,
        };
      }
    },
    {
      path: '/edit/:filepath(.*)',
      name: 'edit',
      component: EditView,
      props: true,
    },
  ]
})

router.beforeEach((to) => {
  // To avoid infinite loop
  if (to.name === 'settings') {
    return;
  }

  // Redirect to settings if the GitHub token hasn't been set yet
  const githubSettings = useGithubSettings(pinia);
  if(!githubSettings.token || !githubSettings.repo) {
    return { name: 'settings' };
  }
});

export default router
