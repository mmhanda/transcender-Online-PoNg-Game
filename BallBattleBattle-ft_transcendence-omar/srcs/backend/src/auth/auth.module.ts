import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { FortyTwoStrategy } from '../strategy/intra.strategy';
import { LocalStrategy } from '../strategy/loca.strategy'; // Import LocalStrategy
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { TwoFactorAuthService } from './2fa.service';
import { LocalAuthGuard } from './guard/local-auth.guard'; // Import LocalAuthGuard
import { UserproviderService } from 'src/userprovider/userprovider.service';
import { GoogleStrategy } from 'src/strategy/google.strategy';
import { PlayerstatsService } from 'src/playerstats/playerstats.service';
import { RedisService } from 'src/redis/redis.service';

@Module({
  controllers: [AuthController],
  imports: [
    PassportModule.register({ defaultStrategy: '42' }),
    UsersModule,
    JwtModule.register({
      global: true,
      secret: 'secret',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [
    FortyTwoStrategy,
    LocalStrategy,
    AuthService,
    UsersService,
    UserproviderService,
    TwoFactorAuthService,
    GoogleStrategy,
    LocalAuthGuard,
    PlayerstatsService,
    RedisService,
    UsersService,
  ],
})
export class AuthModule {}
