import { Controller, Get, Query } from '@nestjs/common';
import { AirQualityService } from './air-quality.service';

@Controller('air-quality')
export class AirQualityController {
  constructor(private readonly airQualityService: AirQualityService) {}

  @Get('stations')
  async getStations(@Query('refresh') refresh?: string) {
    const isRefresh = refresh === 'true' || refresh === '1';
    return this.airQualityService.getLatestStationsData(isRefresh);
  }
}
