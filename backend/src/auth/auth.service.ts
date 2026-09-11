import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { SessionService } from './session.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly sessionService: SessionService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);
    if (user && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id, role: user.role };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '7d' });

    // Create session
    await this.sessionService.createSession(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        lastName: user.lastName,
        role: user.role,
        isActive: user.isActive,
        twoFactorEnabled: user.twoFactorEnabled,
      },
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, { secret: process.env.JWT_REFRESH_SECRET });
      const session = await this.sessionService.validateSession(refreshToken);

      if (!session) {
        throw new UnauthorizedException('Refresh token expired or invalid');
      }

      const user = await this.usersService.findById(payload.sub);
      if (!user || !user.isActive) {
        throw new UnauthorizedException('User not found or inactive');
      }

      const newPayload = { username: user.username, sub: user.id, role: user.role };
      const newAccessToken = this.jwtService.sign(newPayload);
      const newRefreshToken = this.jwtService.sign(newPayload, { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '7d' });

      // Update session
      await this.sessionService.updateSession(refreshToken, newRefreshToken);

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string, refreshToken: string) {
    // Remove session
    if (refreshToken) {
      await this.sessionService.removeSession(refreshToken);
    }
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await this.usersService.updatePassword(userId, hashedNewPassword);
  }

  async isFirstLogin(userId: string): Promise<boolean> {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Check if user is admin and has the default password
    if (user.username === 'admin' && user.role === 'ADMIN') {
      // For admin user, we consider it first login if they haven't changed password
      // We'll check by attempting to compare with the known default hash
      const isDefaultPassword = await bcrypt.compare('admin', user.password);
      return isDefaultPassword;
    }

    return false;
  }
}