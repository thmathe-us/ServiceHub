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
exports.LogsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let LogsService = class LogsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createLog(logData) {
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
    async findAll(search, action) {
        const where = {};
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
    async findByUser(userId) {
        return this.prisma.auditLog.findMany({
            where: { userId },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    async findByEntity(entity, entityId) {
        const where = { entity };
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
};
exports.LogsService = LogsService;
exports.LogsService = LogsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LogsService);
//# sourceMappingURL=logs.service.js.map