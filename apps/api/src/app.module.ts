import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from './prisma/prisma.module';
import { HotspotModule } from './modules/hotspot/hotspot.module';
import { AirQualityModule } from './modules/air-quality/air-quality.module';
import { PeatlandModule } from './modules/peatland/peatland.module';
import { StatsModule } from './modules/stats/stats.module';
import { IngestionCronService } from './jobs/ingestion.cron';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    ScheduleModule.forRoot(),
    PrismaModule,
    HotspotModule,
    AirQualityModule,
    PeatlandModule,
    StatsModule,
  ],
  providers: [IngestionCronService],
})
export class AppModule {}
