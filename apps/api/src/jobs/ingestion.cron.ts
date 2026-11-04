import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { HotspotService } from '../modules/hotspot/hotspot.service';
import { AirQualityService } from '../modules/air-quality/air-quality.service';

@Injectable()
export class IngestionCronService {
  private readonly logger = new Logger(IngestionCronService.name);

  constructor(
    private readonly hotspotService: HotspotService,
    private readonly airQualityService: AirQualityService,
  ) {}

  /**
   * Run every 30 minutes to fetch latest hotspots
   */
  @Cron(CronExpression.EVERY_30_MINUTES)
  async handleHotspotIngestion() {
    this.logger.log('Starting automated cron ingestion for NASA FIRMS hotspots...');
    try {
      const result = await this.hotspotService.syncHotspotsFromFirms();
      this.logger.log(`Hotspot cron completed: Ingested ${result.count} records from ${result.source}`);
    } catch (err: any) {
      this.logger.error(`Error during hotspot cron ingestion: ${err.message}`);
    }
  }

  /**
   * Run every 15 minutes to refresh Air Quality & Wind readings
   */
  @Cron('0 */15 * * * *')
  async handleAirQualityIngestion() {
    this.logger.log('Starting automated cron ingestion for Air Quality & Wind...');
    try {
      const stations = await this.airQualityService.getLatestStationsData();
      this.logger.log(`Air quality cron completed: Updated ${stations.length} stations in Riau.`);
    } catch (err: any) {
      this.logger.error(`Error during air quality cron ingestion: ${err.message}`);
    }
  }
}
