import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { MembershipService } from 'src/membership/membership.service';
import { ConversationService } from 'src/conversation/conversation.service';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class SendMessageGuard implements CanActivate {
  constructor(
    private readonly userService: UsersService,
    private readonly conversationService: ConversationService,
    private readonly memberShipService: MembershipService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const payload = context.switchToWs().getData();
    const request = context.switchToHttp().getRequest();
    const access = await this.conversationService.checkUserAccess(
        payload.conversationId,
        request.user.id,
        );
    const banedUser = await this.conversationService.checkUserBan(payload.conversationId, request.user.id);
    const muted = await this.conversationService.checkUserMuted(payload.conversationId, request.user.id);
    if (access || banedUser || muted) {
        throw new WsException('You are not allowed to send message');
    }


    const conversation = await this.conversationService.findOne(+payload.conversationId);
    if(conversation.data.type === 'direct'){
        const user = await this.userService.findOne(request.user.id);
        const recievedId = conversation.data.members.filter(member => member.userId !== user.data.id);
        const blocked = await this.userService.checkUserBlocked(recievedId[0].userId, user.data.id);
        if(blocked){
            return false;
        }
    }
    return true;
  }
}
