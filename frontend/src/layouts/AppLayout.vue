<script setup lang="ts">
import { useRoute, RouterLink, RouterView } from 'vue-router'
import { ref } from 'vue'
import { useTheme } from '../composables/useTheme'
import { useClickOutside } from '../composables/useClickOutside'

const route = useRoute()
const { currentMode, setTheme } = useTheme()
const themeMenuOpen = ref(false)
const themeMenuRef = ref<HTMLElement | null>(null)

useClickOutside(themeMenuRef, () => {
  themeMenuOpen.value = false
})

const themeOptions = [
  { mode: 'light' as const, label: 'Light', icon: 'light_mode' },
  { mode: 'dark' as const, label: 'Dark', icon: 'dark_mode' },
  { mode: 'system' as const, label: 'System', icon: 'desktop_windows' },
]

const mainNav = [
  { name: 'Dashboard', path: '/', icon: 'dashboard' },
  { name: 'Generate', path: '/generate', icon: 'auto_awesome' },
  { name: 'History', path: '/history', icon: 'history' },
]

const bottomNav = [
  { name: 'Settings', path: '/settings', icon: 'settings' },
  { name: 'Support', path: '#', icon: 'help_outline' },
]

const isActive = (path: string) => {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

const selectTheme = (mode: 'light' | 'dark' | 'system') => {
  setTheme(mode)
  themeMenuOpen.value = false
}

const currentThemeIcon = () => {
  const opt = themeOptions.find(o => o.mode === currentMode.value)
  return opt?.icon || 'desktop_windows'
}

const sidebarCollapsed = ref(false)
const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}
</script>

<template>
  <div class="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 font-sans antialiased">
    <!-- Sidebar -->
    <aside
      class="fixed left-0 top-0 h-screen border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex flex-col p-4 gap-2 z-50 transition-all duration-300"
      :class="sidebarCollapsed ? 'w-16 items-center' : 'w-64'"
    >
      <div class="flex items-center gap-3 px-2 mb-8" :class="sidebarCollapsed ? 'justify-center' : ''">
        <div class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <span class="material-symbols-outlined text-white material-symbols-filled text-[20px]">auto_awesome</span>
        </div>
        <div v-if="!sidebarCollapsed" class="flex flex-col">
          <span class="text-lg font-bold tracking-tight text-zinc-900 dark:text-white">Lexora AI</span>
          <span class="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Intelligence Engine</span>
        </div>
      </div>

      <RouterLink
        v-if="!sidebarCollapsed"
        to="/generate"
        class="mb-6 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 px-4 rounded-xl transition-all active:scale-[0.98]"
      >
        <span class="material-symbols-outlined text-[20px]">add</span>
        <span class="text-sm">New Project</span>
      </RouterLink>

      <nav class="flex-1 space-y-1 w-full">
        <RouterLink
          v-for="item in mainNav"
          :key="item.path"
          :to="item.path"
          class="flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-all duration-200"
          :class="[
            isActive(item.path)
              ? 'bg-zinc-100 dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400'
              : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900/50 hover:text-zinc-900 dark:hover:text-zinc-200',
            sidebarCollapsed ? 'justify-center px-2' : ''
          ]"
          :title="sidebarCollapsed ? item.name : ''"
        >
          <span class="material-symbols-outlined">{{ item.icon }}</span>
          <span v-if="!sidebarCollapsed">{{ item.name }}</span>
        </RouterLink>
      </nav>

      <div class="pt-4 border-t border-zinc-200 dark:border-zinc-800 space-y-1 w-full">
        <RouterLink
          v-for="item in bottomNav"
          :key="item.path"
          :to="item.path"
          class="flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-all duration-200"
          :class="[
            isActive(item.path)
              ? 'bg-zinc-100 dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400'
              : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900/50 hover:text-zinc-900 dark:hover:text-zinc-200',
            sidebarCollapsed ? 'justify-center px-2' : ''
          ]"
          :title="sidebarCollapsed ? item.name : ''"
        >
          <span class="material-symbols-outlined">{{ item.icon }}</span>
          <span v-if="!sidebarCollapsed">{{ item.name }}</span>
        </RouterLink>
      </div>

      <!-- Toggle Button -->
      <button
        @click="toggleSidebar"
        class="absolute -right-3 top-6 w-6 h-12 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full flex items-center justify-center text-zinc-500 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-300 dark:hover:border-indigo-700 shadow-sm z-50 transition-all duration-200"
        :title="sidebarCollapsed ? 'Expand' : 'Collapse'"
      >
        <span class="material-symbols-outlined text-[16px]">{{ sidebarCollapsed ? 'chevron_right' : 'chevron_left' }}</span>
      </button>
    </aside>

    <!-- Top Navbar -->
    <header
      class="fixed top-0 right-0 h-16 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 backdrop-blur-xl z-40 flex items-center justify-between px-8 transition-all duration-300"
      :class="sidebarCollapsed ? 'left-16' : 'left-64'"
    >
      <div class="flex-1">
        <!-- Page title or breadcrumb could go here -->
      </div>
      <div class="flex items-center gap-4">
        <!-- Theme Dropdown -->
        <div ref="themeMenuRef" class="relative">
          <button
            @click="themeMenuOpen = !themeMenuOpen"
            class="w-10 h-10 flex items-center justify-center rounded-full text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
            title="Theme"
          >
            <span class="material-symbols-outlined">{{ currentThemeIcon() }}</span>
          </button>
          <div
            v-if="themeMenuOpen"
            class="absolute right-0 top-full mt-2 w-40 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden z-50 shadow-xl"
          >
            <button
              v-for="option in themeOptions"
              :key="option.mode"
              @click="selectTheme(option.mode)"
              class="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors"
              :class="currentMode === option.mode
                ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800'"
            >
              <span class="material-symbols-outlined text-base">{{ option.icon }}</span>
              <span>{{ option.label }}</span>
            </button>
          </div>
        </div>

        <button
          class="w-10 h-10 flex items-center justify-center rounded-full text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
        >
          <span class="material-symbols-outlined">notifications</span>
        </button>
        <div class="h-8 w-[1px] bg-zinc-200 dark:bg-zinc-800 mx-2"></div>
        <button class="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
          <span class="text-sm font-medium text-zinc-700 dark:text-zinc-300">Alex Rivers</span>
          <div class="w-8 h-8 rounded-full border border-zinc-300 dark:border-zinc-700 bg-indigo-600 flex items-center justify-center text-xs font-bold text-white">
            AR
          </div>
        </button>
      </div>
    </header>

    <!-- Main Content -->
    <main
      class="mt-16 p-8 min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-all duration-300"
      :class="sidebarCollapsed ? 'ml-16' : 'ml-64'"
    >
      <RouterView />
    </main>
  </div>
</template>
