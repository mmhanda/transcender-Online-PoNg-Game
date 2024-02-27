import { th } from '@faker-js/faker';
import { Injectable, CanActivate, ExecutionContext, HttpException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from 'src/redis/redis.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService, private readonly rediService: RedisService, private readonly userServices: UsersService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
  const request = context.switchToHttp().getRequest();
    if (!request.cookies.token) {
      throw new HttpException('You are not authorized1', 230);
    }
    const cookie = request.cookies.token;
    if (await this.rediService.isJwtBlacklisted(`blacklist:${cookie}`)) {
      throw new HttpException('You are not authorized2', 230);
    }
    const decoded = await this.jwtService.verifyAsync(cookie);
    request.user = decoded;
    if(await this.userServices.findOne(request.user.id) == undefined)
      throw new HttpException('You are not authorized3', 230);
    if(request.user.require2fa)
      throw new HttpException({
        message: '2FA required',
        data:{require2fa: true}
        
      }, 230);
    return true;
  }
}
