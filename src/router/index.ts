import { createRouter, createWebHashHistory } from 'vue-router'
import EditView from '../views/EditView.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: '/edit'
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
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    }
  ]
})

export default router
