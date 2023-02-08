import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import DocView from "../views/DocView.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/:model',
      name: 'test',
      component: DocView
    }, {
      path: "/api/:model",
      component: async () => {
        console.log(this)
        // fetch("/db/"+)
      }
    }
  ]
})

export default router
