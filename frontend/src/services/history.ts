const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export interface HistoryEntry {
  id: string
  title: string
  content: string
  contentType: string
  tone: string
  length: string
  provider: string
  model: string
  wordCount: number
  createdAt: string
}

export async function fetchHistory(limit?: number): Promise<HistoryEntry[]> {
  const url = new URL(`${API_BASE_URL}/history`)
  if (limit) {
    url.searchParams.append('limit', limit.toString())
  }

  const response = await fetch(url.toString())

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to fetch history')
  }

  const data = await response.json()
  return data.data || data
}

export async function deleteHistoryEntry(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/history/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to delete entry')
  }
}
