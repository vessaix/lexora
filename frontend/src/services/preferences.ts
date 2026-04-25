import { getUser } from './auth'

export interface GenerationDefaults {
  contentType: string
  tone: string
  length: string
}

export function getGenerationDefaults(): GenerationDefaults {
  const defaults = localStorage.getItem('lexora_generation_defaults')
  if (defaults) {
    try {
      return JSON.parse(defaults)
    } catch {
      // fall through
    }
  }
  return {
    contentType: 'Blog Post',
    tone: 'Professional',
    length: 'Medium (~750 words)',
  }
}

export function setGenerationDefaults(defaults: GenerationDefaults): void {
  localStorage.setItem('lexora_generation_defaults', JSON.stringify(defaults))
}

export function getDefaultProvider(): string {
  return localStorage.getItem('lexora_default_provider') || 'groq'
}

export function setDefaultProvider(provider: string): void {
  localStorage.setItem('lexora_default_provider', provider)
}

export function getApiKeyStatus(): { groq: boolean; openai: boolean } {
  return {
    groq: !!import.meta.env.VITE_GROQ_API_KEY,
    openai: !!import.meta.env.VITE_OPENAI_API_KEY,
  }
}

export function getWorkspaceName(): string {
  return localStorage.getItem('lexora_workspace_name') || 'Lexora AI'
}

export function setWorkspaceName(name: string): void {
  localStorage.setItem('lexora_workspace_name', name)
}

export function getLanguage(): string {
  return localStorage.getItem('lexora_language') || 'English (US)'
}

export function setLanguage(language: string): void {
  localStorage.setItem('lexora_language', language)
}

export function getAutoOptimize(): boolean {
  const value = localStorage.getItem('lexora_auto_optimize')
  return value !== 'false'
}

export function setAutoOptimize(value: boolean): void {
  localStorage.setItem('lexora_auto_optimize', value.toString())
}

export function exportAllData(): object {
  const data: Record<string, unknown> = {}
  
  // Export all localStorage items that start with lexora_
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && key.startsWith('lexora_')) {
      try {
        data[key] = JSON.parse(localStorage.getItem(key) || '')
      } catch {
        data[key] = localStorage.getItem(key)
      }
    }
  }

  return {
    exportedAt: new Date().toISOString(),
    user: getUser(),
    data,
  }
}

export function clearAllData(): void {
  // Remove all localStorage items that start with lexora_
  const keysToRemove: string[] = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && key.startsWith('lexora_')) {
      keysToRemove.push(key)
    }
  }
  keysToRemove.forEach(key => localStorage.removeItem(key))
}

export function formatJoinDate(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
