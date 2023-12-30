import { CanActivate, ExecutionContext, HttpException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { ConversationService } from '../conversation.service';
import { MembershipService } from 'src/membership/membership.service';

@Injectable()
export class UpdateGuard implements CanActivate {
  constructor(
    private readonly userService: UsersService,
    private readonly conversationService: ConversationService,
    private readonly memberShipService: MembershipService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
  
    if (request.body.status === 'protected' && !request.body.password) {
        throw new HttpException('Password is required', 230);
    }
    const owner = await this.conversationService.checkUserOwner(
        request.params.id,
        request.user.id,
    );
    if (!owner) {
        throw new HttpException('You are not allowed to update', 230);
    }
    return true; 
  }  
}
