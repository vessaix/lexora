<script setup lang="ts">
const faqs = [
  {
    q: 'How do I generate content?',
    a: 'Go to Generate, enter a topic, choose type/tone/length, then click "Generate".',
  },
  {
    q: 'Which AI providers are supported?',
    a: 'Groq (fast, open-source) and OpenAI (GPT models). Switch in Settings.',
  },
  {
    q: 'Where is my content saved?',
    a: 'Everything is saved to History automatically after generation.',
  },
]
</script>

<template>
  <div class="max-w-3xl mx-auto space-y-8 pb-12">
    <h1 class="page-title">Support</h1>

    <div class="card p-6">
      <h2 class="text-lg font-semibold text-zinc-900 dark:text-white mb-4">Need Help?</h2>
      <p class="text-sm text-zinc-500 mb-4">
        Check the FAQ below or reach out on
        <a href="https://github.com/vessaix/lexora/issues" target="_blank" class="text-indigo-400 hover:underline">GitHub Issues</a>
        .
      </p>
      <a href="mailto:support@lexora.ai" class="text-sm text-indigo-400 hover:underline">support@lexora.ai</a>
    </div>

    <div class="card p-6">
      <h2 class="text-lg font-semibold text-zinc-900 dark:text-white mb-4">FAQ</h2>
      <div class="space-y-3">
        <details v-for="faq in faqs" :key="faq.q" class="group">
          <summary class="flex items-center justify-between cursor-pointer text-sm font-medium text-zinc-700 dark:text-zinc-200 hover:text-indigo-400 transition-colors">
            {{ faq.q }}
            <span class="material-symbols-outlined text-zinc-500 group-open:rotate-180 transition-transform">expand_more</span>
          </summary>
          <p class="text-sm text-zinc-500 mt-2 pl-4 border-l-2 border-zinc-200 dark:border-zinc-700">{{ faq.a }}</p>
        </details>
      </div>
    </div>
  </div>
</template>
