import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/Home.vue'
import Team from '../components/Team/Team.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/team',
    name: 'Team',
    component: Team
  }
]

const router = createRouter({
  history: createWebHistory("/"),
  routes
})

export default router
