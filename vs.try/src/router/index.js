import { createRouter, createWebHistory } from 'vue-router'

// Import your pages (they're in components folder)
import Login from '@/views/login.vue'
import Signup from '@/views/signup.vue'

const routes = [
  { path: '/', name: 'Login', component: Login },
  { path: '/signup', name: 'Signup', component: Signup }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
