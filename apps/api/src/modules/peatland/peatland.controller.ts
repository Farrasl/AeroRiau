import { Controller, Get } from '@nestjs/common';
import { PeatlandService } from './peatland.service';

@Controller('peatlands')
export class PeatlandController {
  constructor(private readonly peatlandService: PeatlandService) {}

  @Get()
  getPeatlands() {
    return this.peatlandService.getPeatlandGeoJson();
  }
}
