import { Module } from '@nestjs/common';
import { MyGateWay } from './gatewayCustom';

@Module({
  providers: [MyGateWay],
})
export class gateWayModule {}
