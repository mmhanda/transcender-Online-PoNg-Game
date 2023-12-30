import { CanActivate, ExecutionContext, HttpException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { ConversationService } from '../conversation.service';
import { MembershipService } from 'src/membership/membership.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ProtectedPrivateChannel implements CanActivate {
  constructor(
    private readonly userService: UsersService,
    private readonly conversationService: ConversationService,
    private readonly memberShipService: MembershipService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const conversation = await this.conversationService.findOne(request.params.id);
  
    if (conversation.data.status === 'private') {
      const promises = conversation.data.members.map(async (member) => {
        if (member.userId === request.user.id && member.status === 'invited') {
          await this.memberShipService.update(member.id, { status: 'member' }, 0);
          return true;
        }
      });
  
      const results = await Promise.all(promises);
      if (results.some(result => result)) {
        return true;
      }
      throw new HttpException('You are not invited', 230);
    }
  
    if (conversation.data.status === 'protected') {
      const password = request.body.password;
      if(await bcrypt.compare(password, conversation.data.password)){
        return true;
      }
      throw new HttpException('Wrong password', 230);
    }
  
    return true;
  }  
}
