import { Injectable } from '@nestjs/common'
import { User } from './user.interface'

@Injectable()
export class AccountsService {
  private users: User[] = []

  async findOrCreate(userData: {
    email: string
    name: string
    picture?: string
    provider: 'google' | 'apple'
    providerId: string
  }): Promise<User> {
    const existingUser = this.users.find(
      u => u.provider === userData.provider && u.providerId === userData.providerId
    )

    if (existingUser) {
      return existingUser
    }

    const newUser: User = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...userData,
      createdAt: new Date(),
    }

    this.users.push(newUser)
    return newUser
  }

  async findById(id: string): Promise<User | undefined> {
    return this.users.find(u => u.id === id)
  }

  async findAll(): Promise<User[]> {
    return this.users
  }
}
