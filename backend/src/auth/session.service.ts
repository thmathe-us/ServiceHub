import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SessionService {
  constructor(private prisma: PrismaService) {}

  async createSession(userId: string, refreshToken: string) {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    return this.prisma.session.create({
      data: {
        userId,
        refreshToken,
        expiresAt,
      },
    });
  }

  async validateSession(refreshToken: string) {
    const session = await this.prisma.session.findUnique({
      where: { refreshToken },
    });

    if (!session) {
      return null;
    }

    if (session.expiresAt < new Date()) {
      // Session expired, delete it
      await this.prisma.session.delete({
        where: { refreshToken },
      });
      return null;
    }

    return session;
  }

  async updateSession(oldRefreshToken: string, newRefreshToken: string) {
    const session = await this.prisma.session.findUnique({
      where: { refreshToken: oldRefreshToken },
    });

    if (!session) {
      throw new UnauthorizedException('Session not found');
    }

    if (session.expiresAt < new Date()) {
      throw new UnauthorizedException('Session expired');
    }

    // Update existing session with new refresh token
    return this.prisma.session.update({
      where: { id: session.id },
      data: { refreshToken: newRefreshToken },
    });
  }

  async removeSession(refreshToken: string) {
    return this.prisma.session.delete({
      where: { refreshToken },
    });
  }

  async invalidateUserSessions(userId: string) {
    return this.prisma.session.deleteMany({
      where: { userId },
    });
  }
}