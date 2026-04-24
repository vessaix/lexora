import { Controller, Get, Post, Delete, Body, Param, Query, HttpException, HttpStatus } from '@nestjs/common'
import { HistoryService } from './history.service'
import { HistoryEntry } from './history-entry.interface'

@Controller('api/history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Get()
  async findAll(@Query('limit') limit?: string) {
    const entries = await this.historyService.findAll(limit ? parseInt(limit) : 50)
    return {
      success: true,
      data: entries,
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const entry = await this.historyService.findOne(id)
    if (!entry) {
      throw new HttpException('Entry not found', HttpStatus.NOT_FOUND)
    }
    return {
      success: true,
      data: entry,
    }
  }

  @Post()
  async create(@Body() entry: Omit<HistoryEntry, 'id' | 'createdAt'>) {
    const newEntry = await this.historyService.create(entry)
    return {
      success: true,
      data: newEntry,
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const deleted = await this.historyService.delete(id)
    if (!deleted) {
      throw new HttpException('Entry not found', HttpStatus.NOT_FOUND)
    }
    return {
      success: true,
      message: 'Entry deleted',
    }
  }
}
