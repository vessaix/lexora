import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { AccountsService } from '../accounts.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly accountsService: AccountsService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'lexora-secret-key-change-in-production',
    })
  }

  async validate(payload: any) {
    const user = await this.accountsService.findById(payload.sub)

    if (!user) {
      throw new UnauthorizedException()
    }

    return user
  }
}
