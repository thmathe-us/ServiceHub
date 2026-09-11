import { Controller, Post, Body, Get, UseGuards, Request, HttpCode, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Public } from './public.decorator';
import { RefreshTokenGuard } from './refresh-token.guard';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Request() req) {
    const user = req.user;
    
    // Log login attempt
    await this.usersService.logActivity(
      user.id,
      'LOGIN',
      'User',
      user.id,
      { ipAddress: req.ip, userAgent: req.headers['user-agent'] }
    );

    return this.authService.login(user);
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Request() req) {
    const refreshToken = req.body.refreshToken || req.headers['x-refresh-token'];
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token missing');
    }
    return this.authService.refreshToken(refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Request() req) {
    const refreshToken = req.headers['x-refresh-token'];
    await this.authService.logout(req.user.sub, refreshToken);
    
    // Log logout activity
    await this.usersService.logActivity(
      req.user.sub,
      'LOGOUT',
      'User',
      req.user.sub,
      { ipAddress: req.ip, userAgent: req.headers['user-agent'] }
    );

    return { message: 'Logout successful' };
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  async changePassword(@Request() req, @Body() changePasswordDto: { currentPassword: string, newPassword: string }) {
    await this.authService.changePassword(req.user.sub, changePasswordDto.currentPassword, changePasswordDto.newPassword);
    
    // Log password change activity
    await this.usersService.logActivity(
      req.user.sub,
      'PASSWORD_CHANGE',
      'User',
      req.user.sub,
      { ipAddress: req.ip, userAgent: req.headers['user-agent'] }
    );

    return { message: 'Password changed successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return {
      id: req.user.sub,
      username: req.user.username,
      email: req.user.email,
      name: req.user.name,
      lastName: req.user.lastName,
      role: req.user.role,
      isActive: req.user.isActive,
      twoFactorEnabled: req.user.twoFactorEnabled,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('check-first-login')
  async checkFirstLogin(@Request() req) {
    const isFirstLogin = await this.authService.isFirstLogin(req.user.sub);
    return { isFirstLogin };
  }
}