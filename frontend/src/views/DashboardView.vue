<script setup lang="ts">
const stats = [
  {
    label: 'Total Generations',
    value: '1,284',
    change: '+12%',
    icon: 'auto_fix_high',
    hasChart: true,
    bars: [40, 60, 45, 80, 95],
  },
  {
    label: 'Tokens Used',
    value: '428k',
    sub: '600k Monthly Limit',
    hasDonut: true,
    donutValue: 72,
    icon: 'database',
  },
  {
    label: 'Efficiency',
    value: '94.2%',
    status: 'Optimal',
    hasProgress: true,
    progress: 94,
    icon: 'speed',
  },
  {
    label: 'Active Projects',
    value: '12',
    hasAvatars: true,
    icon: 'folder_open',
  },
]

const chartDays = [
  { day: 'MON', textH: 80, imgH: 40 },
  { day: 'TUE', textH: 70, imgH: 30 },
  { day: 'WED', textH: 90, imgH: 20 },
  { day: 'THU', textH: 85, imgH: 50 },
  { day: 'FRI', textH: 60, imgH: 35 },
  { day: 'SAT', textH: 40, imgH: 20 },
  { day: 'SUN', textH: 75, imgH: 25 },
]

const activities = [
  { title: 'Marketing Copy Strategy', type: 'Text Generation', time: '2 min ago', icon: 'description' },
  { title: 'Product Hero Asset #04', type: 'Visual Studio', time: '45 min ago', icon: 'image' },
  { title: 'Auth Module Optimization', type: 'Code Engine', time: '2 hours ago', icon: 'code' },
  { title: 'Q3 Quarterly Review Script', type: 'Text Generation', time: '5 hours ago', icon: 'description' },
  { title: 'Legal Disclaimer (FR)', type: 'Global Engine', time: 'Yesterday', icon: 'translate' },
]
</script>

<template>
  <div class="max-w-7xl mx-auto space-y-8">
    <!-- Header Section -->
    <div class="flex items-end justify-between">
      <div>
        <h1 class="page-title mb-2">Workspace Overview</h1>
        <p class="page-subtitle">Welcome back, Alex. Here's what happened with Lexora AI today.</p>
      </div>
      <div class="flex gap-3">
        <button class="btn-ghost flex items-center gap-2">
          <span class="material-symbols-outlined text-[18px]">calendar_today</span>
          Last 7 Days
        </button>
        <button class="btn-ghost flex items-center gap-2">
          <span class="material-symbols-outlined text-[18px]">download</span>
          Export Report
        </button>
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
            :style="`height: ${h}%`"
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
                stroke-dasharray="72, 100"
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

        <!-- Avatars -->
        <div v-if="stat.hasAvatars" class="flex -space-x-2 mt-4 overflow-hidden">
          <div
            v-for="i in 3"
            :key="i"
            class="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-zinc-900 flex items-center justify-center text-[10px] font-bold"
            :class="[
              i === 1 ? 'bg-indigo-600 text-white' :
              i === 2 ? 'bg-zinc-400 dark:bg-zinc-700 text-white dark:text-zinc-300' :
              'bg-zinc-300 dark:bg-zinc-600 text-zinc-700 dark:text-zinc-200'
            ]"
          >
            {{ ['JD', 'SK', 'MR'][i-1] }}
          </div>
          <div class="flex items-center justify-center h-6 w-6 rounded-full bg-zinc-200 dark:bg-zinc-800 ring-2 ring-white dark:ring-zinc-900 text-[10px] font-bold text-zinc-500 dark:text-zinc-400"
          >+4</div>
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
            <p class="text-sm text-zinc-500">Output volume across all active engines</p>
          </div>
          <div class="flex items-center gap-2">
            <div class="flex items-center gap-1.5 px-3 py-1 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md">
              <div class="w-2 h-2 rounded-full bg-indigo-500"></div>
              <span class="text-[11px] text-zinc-500 dark:text-zinc-400 uppercase font-bold tracking-tighter">Text</span>
            </div>
            <div class="flex items-center gap-1.5 px-3 py-1 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md">
              <div class="w-2 h-2 rounded-full bg-zinc-400 dark:bg-zinc-600"></div>
              <span class="text-[11px] text-zinc-500 dark:text-zinc-400 uppercase font-bold tracking-tighter">Image</span>
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
            v-for="day in chartDays"
            :key="day.day"
            class="relative group flex-1 h-full flex flex-col justify-end"
          >
            <div
              class="w-full bg-indigo-500/80 rounded-t group-hover:bg-indigo-400 transition-colors"
              :style="`height: ${day.textH}%`"
            ></div>
            <div
              class="w-full bg-zinc-300/50 dark:bg-zinc-700/50 rounded-t absolute bottom-0"
              :style="`height: ${day.imgH}%`"
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
          <p class="text-sm text-zinc-500">Your most recent engine outputs</p>
        </div>
        <div class="divide-y divide-zinc-200 dark:divide-zinc-800">
          <div
            v-for="item in activities"
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
              <button class="text-zinc-400 dark:text-zinc-600 hover:text-zinc-700 dark:hover:text-zinc-300">
                <span class="material-symbols-outlined text-[18px]">more_vert</span>
              </button>
            </div>
          </div>
        </div>
        <div class="p-4 bg-zinc-50 dark:bg-zinc-900/50">
          <button
            class="w-full text-center text-xs font-bold text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors uppercase tracking-widest py-1"
          >
            View Full History
          </button>
        </div>
      </div>
    </div>

    <!-- Promo Card -->
    <div class="relative bg-indigo-600 rounded-3xl p-8 overflow-hidden group">
      <div class="relative z-10 max-w-xl">
        <span
          class="inline-block bg-white/20 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4"
        >
          Pro Feature Release
        </span>
        <h2 class="text-3xl font-bold text-white mb-4">Introducing Lexora Image Flux.</h2>
        <p class="text-indigo-100 text-sm leading-relaxed mb-6">
          Experience zero-shot photorealistic generation with our new lightning-fast flux engine.
          Optimized for commercial production and ready to integrate into your projects.
        </p>
        <div class="flex gap-4">
          <button
            class="bg-white text-indigo-600 px-6 py-3 rounded-xl font-semibold text-sm hover:bg-indigo-50 transition-colors"
          >
            Try Flux Engine
          </button>
          <button
            class="bg-indigo-500/50 border border-indigo-400/50 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-indigo-500/60 transition-colors"
          >
            Learn More
          </button>
        </div>
      </div>

      <!-- Abstract glows -->
      <div
        class="absolute right-[-10%] top-[-20%] w-[500px] h-[500px] bg-indigo-400/20 rounded-full blur-[80px] pointer-events-none group-hover:scale-110 transition-transform duration-700"
      ></div>
      <div
        class="absolute right-10 bottom-[-20%] w-[300px] h-[300px] bg-white/10 rounded-full blur-[60px] pointer-events-none"
      ></div>
      <div class="absolute right-16 top-1/2 -translate-y-1/2 opacity-20 pointer-events-none scale-[4]">
        <span class="material-symbols-outlined text-white material-symbols-filled">auto_awesome</span>
      </div>
    </div>
  </div>
</template>
