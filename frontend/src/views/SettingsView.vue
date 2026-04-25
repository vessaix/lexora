<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { getUser, fetchProfile, type User } from '../services/auth'

const user = ref<User | null>(null)
const loading = ref(true)
const saveSuccess = ref(false)
const workspaceName = ref('Lexora AI')
const language = ref('English (US)')
const autoOptimize = ref(true)

const languages = ['English (US)', 'Spanish', 'French', 'German']

const fullName = computed({
  get: () => user.value?.name || '',
  set: (val) => {
    if (user.value) user.value.name = val
  }
})

const email = computed({
  get: () => user.value?.email || '',
  set: (val) => {
    if (user.value) user.value.email = val
  }
})

const initials = computed(() => {
  if (!user.value?.name) return 'U'
  return user.value.name.split(' ').map(n => n[0]).join('').toUpperCase()
})

onMounted(async () => {
  // Try to get from localStorage first
  user.value = getUser()
  
  // Then fetch fresh data from backend
  try {
    const freshUser = await fetchProfile()
    if (freshUser) {
      user.value = freshUser
    }
  } catch (err) {
    console.error('Failed to fetch profile:', err)
  } finally {
    loading.value = false
  }
})

function saveProfile() {
  // In a real app, this would send to backend
  saveSuccess.value = true
  setTimeout(() => {
    saveSuccess.value = false
  }, 3000)
}
</script>

<template>
  <div class="max-w-5xl mx-auto space-y-12 pb-12">
    <!-- Header -->
    <header class="mb-10">
      <h1 class="page-title">Settings</h1>
      <p class="page-subtitle mt-2">Manage your account preferences, workspace configurations, and API keys.</p>
    </header>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center min-h-[200px]">
      <div class="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
    </div>

    <!-- Profile Section -->
    <section v-else id="profile">
      <div class="flex items-center gap-2 mb-6">
        <span class="material-symbols-outlined text-indigo-400">person</span>
        <h2 class="text-xl font-semibold text-zinc-900 dark:text-white">Profile</h2>
      </div>

      <div class="card p-8">
        <div class="flex items-start gap-8 mb-8 pb-8 border-b border-zinc-200 dark:border-zinc-800">
          <div class="relative group">
            <img
              v-if="user?.picture"
              :src="user.picture"
              class="w-24 h-24 rounded-full border-2 border-zinc-200 dark:border-zinc-800 object-cover"
              alt="Profile"
            />
            <div
              v-else
              class="w-24 h-24 rounded-full border-2 border-zinc-200 dark:border-zinc-800 bg-indigo-600 flex items-center justify-center text-2xl font-bold text-white"
            >
              {{ initials }}
            </div>
            <button
              class="absolute bottom-0 right-0 p-1.5 bg-indigo-600 rounded-full border-2 border-zinc-50 dark:border-zinc-950 text-white hover:bg-indigo-500 transition-colors"
            >
              <span class="material-symbols-outlined text-sm">edit</span>
            </button>
          </div>
          <div class="flex-1 space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1.5">
                <label class="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Full Name</label>
                <input
                  v-model="fullName"
                  class="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-700 dark:text-zinc-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                  type="text"
                />
              </div>
              <div class="space-y-1.5">
                <label class="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Email Address</label>
                <input
                  v-model="email"
                  class="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-700 dark:text-zinc-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                  type="email"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-end pt-4 gap-3">
          <span v-if="saveSuccess" class="flex items-center text-sm text-emerald-400">
            <span class="material-symbols-outlined text-sm mr-1">check_circle</span>
            Saved successfully
          </span>
          <button @click="saveProfile" class="btn-primary px-6">Save Changes</button>
        </div>
      </div>
    </section>

    <!-- Workspace Section -->
    <section id="workspace">
      <div class="flex items-center gap-2 mb-6">
        <span class="material-symbols-outlined text-indigo-400">domain</span>
        <h2 class="text-xl font-semibold text-zinc-900 dark:text-white">Workspace</h2>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 card p-8">
          <div class="space-y-6">
            <div class="space-y-1.5">
              <label class="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Workspace Name</label>
              <input
                v-model="workspaceName"
                class="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-700 dark:text-zinc-200 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                type="text"
              />
            </div>

            <div class="space-y-1.5">
              <label class="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Default Language</label>
              <select
                v-model="language"
                class="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-700 dark:text-zinc-200 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all appearance-none"
              >
                <option v-for="l in languages" :key="l">{{ l }}</option>
              </select>
            </div>

            <div class="pt-2">
              <div class="flex items-center justify-between p-4 bg-zinc-50/50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 rounded-lg">
                <div class="flex items-center gap-3">
                  <span class="material-symbols-outlined text-zinc-500 dark:text-zinc-400">auto_awesome</span>
                  <div>
                    <p class="text-sm font-medium text-zinc-700 dark:text-zinc-200">Auto-Optimization</p>
                    <p class="text-xs text-zinc-500">Enable AI-driven prompt tuning</p>
                  </div>
                </div>
                <button
                  type="button"
                  @click="autoOptimize = !autoOptimize"
                  class="w-10 h-5 rounded-full relative transition-colors duration-200"
                  :class="autoOptimize ? 'bg-indigo-600' : 'bg-zinc-300 dark:bg-zinc-700'"
                >
                  <div
                    class="absolute top-1 w-3 h-3 bg-white rounded-full transition-transform duration-200"
                    :class="autoOptimize ? 'right-1' : 'left-1'"
                  ></div>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="card p-6 bg-indigo-50 dark:bg-indigo-500/5 border-indigo-200 dark:border-indigo-500/20 flex flex-col justify-between">
          <div>
            <h4 class="text-indigo-400 font-bold mb-2">Workspace Insight</h4>
            <p class="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
              Your team has increased productivity by 24% this month using Lexora's collaborative features.
            </p>
          </div>
          <div class="mt-4 pt-4 border-t border-indigo-500/10">
            <a href="#" class="text-indigo-400 text-sm font-medium flex items-center gap-1 hover:underline"
            >
              View Analytics
              <span class="material-symbols-outlined text-xs">arrow_forward</span>
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Connected Account Section -->
    <section id="account" class="mt-12">
      <div class="flex items-center gap-2 mb-6">
        <span class="material-symbols-outlined text-indigo-400">shield</span>
        <h2 class="text-xl font-semibold text-zinc-900 dark:text-white">Account Security</h2>
      </div>

      <div class="card p-8">
        <div class="space-y-6">
          <div class="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center">
                <svg class="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </div>
              <div>
                <p class="text-sm font-medium text-zinc-700 dark:text-zinc-200">Google Account</p>
                <p class="text-xs text-zinc-500">{{ user?.email || 'Connected' }}</p>
              </div>
            </div>
            <span class="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-medium rounded-full">Connected</span>
          </div>

          <div class="pt-4 border-t border-zinc-200 dark:border-zinc-800">
            <h3 class="text-sm font-medium text-zinc-700 dark:text-zinc-200 mb-3">Session</h3>
            <p class="text-xs text-zinc-500 mb-4">You are currently signed in. Sign out to end your session.</p>
            <button class="btn-ghost text-sm">Sign Out</button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
