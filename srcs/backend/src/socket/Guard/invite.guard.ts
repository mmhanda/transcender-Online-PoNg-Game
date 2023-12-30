import { Injectable, ExecutionContext } from '@nestjs/common';
import { CanActivate } from '@nestjs/common/interfaces';
import { WsException } from '@nestjs/websockets';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class InviteGuard implements CanActivate {
  constructor(private readonly userService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const payload = context.switchToWs().getData();
    const request = context.switchToHttp().getRequest();

    const invitedUser = await this.userService.findOne(payload.inviteFriend);
    if (!invitedUser) {
      throw new WsException('Invited user not found');
    }

    const blockedBy = await this.userService.checkUserBlocked(request.user.id, payload.inviteFriend);
    if (blockedBy) {
      throw new WsException('You are blocked by this user');
    }

    const blocked = await this.userService.checkUserBlocked(payload.inviteFriend, request.user.id);
    if (blocked) {
      throw new WsException('User is blocked');
    }

    const friend = await this.userService.checkUserFriend(+payload.inviteFriend, request.user.id);
    if (friend) {
      throw new WsException('User is already a friend');
    }

    return true;
  }
}
