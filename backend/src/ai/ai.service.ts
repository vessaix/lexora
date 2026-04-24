import { Injectable, Logger } from '@nestjs/common'
import { AIProvider, GenerateContentRequest, GenerateContentResponse } from './ai-provider.interface'
import { GroqProvider } from './providers/groq.provider'
import { OpenAIProvider } from './providers/openai.provider'

@Injectable()
export class AIService {
  private readonly logger = new Logger(AIService.name)
  private readonly providers: Map<string, AIProvider> = new Map()
  private readonly fallbackOrder = ['groq', 'openai']

  constructor(
    private readonly groqProvider: GroqProvider,
    private readonly openaiProvider: OpenAIProvider,
  ) {
    this.providers.set('groq', groqProvider)
    this.providers.set('openai', openaiProvider)
  }

  async generate(request: GenerateContentRequest, preferredProvider?: string): Promise<GenerateContentResponse> {
    const providersToTry = preferredProvider
      ? [preferredProvider, ...this.fallbackOrder.filter(p => p !== preferredProvider)]
      : this.fallbackOrder

    for (const providerName of providersToTry) {
      const provider = this.providers.get(providerName)
      if (!provider) continue

      try {
        this.logger.log(`Trying provider: ${providerName}`)
        const result = await provider.generate(request)
        this.logger.log(`Successfully generated content with ${providerName}`)
        return result
      } catch (error) {
        this.logger.warn(`Provider ${providerName} failed: ${error.message}`)
        continue
      }
    }

    throw new Error('All AI providers failed')
  }

  getAvailableProviders(): { name: string; model: string; available: boolean }[] {
    return Array.from(this.providers.values()).map(provider => ({
      name: provider.name,
      model: provider.model,
      available: !!(
        provider.name === 'groq'
          ? process.env.GROQ_API_KEY
          : process.env.OPENAI_API_KEY
      ),
    }))
  }
}
