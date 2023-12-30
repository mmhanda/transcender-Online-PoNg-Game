import {
    CanActivate,
    ExecutionContext,
    Injectable,
  } from '@nestjs/common';
  import { Observable } from 'rxjs';
  
  @Injectable()
  export class UserValidTokenId implements CanActivate {
    constructor() {}
  
    async canActivate(
      context: ExecutionContext,
    ):Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      const validEmail = request.body.email;
      // i need to check if the email is valid
      
      return true;
    }
  }
  