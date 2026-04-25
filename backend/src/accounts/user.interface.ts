export interface User {
  id: string
  email: string
  name: string
  picture?: string
  provider: 'google' | 'apple'
  providerId: string
  createdAt: Date
}
