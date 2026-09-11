import { PrismaService } from '../prisma/prisma.service';
export interface CategoryCreateDto {
    name: string;
    description?: string;
    color?: string;
    icon?: string;
}
export interface CategoryUpdateDto {
    name?: string;
    description?: string;
    color?: string;
    icon?: string;
}
export declare class CategoriesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        icon: string | null;
        color: string | null;
    }[]>;
    findById(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        icon: string | null;
        color: string | null;
    }>;
    create(categoryData: CategoryCreateDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        icon: string | null;
        color: string | null;
    }>;
    update(id: string, categoryData: CategoryUpdateDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        icon: string | null;
        color: string | null;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
