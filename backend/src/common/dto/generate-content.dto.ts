import { IsString, IsOptional, IsIn } from 'class-validator'

export class GenerateContentDto {
  @IsString()
  topic: string

  @IsString()
  @IsOptional()
  @IsIn(['Blog Post', 'Social Media', 'Technical Paper', 'Email Draft', 'Product Copy'])
  contentType?: string = 'Blog Post'

  @IsString()
  @IsOptional()
  @IsIn(['Professional', 'Creative', 'Witty', 'Urgent', 'Academic'])
  tone?: string = 'Professional'

  @IsString()
  @IsOptional()
  @IsIn(['Short (~250 words)', 'Medium (~750 words)', 'Long (~1500+ words)'])
  length?: string = 'Medium (~750 words)'

  @IsString()
  @IsOptional()
  provider?: string
}
