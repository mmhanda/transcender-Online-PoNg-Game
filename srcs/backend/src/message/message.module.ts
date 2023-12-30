import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ConversationService } from 'src/conversation/conversation.service';
import { MembershipService } from 'src/membership/membership.service';
import { UsersService } from 'src/users/users.service';
import { UserproviderService } from 'src/userprovider/userprovider.service';

@Module({
  providers: [MessageService, ConversationService, MembershipService, UsersService, UserproviderService],
  imports: [PrismaModule],
})
export class MessageModule {}
