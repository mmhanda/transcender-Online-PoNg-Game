import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { TwoFactorAuthService } from './2fa.service';
import { UserproviderService } from 'src/userprovider/userprovider.service';
import { PlayerstatsService } from 'src/playerstats/playerstats.service';
import * as QRCode from 'qrcode';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly twoFactorAuthService: TwoFactorAuthService,
    private readonly userProviderService: UserproviderService,
    private readonly playerStatsService: PlayerstatsService
  ) {}

  async validateUserProvider(profile: any): Promise<any> {
    try {
      const userprovider = await this.userProviderService.findByLoginId(
        profile.id,
      );
      if (userprovider.status == HttpStatus.NOT_FOUND) {
        const create = await this.usersService.createWithProvider(profile);
        try{
          await this.playerStatsService.createPlayerstats(create.data.user.id);
        }catch(error){
        }
        return create;
      } else {
        const user = await this.usersService.findOne(userprovider.data.userId);
        return user;
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        const create = await this.usersService.createWithProvider(profile);
        try{
          await this.playerStatsService.createPlayerstats(create.data.user.id);
        }catch(error){
        }
        return create;
      }
    }
  }

  async enableTwoFactorAuth(userId: number): Promise<any> {
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const secret = await this.twoFactorAuthService.generateSecret();
    
    const Qrcode = await QRCode.toDataURL(secret.otpauth_url);

    return{
      secret: secret,
      userId: userId,
      Qrcode: Qrcode
    }
  }

  async verifyTwoFactorAuth(userId: number, token: string, type: number, secret?: string): Promise<boolean> {
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new NotFoundException('User or 2FA secret not found');
    }
    const result = this.twoFactorAuthService.verifyTOTP(user, token, user.data.twoFactorSecret || secret);
    if (result) {
      if(type == 1)
        await this.usersService.updateTwofactorAuth(userId, secret);
      return true;
    }
    return false;
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email, pass);
    if (user) return user;
    return null;
  }

  async disableTwoFactorAuth(userId: number): Promise<void> {
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.usersService.updateTwofactorAuth(userId, '');
  }
}
