export interface GenerateContentRequest {
  topic: string
  contentType: string
  tone: string
  length: string
}

export interface GenerateContentResponse {
  content: string
  title: string
  wordCount: number
  provider: string
  model: string
}

export interface AIProvider {
  readonly name: string
  readonly model: string
  generate(request: GenerateContentRequest): Promise<GenerateContentResponse>
}
