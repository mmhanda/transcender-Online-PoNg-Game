import { Module } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { NotificationService } from 'src/notification/notification.service';
import { RedisService } from 'src/redis/redis.service';
import { FriendsController } from './friends.controller';
import { UsersService } from 'src/users/users.service';
import { UserproviderService } from 'src/userprovider/userprovider.service';

@Module({
  controllers: [FriendsController],
  providers: [FriendsService, NotificationService, RedisService, UsersService, UserproviderService],
})
export class FriendsModule {}
