import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import 'virtual:uno.css'
import '@unocss/reset/tailwind.css'
import './style.css'
import App from './App.vue'
import AppLayout from './layouts/AppLayout.vue'
import { isAuthenticated } from './services/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('./views/LoginView.vue'),
    },
    {
      path: '/auth/callback',
      name: 'auth-callback',
      component: () => import('./views/AuthCallbackView.vue'),
    },
    {
      path: '/',
      component: AppLayout,
      children: [
        {
          path: '',
          name: 'dashboard',
          component: () => import('./views/DashboardView.vue'),
        },
        {
          path: 'generate',
          name: 'generate',
          component: () => import('./views/GenerateView.vue'),
        },
        {
          path: 'history',
          name: 'history',
          component: () => import('./views/HistoryView.vue'),
        },
        {
          path: 'settings',
          name: 'settings',
          component: () => import('./views/SettingsView.vue'),
        },
      ],
    },
  ],
})

router.beforeEach((to, _from, next) => {
  const publicRoutes = ['/login', '/auth/callback']
  const isPublic = publicRoutes.includes(to.path)

  if (!isAuthenticated() && !isPublic) {
    next('/login')
  } else if (isAuthenticated() && to.path === '/login') {
    next('/')
  } else {
    next()
  }
})

createApp(App).use(router).mount('#app')
