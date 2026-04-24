import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common'
import { GenerateContentDto } from '../common/dto/generate-content.dto'
import { GenerateService } from './generate.service'

@Controller('generate')
export class GenerateController {
  constructor(private readonly generateService: GenerateService) {}

  @Post()
  async generate(@Body() dto: GenerateContentDto) {
    try {
      const result = await this.generateService.generate(dto)
      return {
        success: true,
        data: result,
      }
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Failed to generate content',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }
}
