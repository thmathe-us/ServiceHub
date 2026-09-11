import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { SessionService } from './session.service';
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    private readonly sessionService;
    constructor(usersService: UsersService, jwtService: JwtService, sessionService: SessionService);
    validateUser(username: string, pass: string): Promise<any>;
    login(user: any): Promise<{
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
    refreshToken(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(userId: string, refreshToken: string): Promise<void>;
    changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void>;
    isFirstLogin(userId: string): Promise<boolean>;
}
