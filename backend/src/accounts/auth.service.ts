import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { AccountsService } from './accounts.service'
import { User } from './user.interface'

@Injectable()
export class AuthService {
  constructor(
    private readonly accountsService: AccountsService,
    private readonly jwtService: JwtService,
  ) {}

  async login(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      provider: user.provider,
    }

    return {
      access_token: this.jwtService.sign(payload),
      user,
    }
  }

  async validateUser(userId: string): Promise<User | null> {
    const user = await this.accountsService.findById(userId)
    return user || null
  }
}
