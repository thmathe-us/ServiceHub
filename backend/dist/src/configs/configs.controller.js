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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigsController = void 0;
const common_1 = require("@nestjs/common");
const configs_service_1 = require("./configs.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const roles_guard_1 = require("../auth/roles.guard");
let ConfigsController = class ConfigsController {
    constructor(configsService) {
        this.configsService = configsService;
    }
    async findAll() {
        return this.configsService.findAll();
    }
    async findByKey(key) {
        const config = await this.configsService.findByKey(key);
        if (!config) {
            throw new Error('Configuration not found');
        }
        return config;
    }
    async updateConfig(updateConfigDto) {
        return this.configsService.updateConfig(updateConfigDto);
    }
};
exports.ConfigsController = ConfigsController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('ADMIN', 'OPERATOR', 'READER'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ConfigsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('key/:key'),
    (0, roles_decorator_1.Roles)('ADMIN', 'OPERATOR', 'READER'),
    __param(0, (0, common_1.Param)('key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ConfigsController.prototype, "findByKey", null);
__decorate([
    (0, common_1.Put)('update'),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ConfigsController.prototype, "updateConfig", null);
exports.ConfigsController = ConfigsController = __decorate([
    (0, common_1.Controller)('configs'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [configs_service_1.ConfigsService])
], ConfigsController);
//# sourceMappingURL=configs.controller.js.map