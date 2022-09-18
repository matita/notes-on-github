import SettingsView from '@/views/SettingsView.vue';
import { createRouter, createWebHashHistory } from 'vue-router'
import EditView from '../views/EditView.vue'
import { pinia } from '@/stores';
import { useSettings } from '@/stores/settings';

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
        const settings = useSettings(pinia);
        const newNoteFilepath = settings.formattedNewNoteFilepath;

        return { 
          path: `/edit/${newNoteFilepath}`, 
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
  const settings = useSettings(pinia);
  if(!settings.token || !settings.repo) {
    return { name: 'settings' };
  }
});

export default router
