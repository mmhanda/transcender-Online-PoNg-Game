import { Module } from '@nestjs/common';
import { MyGateWay } from './gateway';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { MyGateWayCustom } from './gatewayCustom';
import { MyGateWayBot } from './gatewayBot';

@Module({
  providers: [MyGateWay, GameService, MyGateWayCustom, MyGateWayBot],
  controllers: [GameController],
})
export class gameModule { }
