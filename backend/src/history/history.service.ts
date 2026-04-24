import { Injectable } from '@nestjs/common'
import { v4 as uuidv4 } from 'uuid'
import { HistoryEntry } from './history-entry.interface'

@Injectable()
export class HistoryService {
  private entries: HistoryEntry[] = []

  async create(entry: Omit<HistoryEntry, 'id' | 'createdAt'>): Promise<HistoryEntry> {
    const newEntry: HistoryEntry = {
      ...entry,
      id: uuidv4(),
      createdAt: new Date(),
    }
    this.entries.unshift(newEntry)
    return newEntry
  }

  async findAll(limit: number = 50): Promise<HistoryEntry[]> {
    return this.entries.slice(0, limit)
  }

  async findOne(id: string): Promise<HistoryEntry | undefined> {
    return this.entries.find(entry => entry.id === id)
  }

  async delete(id: string): Promise<boolean> {
    const index = this.entries.findIndex(entry => entry.id === id)
    if (index === -1) return false
    this.entries.splice(index, 1)
    return true
  }
}
