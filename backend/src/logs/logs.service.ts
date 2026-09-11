import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface AuditLogCreateDto {
  userId?: string;
  action: string;
  entity: string;
  entityId?: string;
  details?: any;
  ipAddress?: string;
  userAgent?: string;
}

@Injectable()
export class LogsService {
  constructor(private prisma: PrismaService) {}

  async createLog(logData: AuditLogCreateDto) {
    return this.prisma.auditLog.create({
      data: {
        userId: logData.userId,
        action: logData.action,
        entity: logData.entity,
        entityId: logData.entityId,
        details: logData.details ? JSON.stringify(logData.details) : null,
        ipAddress: logData.ipAddress,
        userAgent: logData.userAgent,
      },
    });
  }

  async findAll(search?: string, action?: string) {
    const where: any = {};

    if (search) {
      where.OR = [
        { action: { contains: search, mode: 'insensitive' } },
        { entity: { contains: search, mode: 'insensitive' } },
        { user: { username: { contains: search, mode: 'insensitive' } } },
        { user: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    if (action) {
      where.action = { contains: action, mode: 'insensitive' };
    }
    return this.prisma.auditLog.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByUser(userId: string) {
    return this.prisma.auditLog.findMany({
      where: { userId },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByEntity(entity: string, entityId?: string) {
    const where: any = { entity };
    if (entityId) {
      where.entityId = entityId;
    }

    return this.prisma.auditLog.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
