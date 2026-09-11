import { Injectable, OnModuleInit, OnModuleDestroy, Global, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Global()
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    try {
      this.logger.log('Attempting to connect to the database...');
      await this.$connect();
      this.logger.log('Successfully connected to the database');
    } catch (error) {
      this.logger.error('Failed to connect to the database:', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
      this.logger.log('Disconnected from the database');
    } catch (error) {
      this.logger.error('Error disconnecting from the database:', error);
      throw error;
    }
  }
}