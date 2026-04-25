<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { fetchHistory, deleteHistoryEntry, type HistoryEntry } from '../services/history'

interface HistoryItem {
  id: string
  title: string
  icon: string
  iconColor: string
  iconBg: string
  type: string
  date: string
  status: 'completed' | 'draft'
}

const entries = ref<HistoryEntry[]>([])
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    entries.value = await fetchHistory(50)
  } catch (err: any) {
    error.value = err.message || 'Failed to load history'
  } finally {
    loading.value = false
  }
})

function getIconForType(contentType: string): string {
  const iconMap: Record<string, string> = {
    'Blog Post': 'article',
    'Social Media': 'share',
    'Technical Paper': 'science',
    'Email Draft': 'mail',
    'Product Copy': 'shopping_bag',
    'Marketing Plan': 'campaign',
    'Email': 'alternate_email',
  }
  return iconMap[contentType] || 'description'
}

function getIconColor(contentType: string): string {
  const colorMap: Record<string, string> = {
    'Blog Post': 'text-indigo-400',
    'Social Media': 'text-purple-400',
    'Technical Paper': 'text-blue-400',
    'Email Draft': 'text-emerald-400',
    'Product Copy': 'text-amber-400',
    'Marketing Plan': 'text-emerald-400',
    'Email': 'text-blue-400',
  }
  return colorMap[contentType] || 'text-zinc-400'
}

function getIconBg(contentType: string): string {
  const bgMap: Record<string, string> = {
    'Blog Post': 'bg-indigo-500/10',
    'Social Media': 'bg-purple-500/10',
    'Technical Paper': 'bg-blue-500/10',
    'Email Draft': 'bg-emerald-500/10',
    'Product Copy': 'bg-amber-500/10',
    'Marketing Plan': 'bg-emerald-500/10',
    'Email': 'bg-blue-500/10',
  }
  return bgMap[contentType] || 'bg-zinc-500/10'
}

function formatTimeAgo(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins} min ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  return date.toLocaleDateString()
}

const historyItems = computed((): HistoryItem[] => {
  return entries.value.map(entry => ({
    id: entry.id,
    title: entry.title,
    icon: getIconForType(entry.contentType),
    iconColor: getIconColor(entry.contentType),
    iconBg: getIconBg(entry.contentType),
    type: entry.contentType,
    date: formatTimeAgo(entry.createdAt),
    status: 'completed',
  }))
})

async function handleDelete(id: string) {
  if (!confirm('Are you sure you want to delete this entry?')) return
  try {
    await deleteHistoryEntry(id)
    entries.value = entries.value.filter(e => e.id !== id)
  } catch (err: any) {
    alert(err.message || 'Failed to delete entry')
  }
}

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

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center min-h-[400px]">
      <div class="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="card p-6 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
      <p class="text-red-600 dark:text-red-400">{{ error }}</p>
    </div>

    <!-- Table -->
    <div v-else class="card overflow-hidden">
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
                  <button
                    @click="handleDelete(item.id)"
                    class="p-2 hover:bg-red-500/10 rounded-lg text-zinc-500 hover:text-red-400 transition-colors"
                    title="Delete"
                  >
                    <span class="material-symbols-outlined text-[20px]">delete</span>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="historyItems.length === 0">
              <td colspan="5" class="px-6 py-12 text-center text-zinc-500">
                <span class="material-symbols-outlined text-4xl mb-2 block text-zinc-300 dark:text-zinc-600">history</span>
                No history yet. Generate your first content!
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="historyItems.length > 0" class="px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/30">
        <p class="text-sm text-zinc-500">
          Showing <span class="font-medium text-zinc-600 dark:text-zinc-300">1-{{ historyItems.length }}</span> of <span class="font-medium text-zinc-600 dark:text-zinc-300">{{ entries.length }}</span> results
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


  </div>
</template>
