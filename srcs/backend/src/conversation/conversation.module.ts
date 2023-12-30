import { Module } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { ConversationController } from './conversation.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MembershipService } from 'src/membership/membership.service';
import { UsersService } from 'src/users/users.service';
import { UserproviderService } from 'src/userprovider/userprovider.service';
import { RedisService } from 'src/redis/redis.service';

@Module({
  controllers: [ConversationController],
  providers: [ConversationService, MembershipService, UsersService, UserproviderService, RedisService],
  imports: [PrismaModule]
})
export class ConversationModule {}
