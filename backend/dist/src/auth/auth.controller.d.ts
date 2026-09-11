import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
export declare class AuthController {
    private readonly authService;
    private readonly usersService;
    constructor(authService: AuthService, usersService: UsersService);
    login(req: any): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: any;
            username: any;
            email: any;
            name: any;
            lastName: any;
            role: any;
            isActive: any;
            twoFactorEnabled: any;
        };
    }>;
    refreshToken(req: any): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(req: any): Promise<{
        message: string;
    }>;
    changePassword(req: any, changePasswordDto: {
        currentPassword: string;
        newPassword: string;
    }): Promise<{
        message: string;
    }>;
    getProfile(req: any): {
        id: any;
        username: any;
        email: any;
        name: any;
        lastName: any;
        role: any;
        isActive: any;
        twoFactorEnabled: any;
    };
    checkFirstLogin(req: any): Promise<{
        isFirstLogin: boolean;
    }>;
}
