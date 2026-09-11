"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = require("bcrypt");
let UsersService = class UsersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
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
    async findByUsername(username) {
        return this.prisma.user.findUnique({
            where: { username },
        });
    }
    async findById(id) {
        return this.prisma.user.findUnique({
            where: { id },
        });
    }
    async create(userData) {
        const existingUser = await this.prisma.user.findFirst({
            where: {
                OR: [
                    { username: userData.username },
                    { email: userData.email },
                ],
            },
        });
        if (existingUser) {
            throw new common_1.BadRequestException('Username or email already exists');
        }
        const hashedPassword = await bcrypt.hash(userData.password, 10);
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
    async remove(id) {
        const user = await this.findById(id);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        await this.prisma.user.delete({ where: { id } });
    }
    async update(id, userData) {
        const user = await this.findById(id);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (userData.email && userData.email !== user.email) {
            const existingUser = await this.prisma.user.findFirst({
                where: { email: userData.email },
            });
            if (existingUser) {
                throw new common_1.BadRequestException('Email already exists');
            }
        }
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
    async updatePassword(id, newPassword) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        return this.prisma.user.update({
            where: { id },
            data: { password: hashedPassword },
        });
    }
    async logActivity(userId, action, entity, entityId, details = null) {
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
    async toggleStatus(id, isActive) {
        const user = await this.findById(id);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
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
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map