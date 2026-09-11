import { Injectable, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

export interface UserCreateDto {
  username: string;
  email: string;
  name: string;
  lastName: string;
  password: string;
  role: 'ADMIN' | 'OPERATOR' | 'READER';
  isActive?: boolean;
}

export interface UserUpdateDto {
  name?: string;
  lastName?: string;
  email?: string;
  avatarUrl?: string;
  twoFactorEnabled?: boolean;
  isActive?: boolean;
  role?: 'ADMIN' | 'OPERATOR' | 'READER';
  password?: string;
}

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        lastName: true,
        role: true,
        avatarUrl: true,
        twoFactorEnabled: true,
        isActive: true,
        createdAt: true,
      },
    });
  }

  async findByUsername(username: string) {
    return this.prisma.user.findUnique({
      where: { username },
    });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async create(userData: UserCreateDto) {
    // Check if user with username or email already exists
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { username: userData.username },
          { email: userData.email },
        ],
      },
    });

    if (existingUser) {
      throw new BadRequestException('Username or email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        username: userData.username,
        email: userData.email,
        name: userData.name,
        lastName: userData.lastName,
        password: hashedPassword,
        role: userData.role,
        isActive: userData.isActive ?? true,
      },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        lastName: true,
        role: true,
        avatarUrl: true,
        twoFactorEnabled: true,
        isActive: true,
        createdAt: true,
      },
    });

    return user;
  }

  async remove(id: string) {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.prisma.user.delete({ where: { id } });
  }

  async update(id: string, userData: UserUpdateDto) {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // If email is being updated, check if it's already taken
    if (userData.email && userData.email !== user.email) {
      const existingUser = await this.prisma.user.findFirst({
        where: { email: userData.email },
      });

      if (existingUser) {
        throw new BadRequestException('Email already exists');
      }
    }

    // Update user
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        ...(userData.name && { name: userData.name }),
        ...(userData.lastName && { lastName: userData.lastName }),
        ...(userData.email && { email: userData.email }),
        ...(userData.avatarUrl && { avatarUrl: userData.avatarUrl }),
        ...(typeof userData.twoFactorEnabled !== 'undefined' && { twoFactorEnabled: userData.twoFactorEnabled }),
        ...(typeof userData.isActive !== 'undefined' && { isActive: userData.isActive }),
        ...(userData.role && { role: userData.role }),
        ...(userData.password && { password: await bcrypt.hash(userData.password, 10) }),
      },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        lastName: true,
        role: true,
        avatarUrl: true,
        twoFactorEnabled: true,
        isActive: true,
        createdAt: true,
      },
    });

    return updatedUser;
  }

  async updatePassword(id: string, newPassword: string) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    return this.prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });
  }

  async logActivity(userId: string, action: string, entity: string, entityId: string, details: any = null) {
    return this.prisma.auditLog.create({
      data: {
        userId,
        action,
        entity,
        entityId,
        details: details ? JSON.stringify(details) : null,
      },
    });
  }

  async toggleStatus(id: string, isActive: boolean) {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: { isActive },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        lastName: true,
        role: true,
        avatarUrl: true,
        twoFactorEnabled: true,
        isActive: true,
        createdAt: true,
      },
    });

    return updatedUser;
  }
}
