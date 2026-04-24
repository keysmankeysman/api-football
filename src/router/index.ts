import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/Login.vue'),
      meta: { requiresAuth: false, guestOnly: true }
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('@/views/Register.vue'),
      meta: { requiresAuth: false, guestOnly: true }
    },
    {
      path: '/',
      redirect: '/dashboard'
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('@/views/Dashboard.vue'),
      meta: { requiresAuth: true, title: 'Панель управления' }
    },
    {
      path: '/leagues',
      name: 'Leagues',
      component: () => import('@/views/Leagues.vue'),
      meta: { requiresAuth: true, title: 'Лиги' }
    },
    {
      path: '/teams',
      name: 'Teams',
      component: () => import('@/views/Teams.vue'),
      meta: { requiresAuth: true, title: 'Команды' }
    },
    {
      path: '/team/:id',
      name: 'TeamDetails',
      component: () => import('@/views/TeamDetails.vue'),
      meta: { requiresAuth: true, title: 'Детали команды' }
    }
  ]
})

// Навигационный guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.meta.requiresAuth
  const guestOnly = to.meta.guestOnly

  // Установка заголовка страницы
  if (to.meta.title) {
    document.title = `${to.meta.title} | Football App`
  }

  if (requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (guestOnly && authStore.isAuthenticated) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router