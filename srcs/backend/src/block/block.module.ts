import { Module } from '@nestjs/common';
import { BlockService } from './block.service';
import { BlockController } from './block.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RedisService } from 'src/redis/redis.service';
import { UsersService } from 'src/users/users.service';
import { UserproviderService } from 'src/userprovider/userprovider.service';

@Module({
  controllers: [BlockController],
  providers: [BlockService, RedisService, UsersService, UserproviderService],
  imports: [PrismaModule],
})
export class BlockModule {}
