import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { AIService } from './ai.service'
import { GroqProvider } from './providers/groq.provider'
import { OpenAIProvider } from './providers/openai.provider'

@Module({
  imports: [HttpModule],
  providers: [AIService, GroqProvider, OpenAIProvider],
  exports: [AIService],
})
export class AIModule {}
