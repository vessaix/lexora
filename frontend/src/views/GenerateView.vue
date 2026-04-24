<script setup lang="ts">
import { ref, computed } from 'vue'
import { useClickOutside } from '../composables/useClickOutside'

const topic = ref('')
const contentType = ref('Blog Post')
const tone = ref('Professional')
const length = ref('Medium (~750 words)')
const generating = ref(false)

const contentTypes = ['Blog Post', 'Social Media', 'Technical Paper', 'Email Draft', 'Product Copy']
const tones = ['Professional', 'Creative', 'Witty', 'Urgent', 'Academic']
const lengths = ['Short (~250 words)', 'Medium (~750 words)', 'Long (~1500+ words)']

// Dropdown open state
const openDropdown = ref<string | null>(null)
const typeDropdownRef = ref<HTMLElement | null>(null)
const toneDropdownRef = ref<HTMLElement | null>(null)
const lengthDropdownRef = ref<HTMLElement | null>(null)

useClickOutside(typeDropdownRef, () => {
  if (openDropdown.value === 'type') openDropdown.value = null
})

useClickOutside(toneDropdownRef, () => {
  if (openDropdown.value === 'tone') openDropdown.value = null
})

useClickOutside(lengthDropdownRef, () => {
  if (openDropdown.value === 'length') openDropdown.value = null
})

const toggleDropdown = (name: string) => {
  openDropdown.value = openDropdown.value === name ? null : name
}

const selectOption = (field: 'contentType' | 'tone' | 'length', value: string) => {
  if (field === 'contentType') contentType.value = value
  if (field === 'tone') tone.value = value
  if (field === 'length') length.value = value
  openDropdown.value = null
}

const handleGenerate = () => {
  generating.value = true
  setTimeout(() => {
    generating.value = false
  }, 2500)
}

const isFormValid = computed(() => topic.value.trim().length > 0)
</script>

