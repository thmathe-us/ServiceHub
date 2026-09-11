import { PrismaService } from '../prisma/prisma.service';
export interface AuditLogCreateDto {
    userId?: string;
    action: string;
    entity: string;
    entityId?: string;
    details?: any;
    ipAddress?: string;
    userAgent?: string;
}
export declare class LogsService {
    private prisma;
    constructor(prisma: PrismaService);
    createLog(logData: AuditLogCreateDto): Promise<{
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
    }>;
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
