import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserproviderModule } from 'src/userprovider/userprovider.module';
import { PlayerstatsService } from 'src/playerstats/playerstats.service';
import { RedisService } from 'src/redis/redis.service';
import { FriendsService } from 'src/friends/friends.service';
import { BlockService } from 'src/block/block.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PlayerstatsService, RedisService, FriendsService, BlockService],
  imports: [PrismaModule, UserproviderModule],
})
export class UsersModule {}
