import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConversationService } from '../conversation.service';

@Injectable()
export class UserInConversationGuard implements CanActivate {
  constructor(private readonly conversationService: ConversationService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    const userId = request.user.id;
    const conversationId = request.params.id;

    // Fetch the conversation by ID
    const conversation = await this.conversationService.checkUserAccess(
      conversationId,
      userId,
    );
    if (!conversation) {
      res.status(230).send({ message: 'Unauthorized' });
    }
    return true;
  }
}
