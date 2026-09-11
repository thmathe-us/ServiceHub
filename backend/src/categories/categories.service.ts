import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CategoryCreateDto {
  name: string;
  description?: string;
  color?: string;
  icon?: string;
}

export interface CategoryUpdateDto {
  name?: string;
  description?: string;
  color?: string;
  icon?: string;
}

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.category.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findById(id: string) {
    return this.prisma.category.findUnique({
      where: { id },
    });
  }

  async create(categoryData: CategoryCreateDto) {
    // Check if category with name already exists
    const existingCategory = await this.prisma.category.findFirst({
      where: { name: categoryData.name },
    });

    if (existingCategory) {
      throw new BadRequestException('Category with this name already exists');
    }

    const category = await this.prisma.category.create({
      data: {
        name: categoryData.name,
        description: categoryData.description,
        color: categoryData.color || '#3b82f6',
        icon: categoryData.icon,
      },
    });

    return category;
  }

  async update(id: string, categoryData: CategoryUpdateDto) {
    const category = await this.findById(id);
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    // If name is being updated, check if it's already taken
    if (categoryData.name && categoryData.name !== category.name) {
      const existingCategory = await this.prisma.category.findFirst({
        where: { name: categoryData.name },
      });

      if (existingCategory) {
        throw new BadRequestException('Category with this name already exists');
      }
    }

    const updatedCategory = await this.prisma.category.update({
      where: { id },
      data: {
        ...(categoryData.name && { name: categoryData.name }),
        ...(categoryData.description && { description: categoryData.description }),
        ...(categoryData.color && { color: categoryData.color }),
        ...(categoryData.icon && { icon: categoryData.icon }),
      },
    });

    return updatedCategory;
  }

  async remove(id: string) {
    const category = await this.findById(id);
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    await this.prisma.category.delete({
      where: { id },
    });

    return { message: 'Category removed successfully' };
  }
}