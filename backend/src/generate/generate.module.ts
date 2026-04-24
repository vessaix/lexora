import { Module } from '@nestjs/common'
import { GenerateController } from './generate.controller'
import { GenerateService } from './generate.service'
import { AIModule } from '../ai/ai.module'

@Module({
  imports: [AIModule],
  controllers: [GenerateController],
  providers: [GenerateService],
})
export class GenerateModule {}
