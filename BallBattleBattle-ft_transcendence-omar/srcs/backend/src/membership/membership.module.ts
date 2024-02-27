import { Module } from '@nestjs/common';
import { MembershipService } from './membership.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MembershipController } from './membership.controller';

@Module({
  controllers: [MembershipController],
  providers: [MembershipService],
  imports: [PrismaModule],
})
export class MembershipModule {}
