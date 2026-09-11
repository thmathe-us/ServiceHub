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
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CategoriesService = class CategoriesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        return this.prisma.category.findMany({
            orderBy: {
                name: 'asc',
            },
        });
    }
    async findById(id) {
        return this.prisma.category.findUnique({
            where: { id },
        });
    }
    async create(categoryData) {
        const existingCategory = await this.prisma.category.findFirst({
            where: { name: categoryData.name },
        });
        if (existingCategory) {
            throw new common_1.BadRequestException('Category with this name already exists');
        }
        const category = await this.prisma.category.create({
            data: {
                name: categoryData.name,
                description: categoryData.description,
                color: categoryData.color || '#3b82f6',
                icon: categoryData.icon,
            },
        });
        return category;
    }
    async update(id, categoryData) {
        const category = await this.findById(id);
        if (!category) {
            throw new common_1.NotFoundException('Category not found');
        }
        if (categoryData.name && categoryData.name !== category.name) {
            const existingCategory = await this.prisma.category.findFirst({
                where: { name: categoryData.name },
            });
            if (existingCategory) {
                throw new common_1.BadRequestException('Category with this name already exists');
            }
        }
        const updatedCategory = await this.prisma.category.update({
            where: { id },
            data: {
                ...(categoryData.name && { name: categoryData.name }),
                ...(categoryData.description && { description: categoryData.description }),
                ...(categoryData.color && { color: categoryData.color }),
                ...(categoryData.icon && { icon: categoryData.icon }),
            },
        });
        return updatedCategory;
    }
    async remove(id) {
        const category = await this.findById(id);
        if (!category) {
            throw new common_1.NotFoundException('Category not found');
        }
        await this.prisma.category.delete({
            where: { id },
        });
        return { message: 'Category removed successfully' };
    }
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CategoriesService);
//# sourceMappingURL=categories.service.js.map