import { defineConfig } from 'unocss'
import presetUno from '@unocss/preset-uno'
import presetAttributify from '@unocss/preset-attributify'
import presetIcons from '@unocss/preset-icons'

export default defineConfig({
  presets: [
    presetUno({ dark: 'class' }),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      warn: true,
    }),
  ],
  theme: {
    colors: {
      zinc: {
        50: '#fafafa',
        100: '#f4f4f5',
        200: '#e4e4e7',
        300: '#d4d4d8',
        400: '#a1a1aa',
        500: '#71717a',
        600: '#52525b',
        700: '#3f3f46',
        800: '#27272a',
        900: '#18181b',
        950: '#09090b',
      },
      indigo: {
        50: '#eef2ff',
        100: '#e0e7ff',
        200: '#c7d2fe',
        300: '#a5b4fc',
        400: '#818cf8',
        500: '#6366f1',
        600: '#4f46e5',
        700: '#4338ca',
        800: '#3730a3',
        900: '#312e81',
        950: '#1e1b4b',
      },
      emerald: {
        400: '#34d399',
        500: '#10b981',
      },
    },
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
    },
  },
  shortcuts: {
    'btn-primary': 'h-9 px-4 bg-indigo-600 text-white rounded-lg font-medium text-sm transition-all hover:bg-indigo-500 active:scale-[0.98]',
    'btn-ghost': 'h-9 px-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg font-medium text-sm transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800',
    'card': 'bg-white dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 rounded-2xl',
    'page-title': 'text-2xl font-bold text-zinc-900 dark:text-white tracking-tight',
    'page-subtitle': 'text-sm text-zinc-500 dark:text-zinc-400',
    'label-upper': 'text-[10px] text-zinc-500 uppercase tracking-widest font-bold',
  },
})
