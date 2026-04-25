import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-custom'
import { AccountsService } from '../accounts.service'

@Injectable()
export class AppleStrategy extends PassportStrategy(Strategy, 'apple') {
  constructor(private readonly accountsService: AccountsService) {
    super()
  }

  async validate(req: any): Promise<any> {
    const { authorization } = req.headers

    if (!authorization) {
      throw new UnauthorizedException('Apple authorization token required')
    }

    // In production, verify the Apple identity token with Apple's servers
    // For now, we'll simulate a successful Apple login
    const mockAppleUser = {
      email: `apple_user_${Date.now()}@example.com`,
      name: 'Apple User',
      provider: 'apple' as const,
      providerId: `apple_${Date.now()}`,
    }

    const user = await this.accountsService.findOrCreate(mockAppleUser)
    return user
  }
}
