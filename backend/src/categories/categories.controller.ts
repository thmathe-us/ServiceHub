import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { CategoriesService, CategoryCreateDto, CategoryUpdateDto } from './categories.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('categories')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @Roles('ADMIN', 'OPERATOR', 'READER')
  async findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  @Roles('ADMIN', 'OPERATOR', 'READER')
  async findById(@Param('id') id: string) {
    const category = await this.categoriesService.findById(id);
    if (!category) {
      throw new Error('Category not found');
    }
    return category;
  }

  @Post()
  @Roles('ADMIN', 'OPERATOR')
  async create(@Body() createCategoryDto: CategoryCreateDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Put(':id')
  @Roles('ADMIN', 'OPERATOR')
  async update(@Param('id') id: string, @Body() updateCategoryDto: CategoryUpdateDto) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  async remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}