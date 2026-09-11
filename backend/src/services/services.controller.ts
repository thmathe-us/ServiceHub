import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request, HttpCode, HttpStatus, NotFoundException } from '@nestjs/common';
import { ServicesService, ServiceCreateDto, ServiceUpdateDto } from './services.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('services')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  @Roles('ADMIN', 'OPERATOR', 'READER')
  async findAll() {
    return this.servicesService.findAll();
  }

  @Get('favorites')
  @Roles('ADMIN', 'OPERATOR', 'READER')
  async findFavorites() {
    return this.servicesService.findFavorites();
  }

  @Get('category/:category')
  @Roles('ADMIN', 'OPERATOR', 'READER')
  async findAllByCategory(@Param('category') category: string) {
    return this.servicesService.findAllByCategory(category);
  }

  @Get(':id')
  @Roles('ADMIN', 'OPERATOR', 'READER')
  async findById(@Param('id') id: string) {
    const service = await this.servicesService.findById(id);
    if (!service) {
      throw new NotFoundException('Service not found');
    }
    return service;
  }

  @Post()
  @Roles('ADMIN', 'OPERATOR')
  async create(@Body() createServiceDto: ServiceCreateDto, @Request() req) {
    createServiceDto.createdBy = req.user.userId;
    return this.servicesService.create(createServiceDto);
  }

  @Put(':id')
  @Roles('ADMIN', 'OPERATOR')
  async update(@Param('id') id: string, @Body() updateServiceDto: ServiceUpdateDto) {
    return this.servicesService.update(id, updateServiceDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  async remove(@Param('id') id: string) {
    return this.servicesService.remove(id);
  }

  @Get('search')
  @Roles('ADMIN', 'OPERATOR', 'READER')
  async search(@Query('q') query: string) {
    return this.servicesService.search(query);
  }
}