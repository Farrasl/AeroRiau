import { Controller, Get, Post, Query } from '@nestjs/common';
import { HotspotService } from './hotspot.service';
import { HotspotFilterParams } from '@riau-gis/types';

@Controller('hotspots')
export class HotspotController {
  constructor(private readonly hotspotService: HotspotService) {}

  @Get()
  async getHotspots(@Query() query: HotspotFilterParams) {
    return this.hotspotService.getHotspotsGeoJson(query);
  }

  @Post('sync')
  async triggerSync() {
    return this.hotspotService.syncHotspotsFromFirms();
  }
}
