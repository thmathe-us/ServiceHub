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
exports.ConfigsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ConfigsService = class ConfigsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        return this.prisma.systemConfig.findMany({
            orderBy: {
                key: 'asc',
            },
        });
    }
    async findById(id) {
        return this.prisma.systemConfig.findUnique({
            where: { id },
        });
    }
    async findByKey(key) {
        return this.prisma.systemConfig.findUnique({
            where: { key },
        });
    }
    async updateConfig(configData) {
        const config = await this.findByKey(configData.key);
        if (config) {
            return this.prisma.systemConfig.update({
                where: { key: configData.key },
                data: {
                    value: configData.value,
                    description: configData.description || config.description,
                },
            });
        }
        else {
            return this.prisma.systemConfig.create({
                data: {
                    key: configData.key,
                    value: configData.value,
                    description: configData.description,
                },
            });
        }
    }
    async remove(id) {
        const config = await this.findById(id);
        if (!config) {
            throw new common_1.NotFoundException('Configuration not found');
        }
        await this.prisma.systemConfig.delete({
            where: { id },
        });
        return { message: 'Configuration removed successfully' };
    }
};
exports.ConfigsService = ConfigsService;
exports.ConfigsService = ConfigsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ConfigsService);
//# sourceMappingURL=configs.service.js.map