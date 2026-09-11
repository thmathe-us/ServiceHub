import { UsersService, UserCreateDto, UserUpdateDto } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
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
    findOne(id: string): Promise<{
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
    create(createUserDto: UserCreateDto): Promise<{
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
    update(id: string, updateUserDto: UserUpdateDto): Promise<{
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
    remove(id: string): Promise<{
        message: string;
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
