<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { handleAuthCallback } from '../services/auth'

const router = useRouter()

onMounted(() => {
  if (handleAuthCallback()) {
    router.push('/')
  } else {
    router.push('/login')
  }
})
</script>

<template>
  <div class="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
    <div class="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
  </div>
</template>
