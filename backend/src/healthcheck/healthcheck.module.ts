import { Module } from '@nestjs/common';
import { HealthcheckService } from './healthcheck.service';
import { HealthcheckController } from './healthcheck.controller';
import { ServicesModule } from '../services/services.module';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [ServicesModule],
  controllers: [HealthcheckController],
  providers: [HealthcheckService, PrismaService],
  exports: [HealthcheckService],
})
export class HealthcheckModule {}