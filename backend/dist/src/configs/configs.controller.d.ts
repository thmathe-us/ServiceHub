import { ConfigsService, ConfigUpdateDto } from './configs.service';
export declare class ConfigsController {
    private readonly configsService;
    constructor(configsService: ConfigsService);
    findAll(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        key: string;
        value: import("@prisma/client/runtime/library").JsonValue;
    }[]>;
    findByKey(key: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        key: string;
        value: import("@prisma/client/runtime/library").JsonValue;
    }>;
    updateConfig(updateConfigDto: ConfigUpdateDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        key: string;
        value: import("@prisma/client/runtime/library").JsonValue;
    }>;
}
