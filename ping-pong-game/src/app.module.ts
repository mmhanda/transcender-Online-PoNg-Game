import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { gateWayModule } from './gateway/gateWayModule';

@Module({
  imports: [gateWayModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
