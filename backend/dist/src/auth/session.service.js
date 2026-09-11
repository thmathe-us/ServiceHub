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
exports.SessionService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let SessionService = class SessionService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createSession(userId, refreshToken) {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);
        return this.prisma.session.create({
            data: {
                userId,
                refreshToken,
                expiresAt,
            },
        });
    }
    async validateSession(refreshToken) {
        const session = await this.prisma.session.findUnique({
            where: { refreshToken },
        });
        if (!session) {
            return null;
        }
        if (session.expiresAt < new Date()) {
            await this.prisma.session.delete({
                where: { refreshToken },
            });
            return null;
        }
        return session;
    }
    async updateSession(oldRefreshToken, newRefreshToken) {
        const session = await this.prisma.session.findUnique({
            where: { refreshToken: oldRefreshToken },
        });
        if (!session) {
            throw new common_1.UnauthorizedException('Session not found');
        }
        if (session.expiresAt < new Date()) {
            throw new common_1.UnauthorizedException('Session expired');
        }
        return this.prisma.session.update({
            where: { id: session.id },
            data: { refreshToken: newRefreshToken },
        });
    }
    async removeSession(refreshToken) {
        return this.prisma.session.delete({
            where: { refreshToken },
        });
    }
    async invalidateUserSessions(userId) {
        return this.prisma.session.deleteMany({
            where: { userId },
        });
    }
};
exports.SessionService = SessionService;
exports.SessionService = SessionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SessionService);
//# sourceMappingURL=session.service.js.map