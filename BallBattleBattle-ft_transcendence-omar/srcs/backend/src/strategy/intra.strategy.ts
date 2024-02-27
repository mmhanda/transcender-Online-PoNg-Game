import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy)
{
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.Intra_Client_ID,
      clientSecret: process.env.Intra_Secret,
      callbackURL: process.env.Intra_Redirection_URL
    });
}

  async validate(accessToken: string, refreshToken: string, profile: any)
  {
    try{
      const user = await this.authService.validateUserProvider(profile);
      return user;
    }
    catch(err){
      
    }
  }
}
