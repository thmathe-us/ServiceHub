import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [],
  controllers: [UsersController],
  providers: [UsersService, PrismaService],
  exports: [UsersService, PrismaService], // Adicionado PrismaService às exports
})
export class UsersModule {}