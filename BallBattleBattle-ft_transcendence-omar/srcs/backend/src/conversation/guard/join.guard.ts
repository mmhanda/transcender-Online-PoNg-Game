import {
    CanActivate,
    ExecutionContext,
    HttpException,
    HttpStatus,
    Injectable,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { ConversationService } from '../conversation.service';
import * as bcrypt from 'bcrypt';
import { MembershipService } from 'src/membership/membership.service';

@Injectable()
export class JoinGuard implements CanActivate {
    constructor(
        private readonly userService: UsersService,
        private readonly conversationService: ConversationService,
        private readonly memberShipService: MembershipService,
      ) {}
    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean>  {
        const request = context.switchToHttp().getRequest();
        const conversation = await this.conversationService.findOneByCId(request.params.id);
        if (conversation.status == HttpStatus.NOT_FOUND) {
            throw new HttpException('Conversabbbbbtion not found', 230);
        }
  const banedUser = await this.conversationService.checkUserBan(request.params.id, request.user.id);
        const member = await this.conversationService.checkUserMember(request.params.id, request.user.id);
        const owner = await this.conversationService.checkUserOwner(request.params.id, request.user.id);
        const admin = await this.conversationService.checkUserAdmin(request.params.id, request.user.id);
        if (admin || owner || member || banedUser) {

            throw new HttpException('You are already a member', 230);
        }
      

        if (conversation.data.status === 'private') {
            const promises = conversation.data.members.map(async (member) => {
              if (member.userId === request.user.id && member.status === 'invited') {
                await this.memberShipService.update(member.id, { status: 'member' }, 0);
                return true;
              }
            })
        
            const results = await Promise.all(promises);
            if (results.some(result => result)) {
              return true;
            }
            throw new HttpException('You are not invited', 230);
          }
        
        if (conversation.data.status === 'protected') {
          if(request.body.password != undefined){
            if(await bcrypt.compare(request.body.password, conversation.data.password)){
              return true;
            }
          }
          throw new HttpException('Wrong password', 230);
        }
        if (conversation.data.type === 'direct') {
            throw new HttpException('You are not invited', 230);
        }

        return true;
    }
}