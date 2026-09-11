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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
const bcrypt = require("bcrypt");
const session_service_1 = require("./session.service");
let AuthService = class AuthService {
    constructor(usersService, jwtService, sessionService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.sessionService = sessionService;
    }
    async validateUser(username, pass) {
        const user = await this.usersService.findByUsername(username);
        if (user && await bcrypt.compare(pass, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }
    async login(user) {
        const payload = { username: user.username, sub: user.id, role: user.role };
        const accessToken = this.jwtService.sign(payload);
        const refreshToken = this.jwtService.sign(payload, { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '7d' });
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
    async refreshToken(refreshToken) {
        try {
            const payload = this.jwtService.verify(refreshToken, { secret: process.env.JWT_REFRESH_SECRET });
            const session = await this.sessionService.validateSession(refreshToken);
            if (!session) {
                throw new common_1.UnauthorizedException('Refresh token expired or invalid');
            }
            const user = await this.usersService.findById(payload.sub);
            if (!user || !user.isActive) {
                throw new common_1.UnauthorizedException('User not found or inactive');
            }
            const newPayload = { username: user.username, sub: user.id, role: user.role };
            const newAccessToken = this.jwtService.sign(newPayload);
            const newRefreshToken = this.jwtService.sign(newPayload, { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '7d' });
            await this.sessionService.updateSession(refreshToken, newRefreshToken);
            return {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
            };
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
    }
    async logout(userId, refreshToken) {
        if (refreshToken) {
            await this.sessionService.removeSession(refreshToken);
        }
    }
    async changePassword(userId, currentPassword, newPassword) {
        const user = await this.usersService.findById(userId);
        if (!user) {
            throw new common_1.BadRequestException('User not found');
        }
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Current password is incorrect');
        }
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        await this.usersService.updatePassword(userId, hashedNewPassword);
    }
    async isFirstLogin(userId) {
        const user = await this.usersService.findById(userId);
        if (!user) {
            throw new common_1.BadRequestException('User not found');
        }
        if (user.username === 'admin' && user.role === 'ADMIN') {
            const isDefaultPassword = await bcrypt.compare('admin', user.password);
            return isDefaultPassword;
        }
        return false;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        session_service_1.SessionService])
], AuthService);
//# sourceMappingURL=auth.service.js.map