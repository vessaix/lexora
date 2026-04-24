import { ref, onMounted } from 'vue'

type ThemeMode = 'light' | 'dark' | 'system'

const isDark = ref(false)
const currentMode = ref<ThemeMode>('system')

function getSystemTheme(): 'light' | 'dark' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function resolveTheme(mode: ThemeMode): 'light' | 'dark' {
  return mode === 'system' ? getSystemTheme() : mode
}

function applyToDOM(dark: boolean) {
  isDark.value = dark
  const html = document.documentElement
  if (dark) {
    html.classList.add('dark')
  } else {
    html.classList.remove('dark')
  }
}

export function useTheme() {
  const setTheme = (mode: ThemeMode) => {
    currentMode.value = mode
    if (mode === 'system') {
      localStorage.removeItem('theme')
    } else {
      localStorage.setItem('theme', mode)
    }
    applyToDOM(resolveTheme(mode) === 'dark')
  }

  onMounted(() => {
    const stored = localStorage.getItem('theme') as ThemeMode | null
    currentMode.value = stored || 'system'
    applyToDOM(resolveTheme(currentMode.value) === 'dark')

    // Listen for system changes
    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    mql.addEventListener('change', () => {
      if (currentMode.value === 'system') {
        applyToDOM(getSystemTheme() === 'dark')
      }
    })
  })

  return {
    isDark,
    currentMode,
    setTheme,
  }
}
