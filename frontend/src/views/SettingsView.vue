<script setup lang="ts">
import { ref } from 'vue'

const fullName = ref('Alex Rivera')
const email = ref('alex@lexora.ai')
const workspaceName = ref('Lexora Design Team')
const language = ref('English (US)')
const autoOptimize = ref(true)
const saveSuccess = ref(false)

const languages = ['English (US)', 'Spanish', 'French', 'German']

const apiKeys = [
  {
    name: 'Production Main',
    key: 'lx_...4e21',
    status: 'active',
    usage: 82,
    used: '4.1k',
    limit: '5k',
    created: 'Oct 12, 2023',
  },
  {
    name: 'Staging Environment',
    key: 'lx_...9b02',
    status: 'inactive',
    usage: 1,
    used: '12',
    limit: '5k',
    created: 'Dec 01, 2023',
  },
]

const billingHistory = [
  { date: 'Dec 12, 2023', invoice: 'Invoice #LEX-2023-012', amount: '$49.00' },
  { date: 'Nov 12, 2023', invoice: 'Invoice #LEX-2023-011', amount: '$49.00' },
]

function saveProfile() {
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

    <!-- Profile Section -->
    <section id="profile">
      <div class="flex items-center gap-2 mb-6">
        <span class="material-symbols-outlined text-indigo-400">person</span>
        <h2 class="text-xl font-semibold text-zinc-900 dark:text-white">Profile</h2>
      </div>

      <div class="card p-8">
        <div class="flex items-start gap-8 mb-8 pb-8 border-b border-zinc-200 dark:border-zinc-800">
          <div class="relative group">
            <div class="w-24 h-24 rounded-full border-2 border-zinc-200 dark:border-zinc-800 bg-indigo-600 flex items-center justify-center text-2xl font-bold text-zinc-900 dark:text-white"
            >AR</div>
            <button
              class="absolute bottom-0 right-0 p-1.5 bg-indigo-600 rounded-full border-2 border-zinc-50 dark:border-zinc-950 text-zinc-900 dark:text-white hover:bg-indigo-500 transition-colors"
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

        <div class="space-y-4">
          <h3 class="text-lg font-semibold text-zinc-700 dark:text-zinc-200">Change Password</h3>
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1.5">
              <label class="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Current Password</label>
              <input
                class="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-700 dark:text-zinc-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                placeholder="••••••••"
                type="password"
              />
            </div>
            <div class="space-y-1.5">
              <label class="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">New Password</label>
              <input
                class="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-700 dark:text-zinc-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                placeholder="••••••••"
                type="password"
              />
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

    <!-- API Management Section -->
    <section id="api">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-indigo-400">terminal</span>
          <h2 class="text-xl font-semibold text-zinc-900 dark:text-white">API Management</h2>
        </div>
        <button class="btn-ghost flex items-center gap-2">
          <span class="material-symbols-outlined text-sm">add</span>
          Create New Key
        </button>
      </div>

      <div class="card overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead>
              <tr class="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                <th class="px-6 py-4 text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Key Name</th>
                <th class="px-6 py-4 text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-4 text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Usage</th>
                <th class="px-6 py-4 text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Created</th>
                <th class="px-6 py-4 text-[11px] font-medium text-zinc-500 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-zinc-200/50 dark:divide-zinc-800/50">
              <tr v-for="key in apiKeys" :key="key.name" class="hover:bg-zinc-200/50 dark:hover:bg-zinc-800/30 transition-colors"
              >
                <td class="px-6 py-4">
                  <div class="flex items-center gap-2">
                    <span class="text-sm font-medium text-zinc-700 dark:text-zinc-200">{{ key.name }}</span>
                    <span class="text-xs font-mono text-zinc-600">{{ key.key }}</span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span
                    class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                    :class="key.status === 'active'
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400'"
                  >
                    <span
                      class="w-1.5 h-1.5 rounded-full"
                      :class="key.status === 'active' ? 'bg-emerald-500' : 'bg-zinc-600'"
                    ></span>
                    {{ key.status === 'active' ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <div class="w-32">
                    <div class="flex justify-between text-[10px] text-zinc-500 mb-1">
                      <span>{{ key.usage }}% used</span>
                      <span>{{ key.used }}/{{ key.limit }}</span>
                    </div>
                    <div class="h-1 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div class="h-full bg-indigo-500 rounded-full" :style="`width: ${key.usage}%`"></div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 text-sm text-zinc-500 dark:text-zinc-400">{{ key.created }}</td>
                <td class="px-6 py-4 text-right">
                  <button class="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
                  >
                    <span class="material-symbols-outlined">more_vert</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- Billing Section -->
    <section id="billing">
      <div class="flex items-center gap-2 mb-6">
        <span class="material-symbols-outlined text-indigo-400">payments</span>
        <h2 class="text-xl font-semibold text-zinc-900 dark:text-white">Billing</h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Current Plan -->
        <div class="card p-8 flex flex-col justify-between">
          <div>
            <div class="flex justify-between items-start mb-4">
              <h3 class="text-lg font-semibold text-zinc-700 dark:text-zinc-200">Current Plan</h3>
              <span class="bg-indigo-500 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider"
              >Pro</span>
            </div>
            <div class="flex items-baseline gap-1 mb-2">
              <span class="text-3xl font-bold text-zinc-900 dark:text-white">$49</span>
              <span class="text-zinc-500">/per month</span>
            </div>
            <p class="text-zinc-500 dark:text-zinc-400 text-sm mb-6">Your next billing date is January 12, 2024.</p>
          </div>
          <div class="flex gap-3">
            <button class="flex-1 btn-ghost">Upgrade Plan</button>
            <button class="flex-1 border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-red-400 hover:border-red-900/50 rounded-lg text-sm font-medium py-2 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>

        <!-- Payment Method -->
        <div class="card p-8">
          <h3 class="text-lg font-semibold text-zinc-700 dark:text-zinc-200 mb-6">Payment Method</h3>
          <div class="p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg flex items-center justify-between mb-6">
            <div class="flex items-center gap-4">
              <div class="w-12 h-8 bg-zinc-200 dark:bg-zinc-800 rounded flex items-center justify-center">
                <span class="material-symbols-outlined text-zinc-500 dark:text-zinc-400">credit_card</span>
              </div>
              <div>
                <p class="text-sm font-medium text-zinc-700 dark:text-zinc-200">Visa ending in 4242</p>
                <p class="text-xs text-zinc-500">Expires 12/26</p>
              </div>
            </div>
            <button class="text-indigo-400 text-xs font-semibold hover:underline">Edit</button>
          </div>
          <button class="w-full flex items-center justify-center gap-2 border border-dashed border-zinc-300 dark:border-zinc-700 py-3 rounded-lg text-zinc-500 hover:border-zinc-400 dark:hover:border-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition-all text-sm"
          >
            <span class="material-symbols-outlined text-sm">add</span>
            Add Backup Method
          </button>
        </div>
      </div>

      <!-- Billing History -->
      <div class="mt-6 card overflow-hidden">
        <div class="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
          <h4 class="font-medium text-zinc-700 dark:text-zinc-200">Billing History</h4>
        </div>
        <table class="w-full text-left text-sm">
          <tbody class="divide-y divide-zinc-200/50 dark:divide-zinc-800/50">
            <tr v-for="bill in billingHistory" :key="bill.invoice"
            >
              <td class="px-6 py-4 text-zinc-500 dark:text-zinc-400">{{ bill.date }}</td>
              <td class="px-6 py-4 text-zinc-700 dark:text-zinc-200">{{ bill.invoice }}</td>
              <td class="px-6 py-4 text-zinc-700 dark:text-zinc-200">{{ bill.amount }}</td>
              <td class="px-6 py-4 text-right">
                <button class="text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  <span class="material-symbols-outlined">download</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>
