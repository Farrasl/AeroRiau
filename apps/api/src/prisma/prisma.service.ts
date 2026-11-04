import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Connected to PostgreSQL PostGIS database');
      
      // Ensure PostGIS extension is available
      await this.$executeRawUnsafe(`CREATE EXTENSION IF NOT EXISTS postgis;`).catch((err) => {
        this.logger.warn(`Notice on PostGIS check: ${err.message}`);
      });
    } catch (error) {
      this.logger.warn(`Prisma connection skipped or deferred: ${error.message}`);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
