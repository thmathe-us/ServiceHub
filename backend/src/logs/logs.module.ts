import { Module } from '@nestjs/common';
import { LogsService } from './logs.service';
import { LogsController } from './logs.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [],
  controllers: [LogsController],
  providers: [LogsService, PrismaService],
  exports: [LogsService],
})
export class LogsModule {}