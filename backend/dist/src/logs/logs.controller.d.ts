import { LogsService } from './logs.service';
export declare class LogsController {
    private readonly logsService;
    constructor(logsService: LogsService);
    findAll(search?: string, action?: string): Promise<({
        user: {
            id: string;
            name: string;
            username: string;
        };
    } & {
        id: string;
        createdAt: Date;
        action: string;
        entity: string;
        entityId: string | null;
        details: import("@prisma/client/runtime/library").JsonValue | null;
        ipAddress: string | null;
        userAgent: string | null;
        userId: string | null;
        serviceId: string | null;
    })[]>;
    findByUser(userId: string): Promise<{
        id: string;
        createdAt: Date;
        action: string;
        entity: string;
        entityId: string | null;
        details: import("@prisma/client/runtime/library").JsonValue | null;
        ipAddress: string | null;
        userAgent: string | null;
        userId: string | null;
        serviceId: string | null;
    }[]>;
    findByEntity(entity: string, entityId?: string): Promise<{
        id: string;
        createdAt: Date;
        action: string;
        entity: string;
        entityId: string | null;
        details: import("@prisma/client/runtime/library").JsonValue | null;
        ipAddress: string | null;
        userAgent: string | null;
        userId: string | null;
        serviceId: string | null;
    }[]>;
}
