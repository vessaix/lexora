<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

interface HistoryItem {
  id: number
  title: string
  icon: string
  iconColor: string
  iconBg: string
  type: string
  date: string
  status: 'completed' | 'draft'
}

const historyItems = ref<HistoryItem[]>([
  {
    id: 1,
    title: 'The Future of AI in SaaS',
    icon: 'article',
    iconColor: 'text-indigo-400',
    iconBg: 'bg-indigo-500/10',
    type: 'Blog Post',
    date: '2 hours ago',
    status: 'completed',
  },
  {
    id: 2,
    title: 'Q3 Marketing Strategy Brief',
    icon: 'campaign',
    iconColor: 'text-emerald-400',
    iconBg: 'bg-emerald-500/10',
    type: 'Marketing Plan',
    date: 'Yesterday',
    status: 'draft',
  },
  {
    id: 3,
    title: 'Cold Outreach Email Sequence',
    icon: 'alternate_email',
    iconColor: 'text-blue-400',
    iconBg: 'bg-blue-500/10',
    type: 'Email',
    date: 'Oct 24, 2023',
    status: 'completed',
  },
  {
    id: 4,
    title: 'LinkedIn Product Announcement',
    icon: 'share',
    iconColor: 'text-purple-400',
    iconBg: 'bg-purple-500/10',
    type: 'Social Media',
    date: 'Oct 23, 2023',
    status: 'completed',
  },
])

const statusConfig = {
  completed: {
    dot: 'bg-indigo-500',
    text: 'text-indigo-400',
    label: 'Completed',
  },
  draft: {
    dot: 'bg-zinc-500',
    text: 'text-zinc-400',
    label: 'Draft',
  },
}
</script>

<template>
  <div class="max-w-7xl mx-auto space-y-8">
    <!-- Page Header -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <h1 class="page-title mb-2">History</h1>
        <p class="page-subtitle">Manage and review your past AI generations and creative drafts.</p>
      </div>
      <RouterLink
        to="/generate"
        class="btn-primary h-11 px-6 flex items-center gap-2 self-start"
      >
        <span class="material-symbols-outlined text-sm">add</span>
        New Generation
      </RouterLink>
    </div>

    <!-- Filters & Search -->
    <div class="card p-4 flex flex-wrap items-center gap-4">
      <div class="relative flex-1 min-w-[280px]">
        <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
        >search</span>
        <input
          class="w-full pl-10 pr-4 py-2.5 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm outline-none text-zinc-700 dark:text-zinc-200 placeholder-zinc-400 dark:placeholder-zinc-600"
          placeholder="Search past generations..."
          type="text"
        />
      </div>
      <div class="flex items-center gap-2">
        <button class="btn-ghost flex items-center gap-2">
          <span class="material-symbols-outlined text-[18px]">filter_list</span>
          Type
        </button>
        <button class="btn-ghost flex items-center gap-2">
          <span class="material-symbols-outlined text-[18px]">calendar_today</span>
          Date
        </button>
        <button class="btn-ghost flex items-center gap-2">
          <span class="material-symbols-outlined text-[18px]">check_circle</span>
          Status
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
              <th class="px-6 py-4 text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Content Title</th>
              <th class="px-6 py-4 text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Type</th>
              <th class="px-6 py-4 text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Generated</th>
              <th class="px-6 py-4 text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-4 text-[11px] font-medium text-zinc-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-zinc-200/50 dark:divide-zinc-800/50">
            <tr
              v-for="item in historyItems"
              :key="item.id"
              class="hover:bg-zinc-200/50 dark:hover:bg-zinc-800/30 transition-colors group"
            >
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div :class="`w-10 h-10 rounded-lg flex items-center justify-center ${item.iconBg}`">
                    <span :class="`material-symbols-outlined ${item.iconColor}`">{{ item.icon }}</span>
                  </div>
                  <span class="font-medium text-zinc-700 dark:text-zinc-200 text-sm">{{ item.title }}</span>
                </div>
              </td>
              <td class="px-6 py-4">
                <span class="px-3 py-1 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 text-[11px] font-medium">
                  {{ item.type }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span class="text-sm text-zinc-500">{{ item.date }}</span>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2" :class="statusConfig[item.status].text">
                  <span :class="[`w-2 h-2 rounded-full ${statusConfig[item.status].dot}`, item.status === 'completed' ? 'animate-pulse' : '']"
                  ></span>
                  <span class="text-xs font-medium">{{ statusConfig[item.status].label }}</span>
                </div>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <button class="p-2 hover:bg-zinc-300 dark:hover:bg-zinc-700 rounded-lg text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
                    title="View"
                  >
                    <span class="material-symbols-outlined text-[20px]">visibility</span>
                  </button>
                  <button class="p-2 hover:bg-zinc-300 dark:hover:bg-zinc-700 rounded-lg text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
                    title="Copy"
                  >
                    <span class="material-symbols-outlined text-[20px]">content_copy</span>
                  </button>
                  <button class="p-2 hover:bg-red-500/10 rounded-lg text-zinc-500 hover:text-red-400 transition-colors"
                    title="Delete"
                  >
                    <span class="material-symbols-outlined text-[20px]">delete</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/30">
        <p class="text-sm text-zinc-500">
          Showing <span class="font-medium text-zinc-600 dark:text-zinc-300">1-4</span> of <span class="font-medium text-zinc-600 dark:text-zinc-300">124</span> results
        </p>
        <div class="flex items-center gap-2">
          <button
            disabled
            class="px-3 py-1.5 text-sm border border-zinc-200 dark:border-zinc-800 rounded-md text-zinc-500 disabled:opacity-40 transition-colors"
          >
            Previous
          </button>
          <button
            class="px-3 py-1.5 text-sm border border-zinc-200 dark:border-zinc-800 rounded-md text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- Recent Collections -->
    <div class="mt-12">
      <h3 class="text-xl font-semibold text-zinc-900 dark:text-white mb-6">Recent Collections</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Featured Collection -->
        <div class="md:col-span-2 relative bg-gradient-to-br from-indigo-600 to-indigo-900 rounded-2xl p-6 text-white overflow-hidden group"
        >
          <div class="relative z-10">
            <span class="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 inline-block"
            >
              Featured
            </span>
            <h4 class="text-2xl font-bold mb-2">Q4 Launch Campaign</h4>
            <p class="text-indigo-200 text-sm max-w-sm mb-6 leading-relaxed">
              A unified collection of social posts, ad copy, and internal memos for the upcoming enterprise release.
            </p>
            <button class="flex items-center gap-2 text-sm font-semibold group-hover:translate-x-1 transition-transform"
            >
              Open Collection
              <span class="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
          <div class="absolute right-0 bottom-0 w-1/2 h-full opacity-20 pointer-events-none">
            <div class="w-full h-full bg-indigo-400 rounded-full blur-3xl transform translate-x-1/3 translate-y-1/3"></div>
          </div>
        </div>

        <!-- Favorites Card -->
        <div class="card p-6 flex flex-col">
          <div class="w-12 h-12 rounded-xl bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center mb-6"
          >
            <span class="material-symbols-outlined text-zinc-500">star</span>
          </div>
          <h4 class="text-lg font-bold text-zinc-900 dark:text-white mb-2">Favorites</h4>
          <p class="text-zinc-500 text-sm mb-6 leading-relaxed">
            Access your most frequently used and starred generation templates.
          </p>
          <div class="mt-auto pt-4 border-t border-zinc-200 dark:border-zinc-800">
            <span class="text-indigo-400 text-sm font-semibold">12 Saved Items</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
