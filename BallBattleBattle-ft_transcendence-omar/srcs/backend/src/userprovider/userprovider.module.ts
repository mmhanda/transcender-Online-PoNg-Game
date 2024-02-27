import { Module } from '@nestjs/common';
import { UserproviderService } from './userprovider.service';

@Module({
  providers: [UserproviderService],
  exports: [UserproviderService],
})
export class UserproviderModule {}
