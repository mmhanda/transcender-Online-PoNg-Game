import { Module } from '@nestjs/common';
import { MyGateWay } from './gateway';
import { MyGateWayCustom } from './gatewayCustom';

@Module({
  providers: [MyGateWay, MyGateWayCustom],
})

export class gateWayModule { }
