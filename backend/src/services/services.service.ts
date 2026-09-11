import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
export interface ServiceCreateDto {
  name: string;
  description?: string;
  url: string;
  username?: string;
  password?: string;
  token?: string;
  icon?: string;
  category: string;
  tags?: string[];
  color?: string;
  checkType: 'HTTP' | 'HTTPS' | 'HEAD' | 'ICMP';
  checkInterval: number;
  isFavorite?: boolean;
  createdBy: string;
}

export interface ServiceUpdateDto {
  name?: string;
  description?: string;
  url?: string;
  username?: string;
  password?: string;
  token?: string;
  icon?: string;
  category?: string;
  tags?: string[];
  color?: string;
  checkType?: 'HTTP' | 'HTTPS' | 'HEAD' | 'ICMP';
  checkInterval?: number;
  isFavorite?: boolean;
  isActive?: boolean;
}

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.service.findMany({
      include: {
        categoryObj: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findAllByCategory(category: string) {
    return this.prisma.service.findMany({
      where: { category },
      include: {
        categoryObj: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findFavorites() {
    return this.prisma.service.findMany({
      where: { isFavorite: true },
      include: {
        categoryObj: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findById(id: string) {
    return this.prisma.service.findUnique({
      where: { id },
      include: {
        categoryObj: true,
      },
    });
  }

  async create(serviceData: ServiceCreateDto) {
    const service = await this.prisma.service.create({
      data: {
        name: serviceData.name,
        description: serviceData.description,
        url: serviceData.url,
        username: serviceData.username,
        password: serviceData.password,
        token: serviceData.token,
        icon: serviceData.icon,
        category: serviceData.category,
        tags: serviceData.tags || [],
        color: serviceData.color || '#3b82f6',
        checkType: serviceData.checkType,
        checkInterval: serviceData.checkInterval,
        isFavorite: serviceData.isFavorite || false,
        createdBy: serviceData.createdBy,
      },
    });

    return service;
  }

  async update(id: string, serviceData: ServiceUpdateDto) {
    const service = await this.prisma.service.findUnique({
      where: { id },
    });
    
    if (!service) {
      throw new NotFoundException('Service not found');
    }

    const updatedService = await this.prisma.service.update({
      where: { id },
      data: {
        ...(serviceData.name && { name: serviceData.name }),
        ...(serviceData.description && { description: serviceData.description }),
        ...(serviceData.url && { url: serviceData.url }),
        ...(serviceData.username !== undefined && { username: serviceData.username }),
        ...(serviceData.password !== undefined && { password: serviceData.password }),
        ...(serviceData.token !== undefined && { token: serviceData.token }),
        ...(serviceData.icon && { icon: serviceData.icon }),
        ...(serviceData.category && { category: serviceData.category }),
        ...(serviceData.tags && { tags: serviceData.tags }),
        ...(serviceData.color && { color: serviceData.color }),
        ...(serviceData.checkType && { checkType: serviceData.checkType }),
        ...(serviceData.checkInterval && { checkInterval: serviceData.checkInterval }),
        ...(typeof serviceData.isFavorite !== 'undefined' && { isFavorite: serviceData.isFavorite }),
        ...(typeof serviceData.isActive !== 'undefined' && { isActive: serviceData.isActive }),
      },
    });

    return updatedService;
  }

  async remove(id: string) {
    const service = await this.prisma.service.findUnique({
      where: { id },
    });
    
    if (!service) {
      throw new NotFoundException('Service not found');
    }

    await this.prisma.service.delete({
      where: { id },
    });

    return { message: 'Service removed successfully' };
  }

  async updateStatus(id: string, status: 'ONLINE' | 'OFFLINE' | 'UNAVAILABLE', responseTime?: number, lastError?: string) {
    return this.prisma.service.update({
      where: { id },
      data: {
        status,
        responseTime,
        lastError: lastError || null,
        lastCheck: new Date(),
      },
    });
  }

  async search(query: string) {
    return this.prisma.service.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { url: { contains: query, mode: 'insensitive' } },
          { category: { contains: query, mode: 'insensitive' } },
          { tags: { has: query } },
        ],
      },
    });
  }
}