const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export interface DashboardData {
  stats: {
    totalGenerations: number
    totalTokens: number
    tokenUsagePercent: number
    monthlyLimit: number
    totalWords: number
    providerStats: { name: string; count: number }[]
    contentTypeStats: { name: string; count: number }[]
  }
  weeklyActivity: { day: string; count: number }[]
  recentActivity: {
    id: string
    title: string
    type: string
    provider: string
    wordCount: number
    createdAt: string
  }[]
}

export async function fetchDashboard(): Promise<DashboardData> {
  const response = await fetch(`${API_BASE_URL}/dashboard`)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to fetch dashboard data')
  }

  const data = await response.json()
  return data
}

export async function saveToHistory(entry: {
  title: string
  content: string
  contentType: string
  tone: string
  length: string
  provider: string
  model: string
  wordCount: number
}): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/history`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(entry),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to save to history')
  }

  return response.json()
}
