import { PrismaService } from '../prisma/prisma.service';
export interface UserCreateDto {
    username: string;
    email: string;
    name: string;
    lastName: string;
    password: string;
    role: 'ADMIN' | 'OPERATOR' | 'READER';
    isActive?: boolean;
}
export interface UserUpdateDto {
    name?: string;
    lastName?: string;
    email?: string;
    avatarUrl?: string;
    twoFactorEnabled?: boolean;
    isActive?: boolean;
    role?: 'ADMIN' | 'OPERATOR' | 'READER';
    password?: string;
}
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: string;
        name: string;
        lastName: string;
        email: string;
        username: string;
        role: import(".prisma/client").$Enums.Role;
        avatarUrl: string;
        twoFactorEnabled: boolean;
        createdAt: Date;
        isActive: boolean;
    }[]>;
    findByUsername(username: string): Promise<{
        id: string;
        name: string;
        lastName: string;
        email: string;
        username: string;
        password: string;
        role: import(".prisma/client").$Enums.Role;
        avatarUrl: string | null;
        twoFactorEnabled: boolean;
        twoFactorSecret: string | null;
        createdAt: Date;
        updatedAt: Date;
        lastLogin: Date | null;
        isActive: boolean;
    }>;
    findById(id: string): Promise<{
        id: string;
        name: string;
        lastName: string;
        email: string;
        username: string;
        password: string;
        role: import(".prisma/client").$Enums.Role;
        avatarUrl: string | null;
        twoFactorEnabled: boolean;
        twoFactorSecret: string | null;
        createdAt: Date;
        updatedAt: Date;
        lastLogin: Date | null;
        isActive: boolean;
    }>;
    create(userData: UserCreateDto): Promise<{
        id: string;
        name: string;
        lastName: string;
        email: string;
        username: string;
        role: import(".prisma/client").$Enums.Role;
        avatarUrl: string;
        twoFactorEnabled: boolean;
        createdAt: Date;
        isActive: boolean;
    }>;
    remove(id: string): Promise<void>;
    update(id: string, userData: UserUpdateDto): Promise<{
        id: string;
        name: string;
        lastName: string;
        email: string;
        username: string;
        role: import(".prisma/client").$Enums.Role;
        avatarUrl: string;
        twoFactorEnabled: boolean;
        createdAt: Date;
        isActive: boolean;
    }>;
    updatePassword(id: string, newPassword: string): Promise<{
        id: string;
        name: string;
        lastName: string;
        email: string;
        username: string;
        password: string;
        role: import(".prisma/client").$Enums.Role;
        avatarUrl: string | null;
        twoFactorEnabled: boolean;
        twoFactorSecret: string | null;
        createdAt: Date;
        updatedAt: Date;
        lastLogin: Date | null;
        isActive: boolean;
    }>;
    logActivity(userId: string, action: string, entity: string, entityId: string, details?: any): Promise<{
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
    toggleStatus(id: string, isActive: boolean): Promise<{
        id: string;
        name: string;
        lastName: string;
        email: string;
        username: string;
        role: import(".prisma/client").$Enums.Role;
        avatarUrl: string;
        twoFactorEnabled: boolean;
        createdAt: Date;
        isActive: boolean;
    }>;
}
