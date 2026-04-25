<script setup lang="ts">
import { ref } from 'vue'

const faqs = ref([
  {
    question: 'How do I generate content?',
    answer: 'Go to the Generate page, enter a topic, select your content type, tone, and length preferences, then click "Generate Content". Your generated content will be saved to your history automatically.',
    open: false,
  },
  {
    question: 'What AI providers are supported?',
    answer: 'Lexora supports Groq (fast inference with open-source models) and OpenAI (GPT models). You can set your default provider in Settings.',
    open: false,
  },
  {
    question: 'How do I view my generation history?',
    answer: 'Click on "History" in the sidebar to view all your past generations. You can search, filter, and delete entries from there.',
    open: false,
  },
  {
    question: 'Can I export my content?',
    answer: 'Yes! From the Dashboard, click the "Export Report" button to download your data as PDF or CSV. You can also copy individual generations from the History page.',
    open: false,
  },
  {
    question: 'How do I change the theme?',
    answer: 'You can change between Light, Dark, and System themes from the Settings page, or use the theme toggle button in the top navbar.',
    open: false,
  },
])

const toggleFaq = (index: number) => {
  faqs.value[index].open = !faqs.value[index].open
}
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-12 pb-12">
    <!-- Header -->
    <header class="text-center mb-10">
      <div class="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
        <span class="material-symbols-outlined text-white material-symbols-filled text-3xl">help_outline</span>
      </div>
      <h1 class="page-title">Support Center</h1>
      <p class="page-subtitle mt-2">Find answers to common questions and get help with Lexora AI.</p>
    </header>

    <!-- Quick Actions -->
    <section class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="card p-6 text-center hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors">
        <span class="material-symbols-outlined text-3xl text-indigo-400 mb-3">play_circle</span>
        <h3 class="text-lg font-semibold text-zinc-900 dark:text-white mb-2">Getting Started</h3>
        <p class="text-sm text-zinc-500">Learn the basics of content generation</p>
      </div>
      
      <div class="card p-6 text-center hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors">
        <span class="material-symbols-outlined text-3xl text-indigo-400 mb-3"> settings </span>
        <h3 class="text-lg font-semibold text-zinc-900 dark:text-white mb-2">Configuration</h3>
        <p class="text-sm text-zinc-500">Set up providers and preferences</p>
      </div>
      
      <div class="card p-6 text-center hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors">
        <span class="material-symbols-outlined text-3xl text-indigo-400 mb-3">contact_support</span>
        <h3 class="text-lg font-semibold text-zinc-900 dark:text-white mb-2">Contact Us</h3>
        <p class="text-sm text-zinc-500">Get in touch for additional help</p>
      </div>
    </section>

    <!-- FAQ Section -->
    <section>
      <div class="flex items-center gap-2 mb-6">
        <span class="material-symbols-outlined text-indigo-400">quiz</span>
        <h2 class="text-xl font-semibold text-zinc-900 dark:text-white">Frequently Asked Questions</h2>
      </div>

      <div class="space-y-3">
        <div
          v-for="(faq, index) in faqs"
          :key="index"
          class="card overflow-hidden"
        >
          <button
            @click="toggleFaq(index)"
            class="w-full flex items-center justify-between p-6 text-left hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
          >
            <span class="text-sm font-medium text-zinc-700 dark:text-zinc-200">{{ faq.question }}</span>
            <span class="material-symbols-outlined text-zinc-500 transition-transform"
              :class="faq.open ? 'rotate-180' : ''"
            >expand_more</span>
          </button>
          <div
            v-show="faq.open"
            class="px-6 pb-6 border-t border-zinc-200 dark:border-zinc-800"
          >
            <p class="text-sm text-zinc-500 mt-4 leading-relaxed">{{ faq.answer }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section>
      <div class="flex items-center gap-2 mb-6">
        <span class="material-symbols-outlined text-indigo-400">mail</span>
        <h2 class="text-xl font-semibold text-zinc-900 dark:text-white">Contact Support</h2>
      </div>

      <div class="card p-8">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="space-y-6">
            <div class="flex items-start gap-4">
              <div class="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
                <span class="material-symbols-outlined text-indigo-400">email</span>
              </div>
              <div>
                <p class="text-sm font-medium text-zinc-700 dark:text-zinc-200">Email</p>
                <a href="mailto:support@lexora.ai" class="text-sm text-indigo-400 hover:underline">support@lexora.ai</a>
              </div>
            </div>

            <div class="flex items-start gap-4">
              <div class="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
                <span class="material-symbols-outlined text-indigo-400">discord</span>
              </div>
              <div>
                <p class="text-sm font-medium text-zinc-700 dark:text-zinc-200">Community</p>
                <p class="text-sm text-zinc-500">Join our Discord community</p>
              </div>
            </div>
          </div>

          <div class="space-y-4">
            <p class="text-sm text-zinc-500">Have a question or need help? Send us a message and we'll get back to you as soon as possible.</p>
            <div class="space-y-3">
              <input
                class="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-700 dark:text-zinc-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                placeholder="Your email"
                type="email"
              />
              <textarea
                class="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-700 dark:text-zinc-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-none"
                placeholder="How can we help?"
                rows="4"
              ></textarea>
              <button class="btn-primary w-full flex items-center justify-center gap-2">
                <span class="material-symbols-outlined text-sm">send</span>
                Send Message
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
