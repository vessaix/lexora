const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export interface User {
  id: string
  email: string
  name: string
  picture?: string
  provider: string
}

export function getGoogleAuthUrl(): string {
  return `${API_BASE_URL}/auth/google`
}

export function getAppleAuthUrl(): string {
  return `${API_BASE_URL}/auth/apple`
}

export function getAuthToken(): string | null {
  return localStorage.getItem('lexora_token')
}

export function setAuthToken(token: string): void {
  localStorage.setItem('lexora_token', token)
}

export function removeAuthToken(): void {
  localStorage.removeItem('lexora_token')
}

export function getUser(): User | null {
  const userStr = localStorage.getItem('lexora_user')
  if (!userStr) return null
  try {
    return JSON.parse(userStr)
  } catch {
    return null
  }
}

export function setUser(user: User): void {
  localStorage.setItem('lexora_user', JSON.stringify(user))
}

export function removeUser(): void {
  localStorage.removeItem('lexora_user')
}

export function isAuthenticated(): boolean {
  return !!getAuthToken()
}

export async function fetchProfile(): Promise<User | null> {
  const token = getAuthToken()
  if (!token) return null

  try {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      if (response.status === 401) {
        removeAuthToken()
        removeUser()
      }
      return null
    }

    const data = await response.json()
    const user = data.data
    setUser(user)
    return user
  } catch {
    return null
  }
}

export async function logout(): Promise<void> {
  removeAuthToken()
  removeUser()
  window.location.href = '/'
}

export function handleAuthCallback(): boolean {
  const urlParams = new URLSearchParams(window.location.search)
  const token = urlParams.get('token')
  const name = urlParams.get('name')
  const email = urlParams.get('email')
  const picture = urlParams.get('picture')

  if (token && name && email) {
    setAuthToken(token)
    setUser({
      id: '',
      email: decodeURIComponent(email),
      name: decodeURIComponent(name),
      picture: picture ? decodeURIComponent(picture) : undefined,
      provider: 'google',
    })
    return true
  }

  return false
}
