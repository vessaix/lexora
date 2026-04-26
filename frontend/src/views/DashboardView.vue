<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { fetchDashboard, type DashboardData } from '../services/dashboard'
import { getUser } from '../services/auth'
import { jsPDF } from 'jspdf'

const dashboard = ref<DashboardData | null>(null)
const loading = ref(true)
const error = ref('')
const showExportMenu = ref(false)

const userName = computed(() => getUser()?.name || 'User')

function closeExportMenu(e: MouseEvent) {
  const target = e.target as HTMLElement
  if (!target.closest('.export-dropdown')) {
    showExportMenu.value = false
  }
}

onMounted(async () => {
  document.addEventListener('click', closeExportMenu)
  try {
    dashboard.value = await fetchDashboard()
  } catch (err: any) {
    error.value = err.message || 'Failed to load dashboard'
  } finally {
    loading.value = false
  }
})

onUnmounted(() => {
  document.removeEventListener('click', closeExportMenu)
})

const stats = computed(() => {
  if (!dashboard.value) return []
  const d = dashboard.value.stats
  
  return [
    {
      label: 'Total Generations',
      value: d.totalGenerations.toLocaleString(),
      change: d.totalGenerations > 0 ? 'Active' : undefined,
      icon: 'auto_fix_high',
      hasChart: true,
      bars: calculateBars(d.totalGenerations),
    },
    {
      label: 'Tokens Used',
      value: formatTokens(d.totalTokens),
      sub: `${formatTokens(d.monthlyLimit)} Monthly Limit`,
      hasDonut: true,
      donutValue: d.tokenUsagePercent,
      icon: 'database',
    },
    {
      label: 'Total Words',
      value: d.totalWords.toLocaleString(),
      status: d.totalWords > 0 ? 'Generated' : undefined,
      hasProgress: true,
      progress: Math.min(d.tokenUsagePercent, 100),
      icon: 'speed',
    },
    {
      label: 'Active Providers',
      value: d.providerStats.length.toString(),
      hasAvatars: d.providerStats.length > 0,
      providers: d.providerStats,
      icon: 'folder_open',
    },
  ]
})

const weeklyActivity = computed(() => {
  if (!dashboard.value) return []
  return dashboard.value.weeklyActivity
})

const recentActivity = computed(() => {
  if (!dashboard.value) return []
  return dashboard.value.recentActivity.map(item => ({
    title: item.title,
    type: item.type,
    time: formatTimeAgo(item.createdAt),
    icon: getIconForType(item.type),
  }))
})

function calculateBars(total: number): number[] {
  // Generate realistic-looking bars based on total count
  if (total === 0) return [10, 15, 8, 20, 12]
  const base = Math.min(total / 5, 100)
  return [
    Math.round(base * 0.6),
    Math.round(base * 0.8),
    Math.round(base * 0.5),
    Math.round(base * 1.0),
    Math.round(base * 0.9),
  ]
}

