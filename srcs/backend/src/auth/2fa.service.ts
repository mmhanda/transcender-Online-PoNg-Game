// two-factor-auth.service.ts
import * as speakeasy from 'speakeasy';

export class TwoFactorAuthService {
  generateSecret(): Promise<any> {
    return speakeasy.generateSecret({name: 'BallBattle'});
  }

  verifyTOTP(user: any, token: string, secret: string): boolean {
    try {
      const result = speakeasy.totp.verify({
        secret: secret,
        encoding: 'base32',
        token: token,
      });

      return result;
    } catch (error) {
      return false;
    }
  }
}
