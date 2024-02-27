import { Module } from '@nestjs/common';
import { ChallengeService } from './challenge.service';
import { NotificationService } from 'src/notification/notification.service';

@Module({
  providers: [ChallengeService, NotificationService],
})
export class ChallengeModule {}














