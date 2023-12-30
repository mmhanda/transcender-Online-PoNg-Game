import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { BlockModule } from './block/block.module';
import { ConversationModule } from './conversation/conversation.module';
import { MembershipModule } from './membership/membership.module';
import { MessageModule } from './message/message.module';
import { Gateway } from './socket/global/gateway';
import { AuthModule } from './auth/auth.module';
import { UserproviderModule } from './userprovider/userprovider.module';
import { gameModule } from './socket/game/game.module';
import { MatchesService } from './matches/matches.service';
import { PlayerstatsService } from './playerstats/playerstats.service';
import { FriendsModule } from './friends/friends.module';
import { ChallengeModule } from './challenge/challenge.module';
import { NotificationModule } from './notification/notification.module';
import { PlayerstatsModule } from './playerstats/playerstats.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { UsersService } from './users/users.service';
import { ConversationService } from './conversation/conversation.service';
import { MembershipService } from './membership/membership.service';
import { MessageService } from './message/message.service';
import { FriendsService } from './friends/friends.service';
import { RedisModule } from './redis/redis.module';
import { MatchesController } from './matches/matches.controller';

@Module({
  imports: [
    UsersModule,
    PrismaModule,
    BlockModule,
    ConversationModule,
    MembershipModule,
    MessageModule,
    AuthModule,
    UserproviderModule,
    gameModule,
    FriendsModule,
    ChallengeModule,
    NotificationModule,
    PlayerstatsModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'public'),
    }),
    RedisModule
  ],
  providers: [
    PrismaService,
    Gateway,
    MatchesService,
    PlayerstatsService,
    UsersService,
    ConversationService,
    MembershipService,
    MessageService,
    FriendsService
  ],
  controllers: [AppController, MatchesController],
})
export class AppModule {}
