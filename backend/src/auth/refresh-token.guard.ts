import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class RefreshTokenGuard extends AuthGuard('jwt-refresh') {
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const refreshToken = request.body.refreshToken || request.headers['x-refresh-token'];
    
    if (!refreshToken) {
      return false;
    }

    // Set the refreshToken in the request body for the strategy to pick up
    if (!request.body.refreshToken && request.headers['x-refresh-token']) {
      request.body.refreshToken = request.headers['x-refresh-token'];
    }

    return super.canActivate(context) as Promise<boolean>;
  }
}