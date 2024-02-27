// import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
// import { UsersService } from 'src/users/users.service';
// import { MembershipService } from 'src/membership/membership.service';
// import { ConversationService } from 'src/conversation/conversation.service';

// @Injectable()
// export class InviteGuard implements CanActivate {
//   constructor(
//     private readonly userService: UsersService,
//     private readonly conversationService: ConversationService,
//     private readonly memberShipService: MembershipService,
//   ) {}
//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const request = context.switchToHttp().getRequest();

//     const access = await this.conversationService.checkUserAccess(
//         request.body.conversationId,
//         request.user.id,
//         );
//     const banedUser = await this.conversationService.checkUserBan(request.body.conversationId, request.user.id);
//     const muted = await this.conversationService.checkUserMuted(request.body.conversationId, request.user.id);
//     if (access || banedUser || muted) {
//         return false;
//     }


//     const conversation = await this.conversationService.findOne(+request.body.conversationId);
//     if(conversation.data.type === 'direct'){
//         const user = await this.userService.findOne(request.body.senderId);
//         const recievedId = conversation.data.members.filter(member => member.userId !== user.data.id);
//         const blocked = await this.userService.checkUserBlocked(recievedId[0].userId, user.data.id);
//         if(blocked){
//             return false;
//         }
//     }
//     return true;
//   }
// }
