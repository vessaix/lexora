const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

interface GenerateRequest {
  topic: string
  contentType: string
  tone: string
  length: string
  provider?: string
}

interface GenerateResponse {
  success: boolean
  data: {
    content: string
    title: string
    wordCount: number
    provider: string
    model: string
  }
}

export async function generateContent(request: GenerateRequest): Promise<GenerateResponse> {
  const response = await fetch(`${API_BASE_URL}/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to generate content')
  }

  return response.json()
}
