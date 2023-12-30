import { CanActivate, ExecutionContext, HttpException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { ConversationService } from '../conversation.service';
import { MembershipService } from 'src/membership/membership.service';

@Injectable()
export class KickedGuard implements CanActivate {
  constructor(
    private readonly userService: UsersService,
    private readonly conversationService: ConversationService,
    private readonly memberShipService: MembershipService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    // Check if the user is owner of the channel or admin
    const owner = await this.conversationService.checkUserOwner(
      request.params.id,
      request.user.id,
    );
    const admin = await this.conversationService.checkUserAdmin(
      request.params.id,
      request.user.id,
    );
    if (!admin && !owner) {
      throw new HttpException('You are not allowed', 230);
    }
    const member = await this.memberShipService.findOne(request.params.memberId);
    const kicked = await this.conversationService.checkUserOwner(
      request.params.id,
      member.data.userId
    );
    if (kicked) {
      throw new HttpException('You can not kick owner', 230);
    }
    return true;
  }
}
