import { Injectable } from '@nestjs/common'
import { HistoryService } from '../history/history.service'

@Injectable()
export class DashboardService {
  constructor(private readonly historyService: HistoryService) {}

  async getDashboardData() {
    const entries = await this.historyService.findAll(1000)
    
    const totalGenerations = entries.length
    const totalWords = entries.reduce((sum, e) => sum + (e.wordCount || 0), 0)
    // Rough estimate: 1 word ≈ 1.5 tokens
    const totalTokens = Math.round(totalWords * 1.5)
    const monthlyLimit = 100000 // 100k tokens monthly limit
    const tokenUsagePercent = Math.min(Math.round((totalTokens / monthlyLimit) * 100), 100)
    
    // Provider breakdown
    const providerStats = this.getProviderStats(entries)
    
    // Content type breakdown
    const contentTypeStats = this.getContentTypeStats(entries)
    
    // Weekly activity (last 7 days)
    const weeklyActivity = this.getWeeklyActivity(entries)
    
    // Recent activity (last 5)
    const recentActivity = entries.slice(0, 5).map(entry => ({
      id: entry.id,
      title: entry.title,
      type: entry.contentType,
      provider: entry.provider,
      wordCount: entry.wordCount,
      createdAt: entry.createdAt,
    }))

    return {
      stats: {
        totalGenerations,
        totalTokens,
        tokenUsagePercent,
        monthlyLimit,
        totalWords,
        providerStats,
        contentTypeStats,
      },
      weeklyActivity,
      recentActivity,
    }
  }

  private getProviderStats(entries: any[]) {
    const stats: Record<string, number> = {}
    entries.forEach(entry => {
      stats[entry.provider] = (stats[entry.provider] || 0) + 1
    })
    return Object.entries(stats).map(([name, count]) => ({ name, count }))
  }

  private getContentTypeStats(entries: any[]) {
    const stats: Record<string, number> = {}
    entries.forEach(entry => {
      stats[entry.contentType] = (stats[entry.contentType] || 0) + 1
    })
    return Object.entries(stats).map(([name, count]) => ({ name, count }))
  }

  private getWeeklyActivity(entries: any[]) {
    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
    const today = new Date()
    const weekData: Record<string, number> = {}
    
    // Initialize last 7 days with 0
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dayName = days[date.getDay()]
      weekData[dayName] = 0
    }
    
    // Count entries per day
    entries.forEach(entry => {
      const entryDate = new Date(entry.createdAt)
      const dayDiff = Math.floor((today.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24))
      if (dayDiff >= 0 && dayDiff < 7) {
        const dayName = days[entryDate.getDay()]
        weekData[dayName] = (weekData[dayName] || 0) + 1
      }
    })
    
    return Object.entries(weekData).map(([day, count]) => ({
      day,
      count,
    }))
  }
}
