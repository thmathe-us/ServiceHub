import { PrismaService } from '../prisma/prisma.service';
export declare class SessionService {
    private prisma;
    constructor(prisma: PrismaService);
    createSession(userId: string, refreshToken: string): Promise<{
        id: string;
        createdAt: Date;
        ipAddress: string | null;
        userAgent: string | null;
        userId: string;
        refreshToken: string;
        expiresAt: Date;
    }>;
    validateSession(refreshToken: string): Promise<{
        id: string;
        createdAt: Date;
        ipAddress: string | null;
        userAgent: string | null;
        userId: string;
        refreshToken: string;
        expiresAt: Date;
    }>;
    updateSession(oldRefreshToken: string, newRefreshToken: string): Promise<{
        id: string;
        createdAt: Date;
        ipAddress: string | null;
        userAgent: string | null;
        userId: string;
        refreshToken: string;
        expiresAt: Date;
    }>;
    removeSession(refreshToken: string): Promise<{
        id: string;
        createdAt: Date;
        ipAddress: string | null;
        userAgent: string | null;
        userId: string;
        refreshToken: string;
        expiresAt: Date;
    }>;
    invalidateUserSessions(userId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
