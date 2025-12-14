import { createRouter, createWebHistory } from 'vue-router'
import UserList from '../views/UserList.vue'

const routes = [
  {
    path: '/',
    redirect: '/users'
  },
  {
    path: '/users',
    name: 'UserList',
    component: UserList
  },
  {
    path: '/content',
    name: 'ContentList',
    component: () => import('../views/ContentList.vue')
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue')
  }

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
