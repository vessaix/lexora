import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { GenerateModule } from './generate/generate.module'
import { HistoryModule } from './history/history.module'
import { AIModule } from './ai/ai.module'
import { DashboardModule } from './dashboard/dashboard.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AIModule,
    GenerateModule,
    HistoryModule,
    DashboardModule,
  ],
})
export class AppModule {}
