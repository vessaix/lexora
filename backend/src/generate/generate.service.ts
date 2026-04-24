import { Injectable } from '@nestjs/common'
import { AIService } from '../ai/ai.service'
import { GenerateContentDto } from '../common/dto/generate-content.dto'

@Injectable()
export class GenerateService {
  constructor(private readonly aiService: AIService) {}

  async generate(dto: GenerateContentDto) {
    return this.aiService.generate(
      {
        topic: dto.topic,
        contentType: dto.contentType || 'Blog Post',
        tone: dto.tone || 'Professional',
        length: dto.length || 'Medium (~750 words)',
      },
      dto.provider,
    )
  }
}
