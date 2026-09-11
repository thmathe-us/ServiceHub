import { PrismaService } from '../prisma/prisma.service';
export interface ConfigUpdateDto {
    key: string;
    value: any;
    description?: string;
}
export declare class ConfigsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        key: string;
        value: import("@prisma/client/runtime/library").JsonValue;
    }[]>;
    findById(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        key: string;
        value: import("@prisma/client/runtime/library").JsonValue;
    }>;
    findByKey(key: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        key: string;
        value: import("@prisma/client/runtime/library").JsonValue;
    }>;
    updateConfig(configData: ConfigUpdateDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        key: string;
        value: import("@prisma/client/runtime/library").JsonValue;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
