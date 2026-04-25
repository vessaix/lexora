<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useTheme } from '../composables/useTheme'
import { getUser, fetchProfile, logout, type User } from '../services/auth'
import {
  getGenerationDefaults,
  setGenerationDefaults,
  getDefaultProvider,
  setDefaultProvider,
  getWorkspaceName,
  setWorkspaceName,
  getLanguage,
  setLanguage,
  getAutoOptimize,
  setAutoOptimize,
  exportAllData,
  clearAllData,
  formatJoinDate,
} from '../services/preferences'

const { currentMode, setTheme } = useTheme()

const user = ref<User | null>(null)
const loading = ref(true)
const saveSuccess = ref(false)
const exportSuccess = ref(false)
const clearSuccess = ref(false)

// Theme
const themeOptions = [
  { mode: 'light' as const, label: 'Light', icon: 'light_mode' },
  { mode: 'dark' as const, label: 'Dark', icon: 'dark_mode' },
  { mode: 'system' as const, label: 'System', icon: 'desktop_windows' },
]

// Generation defaults
const contentTypes = ['Blog Post', 'Social Media', 'Technical Paper', 'Email Draft', 'Product Copy']
const tones = ['Professional', 'Creative', 'Witty', 'Urgent', 'Academic']
const lengths = ['Short (~250 words)', 'Medium (~750 words)', 'Long (~1500+ words)']

const defaultContentType = ref('Blog Post')
const defaultTone = ref('Professional')
const defaultLength = ref('Medium (~750 words)')

// Workspace
const workspaceName = ref('Lexora AI')
const language = ref('English (US)')
const autoOptimize = ref(true)
const languages = ['English (US)', 'Spanish', 'French', 'German']

// AI Provider
const defaultProvider = ref('groq')
const providers = [
  { id: 'groq', name: 'Groq', description: 'Fast inference with open-source models' },
  { id: 'openai', name: 'OpenAI', description: 'GPT models with high quality output' },
]

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

const joinDate = computed(() => {
  // For now, return current date since we don't store join date
  // In production, this would come from user.createdAt
  return formatJoinDate(new Date())
})

onMounted(async () => {
  // Load user
  user.value = getUser()
  try {
    const freshUser = await fetchProfile()
    if (freshUser) {
      user.value = freshUser
    }
  } catch (err) {
    console.error('Failed to fetch profile:', err)
  }

  // Load preferences
  const defaults = getGenerationDefaults()
  defaultContentType.value = defaults.contentType
  defaultTone.value = defaults.tone
  defaultLength.value = defaults.length

  defaultProvider.value = getDefaultProvider()
  workspaceName.value = getWorkspaceName()
  language.value = getLanguage()
  autoOptimize.value = getAutoOptimize()

  loading.value = false
})

function saveAllSettings() {
  // Save generation defaults
  setGenerationDefaults({
    contentType: defaultContentType.value,
    tone: defaultTone.value,
    length: defaultLength.value,
  })

  // Save workspace
  setWorkspaceName(workspaceName.value)
  setLanguage(language.value)
  setAutoOptimize(autoOptimize.value)

  // Save provider
  setDefaultProvider(defaultProvider.value)

  saveSuccess.value = true
  setTimeout(() => {
    saveSuccess.value = false
  }, 3000)
}

