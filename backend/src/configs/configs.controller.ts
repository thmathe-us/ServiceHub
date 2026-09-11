import { Controller, Get, Put, Body, Param, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ConfigsService, ConfigUpdateDto } from './configs.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('configs')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ConfigsController {
  constructor(private readonly configsService: ConfigsService) {}

  @Get()
  @Roles('ADMIN', 'OPERATOR', 'READER')
  async findAll() {
    return this.configsService.findAll();
  }

  @Get('key/:key')
  @Roles('ADMIN', 'OPERATOR', 'READER')
  async findByKey(@Param('key') key: string) {
    const config = await this.configsService.findByKey(key);
    if (!config) {
      throw new Error('Configuration not found');
    }
    return config;
  }

  @Put('update')
  @Roles('ADMIN')
  async updateConfig(@Body() updateConfigDto: ConfigUpdateDto) {
    return this.configsService.updateConfig(updateConfigDto);
  }
}