import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, HttpCode, HttpStatus, NotFoundException } from '@nestjs/common';
import { UsersService, UserCreateDto, UserUpdateDto } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles('ADMIN')
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @Post()
  @Roles('ADMIN')
  async create(@Body() createUserDto: UserCreateDto) {
    return this.usersService.create(createUserDto);
  }

  @Put(':id')
  @Roles('ADMIN')
  async update(@Param('id') id: string, @Body() updateUserDto: UserUpdateDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  async remove(@Param('id') id: string) {
    const user = await this.usersService.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    await this.usersService.remove(id);
    return { message: 'User removed successfully' };
  }

  @Put(':id/status')
  @Roles('ADMIN')
  async toggleStatus(@Param('id') id: string, @Body('isActive') isActive: boolean) {
    return this.usersService.toggleStatus(id, isActive);
  }
}
