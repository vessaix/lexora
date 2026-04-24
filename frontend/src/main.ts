import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import 'virtual:uno.css'
import '@unocss/reset/tailwind.css'
import './style.css'
import App from './App.vue'
import AppLayout from './layouts/AppLayout.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
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

createApp(App).use(router).mount('#app')
