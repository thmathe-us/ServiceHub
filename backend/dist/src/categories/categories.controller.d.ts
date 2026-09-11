import { CategoriesService, CategoryCreateDto, CategoryUpdateDto } from './categories.service';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
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
    create(createCategoryDto: CategoryCreateDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        icon: string | null;
        color: string | null;
    }>;
    update(id: string, updateCategoryDto: CategoryUpdateDto): Promise<{
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