function formatTokens(tokens: number): string {
  if (tokens >= 1000) {
    return `${(tokens / 1000).toFixed(1)}k`
  }
  return tokens.toString()
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

function getIconForType(type: string): string {
  const iconMap: Record<string, string> = {
    'Blog Post': 'article',
    'Social Media': 'share',
    'Technical Paper': 'science',
    'Email Draft': 'mail',
    'Product Copy': 'shopping_bag',
  }
  return iconMap[type] || 'description'
}

function getMaxWeeklyCount(): number {
  if (!dashboard.value) return 1
  const max = Math.max(...dashboard.value.weeklyActivity.map(d => d.count))
  return max > 0 ? max : 1
}

function exportPDF() {
  if (!dashboard.value) return

  const doc = new jsPDF()
  const d = dashboard.value
  const dateStr = new Date().toISOString().split('T')[0]

  // Title
  doc.setFontSize(20)
  doc.text('Lexora Report', 20, 20)

  doc.setFontSize(10)
  doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 30)

  // Stats
  doc.setFontSize(14)
  doc.text('Statistics', 20, 45)

  doc.setFontSize(10)
  let y = 55
  doc.text(`Total Generations: ${d.stats.totalGenerations}`, 20, y)
  y += 7
  doc.text(`Tokens Used: ${d.stats.totalTokens.toLocaleString()}`, 20, y)
  y += 7
  doc.text(`Total Words: ${d.stats.totalWords.toLocaleString()}`, 20, y)
  y += 7
  doc.text(`Monthly Limit: ${d.stats.monthlyLimit.toLocaleString()}`, 20, y)
  y += 7
  doc.text(`Token Usage: ${d.stats.tokenUsagePercent}%`, 20, y)

  // Provider Breakdown
  y += 12
  doc.setFontSize(14)
  doc.text('Provider Breakdown', 20, y)

  y += 10
  doc.setFontSize(10)
  d.stats.providerStats.forEach(p => {
    doc.text(`${p.name}: ${p.count} generations`, 20, y)
    y += 7
  })

  // Weekly Activity
  y += 8
  doc.setFontSize(14)
  doc.text('Weekly Activity', 20, y)

  y += 10
  doc.setFontSize(10)
  d.weeklyActivity.forEach(day => {
    doc.text(`${day.day}: ${day.count} generations`, 20, y)
    y += 7
  })

  // Recent Activity
  y += 8
  doc.setFontSize(14)
  doc.text('Recent Activity', 20, y)

  y += 10
  doc.setFontSize(10)
  d.recentActivity.forEach(item => {
    const text = `${item.title} (${item.type})`
    const truncated = text.length > 60 ? text.substring(0, 60) + '...' : text
    doc.text(truncated, 20, y)
    y += 7
  })

  doc.save(`lexora-report-${dateStr}.pdf`)
  showExportMenu.value = false
}

