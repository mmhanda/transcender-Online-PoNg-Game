import {
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class UserValidTokenId implements CanActivate {
  constructor() {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    const userId = request.user.id;
    const paramId = request.params.id;
    if (userId !== +paramId) {
      res.status(230).send({ message: 'Unauthorized' });
    }
    return true;
  }
}
