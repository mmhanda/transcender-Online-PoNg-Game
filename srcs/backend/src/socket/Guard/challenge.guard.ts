import { Injectable, ExecutionContext } from '@nestjs/common';
import { CanActivate } from '@nestjs/common/interfaces';
import { WsException } from '@nestjs/websockets';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ChallengeGuard implements CanActivate {
  constructor(private readonly userService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const payload = context.switchToWs().getData();
    const request = context.switchToHttp().getRequest();

    const invitedUser = await this.userService.findOne(payload.challengeFriend);
    if (!invitedUser) {
        throw new WsException('Invited user not found');
    }

    const blocked = await this.userService.checkUserBlocked(payload.challengeFriend, request.user.id);
    if (blocked) {
        throw new WsException('User is blocked');
    }

    const friend = await this.userService.checkUserFriend(+payload.challengeFriend, request.user.id);
    if (!friend) {
        throw new WsException('User is already a friend');
    }
    return true;
  }
}