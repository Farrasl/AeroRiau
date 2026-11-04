import { Module } from '@nestjs/common';
import { HotspotService } from './hotspot.service';
import { HotspotController } from './hotspot.controller';

@Module({
  controllers: [HotspotController],
  providers: [HotspotService],
  exports: [HotspotService],
})
export class HotspotModule {}
