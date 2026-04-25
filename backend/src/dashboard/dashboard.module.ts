import { Module } from '@nestjs/common'
import { DashboardController } from './dashboard.controller'
import { DashboardService } from './dashboard.service'
import { HistoryModule } from '../history/history.module'

@Module({
  imports: [HistoryModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
