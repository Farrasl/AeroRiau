import { Module } from '@nestjs/common';
import { AirQualityService } from './air-quality.service';
import { AirQualityController } from './air-quality.controller';

@Module({
  controllers: [AirQualityController],
  providers: [AirQualityService],
  exports: [AirQualityService],
})
export class AirQualityModule {}
