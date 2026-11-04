import { Module } from '@nestjs/common';
import { PeatlandService } from './peatland.service';
import { PeatlandController } from './peatland.controller';

@Module({
  controllers: [PeatlandController],
  providers: [PeatlandService],
  exports: [PeatlandService],
})
export class PeatlandModule {}
