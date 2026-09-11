import { Module } from '@nestjs/common';
import { ConfigsService } from './configs.service';
import { ConfigsController } from './configs.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [],
  controllers: [ConfigsController],
  providers: [ConfigsService, PrismaService],
  exports: [ConfigsService],
})
export class ConfigsModule {}