function handleExport() {
  const data = exportAllData()
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `lexora-export-${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)

  exportSuccess.value = true
  setTimeout(() => {
    exportSuccess.value = false
  }, 3000)
}

function handleClear() {
  if (confirm('Are you sure you want to clear all local data? This will reset your preferences but keep your account.')) {
    clearAllData()
    clearSuccess.value = true
    setTimeout(() => {
      clearSuccess.value = false
      window.location.reload()
    }, 2000)
  }
}

function handleLogout() {
  logout()
}

function getProviderIcon(provider: string): string {
  if (provider === 'google') return 'search'
  if (provider === 'apple') return 'apple'
  return 'account_circle'
}

function getProviderColor(provider: string): string {
  if (provider === 'google') return 'text-blue-500'
  if (provider === 'apple') return 'text-zinc-400'
  return 'text-zinc-500'
}
</script>

<template>
  <div class="max-w-5xl mx-auto space-y-12 pb-12">
    <!-- Header -->
    <header class="mb-10">
      <h1 class="page-title">Settings</h1>
      <p class="page-subtitle mt-2">Manage your account preferences, workspace configurations, and AI generation defaults.</p>
    </header>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center min-h-[200px]">
      <div class="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
    </div>

    <div v-else class="space-y-12">
      <!-- Profile Section -->
      <section id="profile">
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
            </div>
            <div class="flex-1 space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1.5">
                  <label class="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Full Name</label>
                  <input
                    v-model="fullName"
                    disabled
                    class="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-700 dark:text-zinc-200 outline-none cursor-not-allowed"
                    type="text"
                  />
                  <p class="text-[10px] text-zinc-500">Managed by {{ user?.provider || 'OAuth' }}</p>
                </div>
                <div class="space-y-1.5">
                  <label class="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Email Address</label>
                  <input
                    v-model="email"
                    disabled
                    class="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-700 dark:text-zinc-200 outline-none cursor-not-allowed"
                    type="email"
                  />
                  <p class="text-[10px] text-zinc-500">Managed by {{ user?.provider || 'OAuth' }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-3 gap-4 text-center">
            <div class="p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg">
              <p class="text-[10px] text-zinc-500 uppercase tracking-wider font-medium">Provider</p>
              <div class="flex items-center justify-center gap-2 mt-1">
                <span :class="`material-symbols-outlined text-lg ${getProviderColor(user?.provider || '')}`">{{ getProviderIcon(user?.provider || '') }}</span>
                <p class="text-sm font-medium text-zinc-700 dark:text-zinc-200 capitalize">{{ user?.provider || 'Unknown' }}</p>
              </div>
            </div>
            <div class="p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg">
              <p class="text-[10px] text-zinc-500 uppercase tracking-wider font-medium">Member Since</p>
              <p class="text-sm font-medium text-zinc-700 dark:text-zinc-200 mt-1">{{ joinDate }}</p>
            </div>
            <div class="p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg">
              <p class="text-[10px] text-zinc-500 uppercase tracking-wider font-medium">User ID</p>
              <p class="text-sm font-medium text-zinc-700 dark:text-zinc-200 mt-1 truncate">{{ user?.id || 'N/A' }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Theme Section -->
      <section id="theme">
        <div class="flex items-center gap-2 mb-6">
          <span class="material-symbols-outlined text-indigo-400">palette</span>
          <h2 class="text-xl font-semibold text-zinc-900 dark:text-white">Appearance</h2>
        </div>

        <div class="card p-8">
          <div class="grid grid-cols-3 gap-4">
            <button
              v-for="option in themeOptions"
              :key="option.mode"
              @click="setTheme(option.mode)"
              class="flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all"
              :class="currentMode === option.mode
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10'
                : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'"
            >
              <span class="material-symbols-outlined text-3xl" :class="currentMode === option.mode ? 'text-indigo-500' : 'text-zinc-500'">{{ option.icon }}</span>
              <span class="text-sm font-medium" :class="currentMode === option.mode ? 'text-indigo-700 dark:text-indigo-300' : 'text-zinc-700 dark:text-zinc-300'">{{ option.label }}</span>
            </button>
          </div>
        </div>
      </section>

      <!-- Default Generation Preferences -->
      <section id="defaults">
        <div class="flex items-center gap-2 mb-6">
          <span class="material-symbols-outlined text-indigo-400">auto_awesome</span>
          <h2 class="text-xl font-semibold text-zinc-900 dark:text-white">Default Generation Preferences</h2>
        </div>

        <div class="card p-8">
          <p class="text-sm text-zinc-500 mb-6">These defaults will be pre-filled when you open the Generate page.</p>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="space-y-1.5">
              <label class="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Content Type</label>
              <select
                v-model="defaultContentType"
                class="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-700 dark:text-zinc-200 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all appearance-none"
              >
                <option v-for="type in contentTypes" :key="type" :value="type">{{ type }}</option>
              </select>
            </div>

            <div class="space-y-1.5">
              <label class="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Tone</label>
              <select
                v-model="defaultTone"
                class="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-700 dark:text-zinc-200 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all appearance-none"
              >
                <option v-for="tone in tones" :key="tone" :value="tone">{{ tone }}</option>
              </select>
            </div>

            <div class="space-y-1.5">
              <label class="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Length</label>
              <select
                v-model="defaultLength"
                class="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-700 dark:text-zinc-200 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all appearance-none"
              >
                <option v-for="length in lengths" :key="length" :value="length">{{ length }}</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      <!-- AI Provider Configuration -->
      <section id="provider">
        <div class="flex items-center gap-2 mb-6">
          <span class="material-symbols-outlined text-indigo-400">psychology</span>
          <h2 class="text-xl font-semibold text-zinc-900 dark:text-white">AI Provider</h2>
        </div>

        <div class="card p-8">
          <div class="space-y-4">
            <div
              v-for="provider in providers"
              :key="provider.id"
              @click="defaultProvider = provider.id"
              class="flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all"
              :class="defaultProvider === provider.id
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10'
                : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'"
            >
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 rounded-lg flex items-center justify-center"
                  :class="defaultProvider === provider.id ? 'bg-indigo-600 text-white' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'"
                >
                  <span class="material-symbols-outlined">{{ provider.id === 'groq' ? 'bolt' : 'neurology' }}</span>
                </div>
                <div>
                  <p class="text-sm font-medium" :class="defaultProvider === provider.id ? 'text-indigo-700 dark:text-indigo-300' : 'text-zinc-700 dark:text-zinc-200'">{{ provider.name }}</p>
                  <p class="text-xs text-zinc-500">{{ provider.description }}</p>
                </div>
              </div>
              <span
                v-if="defaultProvider === provider.id"
                class="material-symbols-outlined text-indigo-500"
              >check_circle</span>
            </div>
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
                Configure your workspace preferences to streamline your content generation workflow.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Data Management -->
      <section id="data">
        <div class="flex items-center gap-2 mb-6">
          <span class="material-symbols-outlined text-indigo-400">database</span>
          <h2 class="text-xl font-semibold text-zinc-900 dark:text-white">Data Management</h2>
        </div>

        <div class="card p-8">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg">
              <div class="flex items-center gap-3 mb-3">
                <span class="material-symbols-outlined text-zinc-500">download</span>
                <div>
                  <p class="text-sm font-medium text-zinc-700 dark:text-zinc-200">Export Data</p>
                  <p class="text-xs text-zinc-500">Download all your preferences and settings</p>
                </div>
              </div>
              <button
                @click="handleExport"
                class="w-full btn-ghost text-sm flex items-center justify-center gap-2"
              >
                <span class="material-symbols-outlined text-sm">download</span>
                Export as JSON
              </button>
              <p v-if="exportSuccess" class="text-xs text-emerald-400 mt-2 text-center">Export successful!</p>
            </div>

            <div class="p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg">
              <div class="flex items-center gap-3 mb-3">
                <span class="material-symbols-outlined text-red-400">delete</span>
                <div>
                  <p class="text-sm font-medium text-zinc-700 dark:text-zinc-200">Clear Local Data</p>
                  <p class="text-xs text-zinc-500">Reset all preferences and cached data</p>
                </div>
              </div>
              <button
                @click="handleClear"
                class="w-full border border-red-200 dark:border-red-800 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-sm font-medium py-2 transition-colors flex items-center justify-center gap-2"
              >
                <span class="material-symbols-outlined text-sm">delete_forever</span>
                Clear Data
              </button>
              <p v-if="clearSuccess" class="text-xs text-emerald-400 mt-2 text-center">Data cleared! Reloading...</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Account Security -->
      <section id="account">
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
              <button
                @click="handleLogout"
                class="btn-ghost text-sm flex items-center gap-2 text-red-500 hover:text-red-400"
              >
                <span class="material-symbols-outlined text-sm">logout</span>
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Save Button (Sticky) -->
      <div class="fixed bottom-8 right-8 flex items-center gap-3">
        <span v-if="saveSuccess" class="flex items-center text-sm text-emerald-400 bg-zinc-900 dark:bg-zinc-800 px-4 py-2 rounded-lg shadow-lg">
          <span class="material-symbols-outlined text-sm mr-1">check_circle</span>
          Settings saved successfully
        </span>
        <button
          @click="saveAllSettings"
          class="btn-primary px-6 py-3 shadow-lg flex items-center gap-2"
        >
          <span class="material-symbols-outlined">save</span>
          Save All Settings
        </button>
      </div>
    </div>
  </div>
</template>
