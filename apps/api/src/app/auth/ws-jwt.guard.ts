import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext) {
    try {
      const request = context.switchToHttp().getRequest();
      const authToken = request.headers?.authorization?.replace('Bearer ', '');

      const isAuth = await this.authService.verify(authToken);

      if (isAuth) {
        const user = await this.authService.decode(authToken);
        context.switchToWs().getClient().data.user = user;

        return true;
      }

      return false;
    } catch {
      return false;
    }
  }
}