<template>
  <div class="max-w-7xl mx-auto space-y-8">
    <!-- Header -->
    <div class="flex items-end justify-between">
      <div>
        <h1 class="page-title mb-2">Generate Content</h1>
        <p class="page-subtitle">Create AI-powered content tailored to your brand voice.</p>
      </div>
    </div>

    <!-- 2-column layout -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- Left: Input Form -->
      <div class="lg:col-span-5">
        <div class="card p-6 sticky top-6">
          <div class="flex items-center gap-2 mb-6">
            <span class="material-symbols-outlined text-indigo-400">edit_note</span>
            <h3 class="text-lg font-semibold text-zinc-900 dark:text-white">Prompt Details</h3>
          </div>

          <form class="space-y-5" @submit.prevent="handleGenerate">
            <!-- Topic -->
            <div>
              <label class="block text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">Topic or Prompt</label>
              <textarea
                v-model="topic"
                rows="6"
                class="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 text-sm text-zinc-700 dark:text-zinc-200 placeholder-zinc-600 focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all outline-none resize-none"
                placeholder="What would you like Lexora to write about today?"
              ></textarea>
              <div class="flex justify-between mt-1.5">
                <span class="text-[10px] text-zinc-600">Be specific for better results</span>
                <span class="text-[10px] text-zinc-600">{{ topic.length }}/500</span>
              </div>
            </div>

            <!-- Content Type + Tone -->
            <div class="grid grid-cols-2 gap-4">
              <!-- Custom Dropdown: Content Type -->
              <div ref="typeDropdownRef" class="relative">
                <label class="block text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">Content Type</label>
                <button
                  type="button"
                  @click="toggleDropdown('type')"
                  class="w-full flex items-center justify-between bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-700 dark:text-zinc-200 hover:border-zinc-700 focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all outline-none"
                  :class="openDropdown === 'type' ? 'border-indigo-500 ring-2 ring-indigo-500/30' : ''"
                >
                  <span class="flex items-center gap-2">
                    <span class="material-symbols-outlined text-zinc-500 text-base">category</span>
                    {{ contentType }}
                  </span>
                  <span class="material-symbols-outlined text-zinc-600 transition-transform duration-200" :class="openDropdown === 'type' ? 'rotate-180' : ''">expand_more</span>
                </button>
                <div
                  v-if="openDropdown === 'type'"
                  class="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden z-50 shadow-xl shadow-black/20"
                >
                  <button
                    v-for="t in contentTypes"
                    :key="t"
                    type="button"
                    @click="selectOption('contentType', t)"
                    class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white transition-colors"
                    :class="contentType === t ? 'bg-indigo-500/10 text-indigo-400' : ''"
                  >
                    <span v-if="contentType === t" class="material-symbols-outlined text-indigo-400 text-base material-symbols-filled">check</span>
                    <span v-else class="w-4"></span>
                    {{ t }}
                  </button>
                </div>
              </div>

              <!-- Custom Dropdown: Tone -->
              <div ref="toneDropdownRef" class="relative">
                <label class="block text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">Tone</label>
                <button
                  type="button"
                  @click="toggleDropdown('tone')"
                  class="w-full flex items-center justify-between bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-700 dark:text-zinc-200 hover:border-zinc-700 focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all outline-none"
                  :class="openDropdown === 'tone' ? 'border-indigo-500 ring-2 ring-indigo-500/30' : ''"
                >
                  <span class="flex items-center gap-2">
                    <span class="material-symbols-outlined text-zinc-500 text-base">music_note</span>
                    {{ tone }}
                  </span>
                  <span class="material-symbols-outlined text-zinc-600 transition-transform duration-200" :class="openDropdown === 'tone' ? 'rotate-180' : ''">expand_more</span>
                </button>
                <div
                  v-if="openDropdown === 'tone'"
                  class="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden z-50 shadow-xl shadow-black/20"
                >
                  <button
                    v-for="t in tones"
                    :key="t"
                    type="button"
                    @click="selectOption('tone', t)"
                    class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white transition-colors"
                    :class="tone === t ? 'bg-indigo-500/10 text-indigo-400' : ''"
                  >
                    <span v-if="tone === t" class="material-symbols-outlined text-indigo-400 text-base material-symbols-filled">check</span>
                    <span v-else class="w-4"></span>
                    {{ t }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Custom Dropdown: Length -->
            <div ref="lengthDropdownRef" class="relative">
              <label class="block text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">Target Length</label>
              <button
                type="button"
                @click="toggleDropdown('length')"
                class="w-full flex items-center justify-between bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-700 dark:text-zinc-200 hover:border-zinc-700 focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all outline-none"
                :class="openDropdown === 'length' ? 'border-indigo-500 ring-2 ring-indigo-500/30' : ''"
              >
                <span class="flex items-center gap-2">
                  <span class="material-symbols-outlined text-zinc-500 text-base">straighten</span>
                  {{ length }}
                </span>
                <span class="material-symbols-outlined text-zinc-600 transition-transform duration-200" :class="openDropdown === 'length' ? 'rotate-180' : ''">expand_more</span>
              </button>
              <div
                v-if="openDropdown === 'length'"
                class="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden z-50 shadow-xl shadow-black/20"
              >
                <button
                  v-for="l in lengths"
                  :key="l"
                  type="button"
                  @click="selectOption('length', l)"
                  class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white transition-colors"
                  :class="length === l ? 'bg-indigo-500/10 text-indigo-400' : ''"
                >
                  <span v-if="length === l" class="material-symbols-outlined text-indigo-400 text-base material-symbols-filled">check</span>
                  <span v-else class="w-4"></span>
                  {{ l }}
                </button>
              </div>
            </div>

            <!-- Generate Button -->
            <div class="pt-2">
              <button
                type="submit"
                :disabled="!isFormValid || generating"
                class="w-full relative overflow-hidden bg-[#4f46e5] hover:bg-[#5b52eb] disabled:bg-zinc-200 dark:disabled:bg-zinc-900 disabled:text-zinc-400 dark:disabled:text-zinc-600 disabled:cursor-not-allowed text-zinc-900 dark:text-white font-semibold py-3.5 rounded-lg flex items-center justify-center gap-2.5 transition-all duration-200 active:scale-[0.98] shadow-lg shadow-[#4f46e5]/25 hover:shadow-[#5b52eb]/35"
              >
                <span
                  v-if="generating"
                  class="w-5 h-5 border-2 border-zinc-900/30 dark:border-white/30 border-t-zinc-900 dark:border-t-white rounded-full animate-spin"
                ></span>
                <span v-else class="material-symbols-outlined material-symbols-filled">auto_awesome</span>
                <span>{{ generating ? 'Generating...' : 'Generate Content' }}</span>
                <span class="hidden sm:inline text-[10px] text-zinc-900/60 dark:text-white/60 font-normal ml-1">Ctrl + Enter</span>
              </button>
              <p v-if="!isFormValid" class="text-center text-[11px] text-zinc-600 mt-2">
                Enter a topic to get started
              </p>
            </div>
          </form>
        </div>
      </div>

      <!-- Right: Output Preview -->
      <div class="lg:col-span-7 space-y-6">
        <!-- Preview Card -->
        <div class="card overflow-hidden">
          <!-- Toolbar -->
          <div class="px-6 py-3 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-900/50">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-zinc-500">description</span>
              <span class="text-xs font-medium text-zinc-500 uppercase tracking-wider">Preview Output</span>
            </div>
            <div class="flex gap-1">
              <button class="p-1.5 text-zinc-500 hover:text-indigo-400 transition-colors">
                <span class="material-symbols-outlined">content_copy</span>
              </button>
              <button class="p-1.5 text-zinc-500 hover:text-indigo-400 transition-colors">
                <span class="material-symbols-outlined">download</span>
              </button>
              <button class="p-1.5 text-zinc-500 hover:text-indigo-400 transition-colors">
                <span class="material-symbols-outlined">share</span>
              </button>
            </div>
          </div>

          <!-- Content -->
          <div class="p-8 space-y-6">
            <div class="flex items-center gap-4">
              <span class="px-3 py-1 bg-indigo-500/10 text-indigo-400 text-[10px] font-bold uppercase tracking-widest rounded-full">
                Blog Post
              </span>
              <span class="text-sm text-zinc-500 italic">Generated 2 minutes ago</span>
            </div>

            <h2 class="text-3xl font-bold text-zinc-900 dark:text-white leading-tight">The Future of Generative AI in Enterprise Workflows</h2>

            <div class="relative w-full h-64 rounded-xl overflow-hidden bg-zinc-200 dark:bg-zinc-800">
              <div class="absolute inset-0 flex items-center justify-center">
                <span class="material-symbols-outlined text-6xl text-zinc-700">image</span>
              </div>
              <div class="absolute inset-0 bg-gradient-to-t from-zinc-50/60 dark:from-zinc-950/60 to-transparent"></div>
            </div>

            <div class="space-y-6 text-zinc-500 dark:text-zinc-400 text-base leading-relaxed">
              <p class="font-semibold text-zinc-700 dark:text-zinc-200">
                In the rapidly evolving landscape of digital transformation, Lexora AI represents the next frontier in cognitive assistance. This transition marks a shift from simple automation to intelligent orchestration.
              </p>

              <p>
                The core challenge for modern enterprises isn't just generating data, but synthesizing it into actionable insights. Generative AI tools are now capable of understanding context, nuance, and specific corporate brand voices with unprecedented accuracy.
              </p>

              <div class="p-6 bg-zinc-50 dark:bg-zinc-900/50 border-l-4 border-indigo-500 rounded-r-xl italic text-zinc-600 dark:text-zinc-300">
                "Artificial intelligence will not replace managers, but managers who use AI will replace those who do not."
              </div>

              <h3 class="text-xl font-semibold text-zinc-900 dark:text-white pt-2">Key Strategic Advantages</h3>

              <ul class="space-y-3">
                <li class="flex items-start gap-3">
                  <span class="material-symbols-outlined text-indigo-400 mt-0.5 material-symbols-filled">check_circle</span>
                  <span>Reduced time-to-market for complex content strategies.</span>
                </li>
                <li class="flex items-start gap-3">
                  <span class="material-symbols-outlined text-indigo-400 mt-0.5 material-symbols-filled">check_circle</span>
                  <span>Consistency across global omni-channel communications.</span>
                </li>
                <li class="flex items-start gap-3">
                  <span class="material-symbols-outlined text-indigo-400 mt-0.5 material-symbols-filled">check_circle</span>
                  <span>Data-driven refinement based on historical performance.</span>
                </li>
              </ul>

              <p>
                As we look toward the 2025 horizon, the integration of Large Language Models (LLMs) into daily SaaS platforms will become seamless. Lexora is built on this very premise—power at your fingertips without the friction of complex prompt engineering.
              </p>
            </div>
          </div>
        </div>

        <!-- Analysis Bento -->
        <div class="grid grid-cols-3 gap-4">
          <div class="card p-4">
            <p class="text-zinc-500 text-[10px] font-medium uppercase tracking-wider mb-1">Readability</p>
            <div class="flex items-end justify-between">
              <span class="text-2xl font-bold text-zinc-900 dark:text-white">84%</span>
              <span class="text-emerald-400 text-xs mb-1">Optimal</span>
            </div>
          </div>
          <div class="card p-4">
            <p class="text-zinc-500 text-[10px] font-medium uppercase tracking-wider mb-1">Tone Match</p>
            <div class="flex items-end justify-between">
              <span class="text-2xl font-bold text-zinc-900 dark:text-white">High</span>
              <span class="text-indigo-400 text-xs mb-1">Accurate</span>
            </div>
          </div>
          <div class="card p-4">
            <p class="text-zinc-500 text-[10px] font-medium uppercase tracking-wider mb-1">Keywords</p>
            <div class="flex items-end justify-between">
              <span class="text-2xl font-bold text-zinc-900 dark:text-white">12</span>
              <span class="text-zinc-500 dark:text-zinc-400 text-xs mb-1">Detected</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>