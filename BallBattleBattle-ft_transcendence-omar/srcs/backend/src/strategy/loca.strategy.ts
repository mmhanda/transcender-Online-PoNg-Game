// local.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<any> {
    // Validate the user credentials using the AuthService
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      // If validation fails, throw an unauthorized exception
      throw new UnauthorizedException();
    }

    // If validation succeeds, return the user object
    return user;
  }
}
