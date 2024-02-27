import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) { }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const cookie = request.handshake.headers.cookie.split('token=')[1].split(';')[0];
      try {
        const decoded = await this.jwtService.verifyAsync(cookie);
        request.user = decoded;
        return true;
      } catch (err) {
      }
    }
    catch (err) {
    }
  }
}
