import { Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import { HotspotModule } from '../hotspot/hotspot.module';
import { AirQualityModule } from '../air-quality/air-quality.module';

@Module({
  imports: [HotspotModule, AirQualityModule],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}
