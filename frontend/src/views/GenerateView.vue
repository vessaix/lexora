<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useClickOutside } from '../composables/useClickOutside'
import { generateContent } from '../services/api'
import { saveToHistory } from '../services/dashboard'
import { getGenerationDefaults } from '../services/preferences'

const topic = ref('')
const contentType = ref('Blog Post')
const tone = ref('Professional')
const length = ref('Medium (~750 words)')
const generating = ref(false)
const error = ref('')

// Load saved defaults on mount
onMounted(() => {
  const defaults = getGenerationDefaults()
  contentType.value = defaults.contentType
  tone.value = defaults.tone
  length.value = defaults.length
})

// Generated content state
const generatedContent = ref('')
const generatedTitle = ref('')
const generatedWordCount = ref(0)
const generatedProvider = ref('')
const hasGenerated = ref(false)

const contentTypes = ['Blog Post', 'Social Media', 'Technical Paper', 'Email Draft', 'Product Copy']
const tones = ['Professional', 'Creative', 'Witty', 'Urgent', 'Academic']
const lengths = ['Short (~250 words)', 'Medium (~750 words)', 'Long (~1500+ words)']

// Smart presets per content type
const contentTypePresets: Record<string, { tone: string; length: string }> = {
  'Blog Post': { tone: 'Professional', length: 'Medium (~750 words)' },
  'Social Media': { tone: 'Creative', length: 'Short (~250 words)' },
  'Technical Paper': { tone: 'Academic', length: 'Long (~1500+ words)' },
  'Email Draft': { tone: 'Professional', length: 'Short (~250 words)' },
  'Product Copy': { tone: 'Creative', length: 'Short (~250 words)' },
}

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
  if (field === 'contentType') {
    contentType.value = value
    // Auto-update tone and length based on content type preset
    const preset = contentTypePresets[value]
    if (preset) {
      tone.value = preset.tone
      length.value = preset.length
    }
  }
  if (field === 'tone') tone.value = value
  if (field === 'length') length.value = value
  openDropdown.value = null
}

const handleGenerate = async () => {
  if (!isFormValid.value) return
  
  generating.value = true
  error.value = ''
  
  try {
    const response = await generateContent({
      topic: topic.value,
      contentType: contentType.value,
      tone: tone.value,
      length: length.value,
    })
    
    if (response.success) {
      generatedContent.value = response.data.content
      generatedTitle.value = response.data.title
      generatedWordCount.value = response.data.wordCount
      generatedProvider.value = response.data.provider
      hasGenerated.value = true
      
      // Save to history
      try {
        await saveToHistory({
          title: response.data.title,
          content: response.data.content,
          contentType: contentType.value,
          tone: tone.value,
          length: length.value,
          provider: response.data.provider,
          model: response.data.model,
          wordCount: response.data.wordCount,
        })
      } catch (historyErr) {
        console.warn('Failed to save to history:', historyErr)
      }
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to generate content. Please try again.'
  } finally {
    generating.value = false
  }
}

const isFormValid = computed(() => topic.value.trim().length > 0)

const copyContent = () => {
  navigator.clipboard.writeText(generatedContent.value)
}
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

    <!-- Error message -->
    <div v-if="error" class="card p-4 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
      <p class="text-red-600 dark:text-red-400 text-sm">{{ error }}</p>
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
                class="w-full relative overflow-hidden bg-[#4f46e5] hover:bg-[#5b52eb] disabled:bg-zinc-200 dark:disabled:bg-zinc-900 disabled:text-zinc-400 dark:disabled:text-zinc-600 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-lg flex items-center justify-center gap-2.5 transition-all duration-200 active:scale-[0.98] shadow-lg shadow-[#4f46e5]/25 hover:shadow-[#5b52eb]/35"
              >
                <span
                  v-if="generating"
                  class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"
                ></span>
                <span v-else class="material-symbols-outlined material-symbols-filled">auto_awesome</span>
                <span>{{ generating ? 'Generating...' : 'Generate Content' }}</span>
                <span class="hidden sm:inline text-[10px] text-white/60 font-normal ml-1">Ctrl + Enter</span>
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
        <!-- Empty state -->
        <div v-if="!hasGenerated && !generating" class="card p-8 flex flex-col items-center justify-center text-center min-h-[400px]">
          <div class="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
            <span class="material-symbols-outlined text-3xl text-zinc-400">edit_note</span>
          </div>
          <h3 class="text-lg font-semibold text-zinc-900 dark:text-white mb-2">Ready to Generate</h3>
          <p class="text-sm text-zinc-500 max-w-sm">
            Enter a topic and click "Generate Content" to see AI-powered content here.
          </p>
        </div>

        <!-- Loading state -->
        <div v-if="generating" class="card p-8 flex flex-col items-center justify-center text-center min-h-[400px]">
          <div class="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
          <p class="text-sm text-zinc-500">Generating your content...</p>
        </div>

        <!-- Generated content -->
        <template v-if="hasGenerated && !generating">
          <div class="card overflow-hidden">
            <!-- Toolbar -->
            <div class="px-6 py-3 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-900/50">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-zinc-500">description</span>
                <span class="text-xs font-medium text-zinc-500 uppercase tracking-wider">Preview Output</span>
              </div>
              <div class="flex gap-1">
                <button @click="copyContent" class="p-1.5 text-zinc-500 hover:text-indigo-400 transition-colors" title="Copy">
                  <span class="material-symbols-outlined">content_copy</span>
                </button>
              </div>
            </div>

            <!-- Content -->
            <div class="p-8 space-y-6">
              <div class="flex items-center gap-4">
                <span class="px-3 py-1 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold uppercase tracking-widest rounded-full"
                >
                  {{ contentType }}
                </span>
                <span class="text-sm text-zinc-500">{{ generatedWordCount }} words • {{ generatedProvider }}</span>
              </div>

              <h2 class="text-3xl font-bold text-zinc-900 dark:text-white leading-tight">{{ generatedTitle }}</h2>

              <div class="prose dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-400">
                <div v-html="generatedContent.replace(/\n/g, '<br>')"></div>
              </div>
            </div>
          </div>

          <!-- Analysis Bento -->
          <div class="grid grid-cols-3 gap-4">
            <div class="card p-4">
              <p class="text-zinc-500 text-[10px] font-medium uppercase tracking-wider mb-1">Word Count</p>
              <div class="flex items-end justify-between">
                <span class="text-2xl font-bold text-zinc-900 dark:text-white">{{ generatedWordCount }}</span>
                <span class="text-emerald-400 text-xs mb-1">Generated</span>
              </div>
            </div>
            <div class="card p-4">
              <p class="text-zinc-500 text-[10px] font-medium uppercase tracking-wider mb-1">Provider</p>
              <div class="flex items-end justify-between">
                <span class="text-2xl font-bold text-zinc-900 dark:text-white capitalize">{{ generatedProvider }}</span>
                <span class="text-indigo-400 text-xs mb-1">AI</span>
              </div>
            </div>
            <div class="card p-4">
              <p class="text-zinc-500 text-[10px] font-medium uppercase tracking-wider mb-1">Content Type</p>
              <div class="flex items-end justify-between">
                <span class="text-2xl font-bold text-zinc-900 dark:text-white">{{ contentType }}</span>
                <span class="text-zinc-500 dark:text-zinc-400 text-xs mb-1">Format</span>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
