import { Module } from '@nestjs/common';
import { PlayerstatsService } from './playerstats.service';
import { PlayerstatsController } from './playerstats.controller';
import { RedisService } from 'src/redis/redis.service';
import { UsersService } from 'src/users/users.service';
import { UserproviderService } from 'src/userprovider/userprovider.service';

@Module({
  controllers: [PlayerstatsController],
  providers: [PlayerstatsService, RedisService, UsersService, UserproviderService],
})
export class PlayerstatsModule {}