function exportCSV() {
  if (!dashboard.value) return

  const d = dashboard.value
  const dateStr = new Date().toISOString().split('T')[0]

  let csv = 'Lexora Dashboard Report\n'
  csv += `Generated At,${new Date().toLocaleString()}\n\n`

  csv += 'Statistics\n'
  csv += 'Metric,Value\n'
  csv += `Total Generations,${d.stats.totalGenerations}\n`
  csv += `Tokens Used,${d.stats.totalTokens}\n`
  csv += `Total Words,${d.stats.totalWords}\n`
  csv += `Monthly Limit,${d.stats.monthlyLimit}\n`
  csv += `Token Usage %,${d.stats.tokenUsagePercent}\n\n`

  csv += 'Provider Breakdown\n'
  csv += 'Provider,Count\n'
  d.stats.providerStats.forEach(p => {
    csv += `${p.name},${p.count}\n`
  })
  csv += '\n'

  csv += 'Weekly Activity\n'
  csv += 'Day,Generations\n'
  d.weeklyActivity.forEach(day => {
    csv += `${day.day},${day.count}\n`
  })
  csv += '\n'

  csv += 'Recent Activity\n'
  csv += 'Title,Type,Created At\n'
  d.recentActivity.forEach(item => {
    csv += `"${item.title.replace(/"/g, '""')}","${item.type}","${new Date(item.createdAt).toLocaleString()}"\n`
  })

  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `lexora-report-${dateStr}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
  showExportMenu.value = false
}
</script>

<template>
  <div class="max-w-7xl mx-auto space-y-8">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center min-h-[400px]">
      <div class="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="card p-6 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
      <p class="text-red-600 dark:text-red-400">{{ error }}</p>
    </div>

    <!-- Dashboard Content -->
    <template v-else>
      <!-- Header Section -->
      <div class="flex items-end justify-between">
        <div>
          <h1 class="page-title mb-2">Workspace Overview</h1>
          <p class="page-subtitle">Welcome back, {{ userName }}. Here's what happened with Lexora AI today.</p>
        </div>
        <div class="flex gap-3">
          <button class="btn-ghost flex items-center gap-2">
            <span class="material-symbols-outlined text-[18px]">calendar_today</span>
            Last 7 Days
          </button>
          <div class="relative export-dropdown">
            <button @click.stop="showExportMenu = !showExportMenu" class="btn-ghost flex items-center gap-2">
              <span class="material-symbols-outlined text-[18px]">download</span>
              Export Report
              <span class="material-symbols-outlined text-[14px]">{{ showExportMenu ? 'expand_less' : 'expand_more' }}</span>
            </button>
            <div v-if="showExportMenu" class="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-lg z-50 py-1">
              <button @click="exportPDF" class="w-full text-left px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 flex items-center gap-2 transition-colors">
                <span class="material-symbols-outlined text-[16px]">picture_as_pdf</span>
                Export as PDF
              </button>
              <button @click="exportCSV" class="w-full text-left px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 flex items-center gap-2 transition-colors">
                <span class="material-symbols-outlined text-[16px]">table</span>
                Export as CSV
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Analytics Widgets -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="card p-5 flex flex-col gap-4"
        >
          <div class="flex justify-between items-start">
            <div class="p-2 bg-indigo-500/10 rounded-lg">
              <span class="material-symbols-outlined text-indigo-600 dark:text-indigo-400">{{ stat.icon }}</span>
            </div>
            <span
              v-if="stat.change"
              class="text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center bg-emerald-500/10 px-2 py-0.5 rounded-full"
            >
              {{ stat.change }}
              <span class="material-symbols-outlined text-[14px] ml-1">trending_up</span>
            </span>
            <span
              v-if="stat.status"
              class="text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center bg-emerald-500/10 px-2 py-0.5 rounded-full"
            >
              {{ stat.status }}
            </span>
          </div>

          <div>
            <p class="label-upper">{{ stat.label }}</p>
            <h2 class="text-3xl font-bold text-zinc-900 dark:text-white mt-1">{{ stat.value }}</h2>
            <p v-if="stat.sub" class="text-[10px] text-zinc-500 mt-1">{{ stat.sub }}</p>
          </div>

          <!-- Bar chart -->
          <div v-if="stat.hasChart" class="h-8 flex items-end gap-1">
            <div
              v-for="(h, i) in stat.bars"
              :key="i"
              class="flex-1 rounded-t transition-colors"
              :class="i === stat.bars.length - 1 ? 'bg-indigo-500' : 'bg-zinc-200 dark:bg-zinc-800'"
              :style="`height: ${Math.max(h, 10)}%`"
            ></div>
          </div>

          <!-- Donut chart -->
          <div v-if="stat.hasDonut" class="flex items-center gap-4">
            <div class="relative w-16 h-16 flex-shrink-0">
              <svg class="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.9155" fill="transparent" stroke="currentColor" class="text-zinc-200 dark:text-zinc-800" stroke-width="3"/>
                <circle
                  cx="18" cy="18" r="15.9155" fill="transparent" stroke="#6366f1"
                  stroke-width="3"
                  :stroke-dasharray="`${stat.donutValue}, 100`"
                  stroke-linecap="round"
                />
              </svg>
              <span class="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-zinc-900 dark:text-white"
                >{{ stat.donutValue }}%</span>
            </div>
          </div>

          <!-- Progress bar -->
          <div v-if="stat.hasProgress">
            <div class="w-full bg-zinc-200 dark:bg-zinc-800 h-1 rounded-full mt-4 overflow-hidden">
              <div class="bg-indigo-500 h-full rounded-full" :style="`width: ${stat.progress}%`"></div>
            </div>
          </div>

          <!-- Provider badges -->
          <div v-if="stat.hasAvatars && stat.providers" class="flex -space-x-2 mt-4 overflow-hidden">
            <div
              v-for="(provider, i) in stat.providers.slice(0, 3)"
              :key="provider.name"
              class="inline-block h-6 px-2 rounded-full ring-2 ring-white dark:ring-zinc-900 flex items-center justify-center text-[10px] font-bold"
              :class="[
                i === 0 ? 'bg-indigo-600 text-white' :
                i === 1 ? 'bg-zinc-400 dark:bg-zinc-700 text-white dark:text-zinc-300' :
                'bg-zinc-300 dark:bg-zinc-600 text-zinc-700 dark:text-zinc-200'
              ]"
            >
              {{ provider.name.charAt(0).toUpperCase() }}
            </div>
            <div v-if="stat.providers.length > 3" class="flex items-center justify-center h-6 px-2 rounded-full bg-zinc-200 dark:bg-zinc-800 ring-2 ring-white dark:ring-zinc-900 text-[10px] font-bold text-zinc-500 dark:text-zinc-400"
            >+{{ stat.providers.length - 3 }}</div>
          </div>
        </div>
      </div>

      <!-- Dashboard Body -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Generation Activity Chart -->
        <div class="lg:col-span-2 card p-6">
          <div class="flex items-center justify-between mb-8">
            <div>
              <h3 class="text-lg font-semibold text-zinc-900 dark:text-white">Generation Activity</h3>
              <p class="text-sm text-zinc-500">Daily content generation volume</p>
            </div>
            <div class="flex items-center gap-2">
              <div class="flex items-center gap-1.5 px-3 py-1 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md">
                <div class="w-2 h-2 rounded-full bg-indigo-500"></div>
                <span class="text-[11px] text-zinc-500 dark:text-zinc-400 uppercase font-bold tracking-tighter">Generations</span>
              </div>
            </div>
          </div>

          <!-- Chart -->
          <div class="relative h-64 w-full flex items-end justify-between px-2 gap-4">
            <!-- Grid Lines -->
            <div class="absolute inset-0 flex flex-col justify-between pointer-events-none">
              <div v-for="i in 4" :key="i" class="w-full border-t border-zinc-200/50 dark:border-zinc-800/50"></div>
            </div>
            <!-- Columns -->
            <div
              v-for="day in weeklyActivity"
              :key="day.day"
              class="relative group flex-1 h-full flex flex-col justify-end"
            >
              <div
                class="w-full bg-indigo-500/80 rounded-t group-hover:bg-indigo-400 transition-colors"
                :style="`height: ${day.count > 0 ? (day.count / getMaxWeeklyCount() * 100) : 5}%`"
              ></div>
              <span
                class="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-zinc-400"
              >
                {{ day.day }}
              </span>
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="card overflow-hidden">
          <div class="p-6 border-b border-zinc-200 dark:border-zinc-800">
            <h3 class="text-lg font-semibold text-zinc-900 dark:text-white">Recent Activity</h3>
            <p class="text-sm text-zinc-500">Your most recent content generations</p>
          </div>
          <div class="divide-y divide-zinc-200 dark:divide-zinc-800">
            <div
              v-for="item in recentActivity"
              :key="item.title"
              class="p-4 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/30 transition-colors group"
            >
              <div class="flex items-center gap-3">
                <div
                  class="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center group-hover:bg-indigo-500/10 dark:group-hover:bg-indigo-500/20 transition-colors"
                >
                  <span
                    class="material-symbols-outlined text-[20px] text-zinc-500 dark:text-zinc-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors"
                  >{{ item.icon }}</span>
                </div>
                <div class="flex-1 min-w-0">
                  <h4 class="text-sm font-medium text-zinc-900 dark:text-white truncate">{{ item.title }}</h4>
                  <div class="flex items-center gap-2 mt-0.5">
                    <span class="text-[10px] text-zinc-500 uppercase tracking-tight font-bold">{{ item.type }}</span>
                    <span class="text-[10px] text-zinc-400 dark:text-zinc-600">&bull;</span>
                    <span class="text-[10px] text-zinc-500">{{ item.time }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="recentActivity.length === 0" class="p-8 text-center">
              <p class="text-sm text-zinc-500">No activity yet. Generate your first content!</p>
            </div>
          </div>
          <div class="p-4 bg-zinc-50 dark:bg-zinc-900/50">
            <RouterLink
              to="/history"
              class="w-full block text-center text-xs font-bold text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors uppercase tracking-widest py-1"
            >
              View Full History
            </RouterLink>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
