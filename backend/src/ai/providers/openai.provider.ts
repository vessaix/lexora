import { Injectable } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { firstValueFrom } from 'rxjs'
import { AIProvider, GenerateContentRequest, GenerateContentResponse } from '../ai-provider.interface'

@Injectable()
export class OpenAIProvider implements AIProvider {
  readonly name = 'openai'
  readonly model = 'gpt-4o-mini'
  private readonly apiUrl = 'https://api.openai.com/v1/chat/completions'

  constructor(private readonly httpService: HttpService) {}

  async generate(request: GenerateContentRequest): Promise<GenerateContentResponse> {
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY not configured')
    }

    const prompt = this.buildPrompt(request)

    const response = await firstValueFrom(
      this.httpService.post(
        this.apiUrl,
        {
          model: this.model,
          messages: [
            {
              role: 'system',
              content: 'You are a professional content writer. Generate high-quality, structured content based on the user\'s requirements. Return ONLY the content, no explanations.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 4000,
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        },
      ),
    )

    const content = response.data.choices[0]?.message?.content || ''
    const title = this.extractTitle(content)

    return {
      content,
      title,
      wordCount: content.split(/\s+/).length,
      provider: this.name,
      model: this.model,
    }
  }

  private buildPrompt(request: GenerateContentRequest): string {
    return `Write a ${request.contentType.toLowerCase()} about "${request.topic}".

Tone: ${request.tone}
Length: ${request.length}

Requirements:
- Use a ${request.tone.toLowerCase()} tone throughout
- Structure with clear headings and paragraphs
- Include an engaging introduction and conclusion
- Target length: ${request.length}

Format the output with proper markdown headings (#, ##) and paragraphs.`
  }

  private extractTitle(content: string): string {
    const match = content.match(/^#\s+(.+)$/m)
    return match ? match[1] : 'Untitled Content'
  }
}
