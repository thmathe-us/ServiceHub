import { Controller, Get, Param, UseGuards, Query } from '@nestjs/common';
import { LogsService } from './logs.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('logs')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Get()
  @Roles('ADMIN')
  async findAll(
    @Query('search') search?: string,
    @Query('action') action?: string
  ) {
    return this.logsService.findAll(search, action);
  }

  @Get('user/:userId')
  @Roles('ADMIN')
  async findByUser(@Param('userId') userId: string) {
    return this.logsService.findByUser(userId);
  }

  @Get('entity/:entity')
  @Roles('ADMIN')
  async findByEntity(@Param('entity') entity: string, @Query('entityId') entityId?: string) {
    return this.logsService.findByEntity(entity, entityId);
  }
}