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
exports.ServicesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ServicesService = class ServicesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
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
    async findAllByCategory(category) {
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
    async findById(id) {
        return this.prisma.service.findUnique({
            where: { id },
            include: {
                categoryObj: true,
            },
        });
    }
    async create(serviceData) {
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
    async update(id, serviceData) {
        const service = await this.prisma.service.findUnique({
            where: { id },
        });
        if (!service) {
            throw new common_1.NotFoundException('Service not found');
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
    async remove(id) {
        const service = await this.prisma.service.findUnique({
            where: { id },
        });
        if (!service) {
            throw new common_1.NotFoundException('Service not found');
        }
        await this.prisma.service.delete({
            where: { id },
        });
        return { message: 'Service removed successfully' };
    }
    async updateStatus(id, status, responseTime, lastError) {
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
    async search(query) {
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
};
exports.ServicesService = ServicesService;
exports.ServicesService = ServicesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ServicesService);
//# sourceMappingURL=services.service.js.map