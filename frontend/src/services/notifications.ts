export interface Notification {
  id: string
  title: string
  message: string
  type: 'success' | 'info' | 'warning'
  read: boolean
  createdAt: string
  link?: string
}

const STORAGE_KEY = 'lexora_notifications'

export function getNotifications(): Notification[] {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) return []
  try {
    return JSON.parse(stored)
  } catch {
    return []
  }
}

export function saveNotifications(notifications: Notification[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications))
}

export function addNotification(notification: Omit<Notification, 'id' | 'createdAt' | 'read'>): Notification {
  const notifications = getNotifications()
  const newNotification: Notification = {
    ...notification,
    id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    read: false,
  }
  notifications.unshift(newNotification)
  
  // Keep only last 20 notifications
  if (notifications.length > 20) {
    notifications.pop()
  }
  
  saveNotifications(notifications)
  return newNotification
}

export function markAsRead(id: string): void {
  const notifications = getNotifications()
  const notification = notifications.find(n => n.id === id)
  if (notification) {
    notification.read = true
    saveNotifications(notifications)
  }
}

export function markAllAsRead(): void {
  const notifications = getNotifications()
  notifications.forEach(n => n.read = true)
  saveNotifications(notifications)
}

export function clearAllNotifications(): void {
  localStorage.removeItem(STORAGE_KEY)
}

export function getUnreadCount(): number {
  return getNotifications().filter(n => !n.read).length
}

export function formatTimeAgo(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString()
}

export function addGenerationNotification(title: string, wordCount: number): void {
  addNotification({
    title: 'Content Generated',
    message: `"${title}" (${wordCount} words) has been generated and saved to history.`,
    type: 'success',
    link: '/history',
  })
}

export function addWelcomeNotification(): void {
  const notifications = getNotifications()
  const hasWelcome = notifications.some(n => n.title === 'Welcome to Lexora AI')
  
 if (!hasWelcome) {
    addNotification({
      title: 'Welcome to Lexora AI',
      message: 'Start generating AI-powered content. Click "New Project" to begin!',
      type: 'info',
      link: '/generate',
    })
  }
}
