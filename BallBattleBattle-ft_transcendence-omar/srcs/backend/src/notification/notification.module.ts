import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { UsersService } from 'src/users/users.service';
import { UserproviderService } from 'src/userprovider/userprovider.service';
import { RedisService } from 'src/redis/redis.service';
import { NotificationController } from './notification.controller';

@Module({
  controllers: [NotificationController],
  providers: [NotificationService, UsersService, UserproviderService, RedisService],
})
export class NotificationModule {}
