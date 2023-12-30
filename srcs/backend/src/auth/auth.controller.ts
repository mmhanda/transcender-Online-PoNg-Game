import {
  Body,
  Controller,
  Get,
  HttpException,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import * as passport from 'passport';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { GoogleOAuthGuard } from './guard/google.guard';
import { RedisService } from 'src/redis/redis.service';
import { AuthGuard } from './guard/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private jwtService: JwtService,
    private authService: AuthService,
    private redisService: RedisService,
  ) {}

  @Get('intra')
  async login42(@Req() req, @Res() res) {
    passport.authenticate('42', { session: false })(req, res);
  }

  @Get('42/callback')
  async callback42(@Req() req, @Res() res) {
    passport.authenticate('42', { session: false }, async (err, user, info) => {
      if (err) {
        throw err;
      }
      if (!user) {
        return res.status(401).send(info);
      }
      let jwt
      if (user.data.user == undefined)
        jwt = await this.jwtService.signAsync({ id: user.data.id, require2fa: user.data.twoFactorEnabled });
      else
        jwt = await this.jwtService.signAsync({ id: user.data.user.id, require2fa: user.data.user.twoFactorEnabled });
        res.cookie('token', jwt, { httpOnly: true });

      res.redirect(process.env.Redirection_URL);
    })(req, res);
  }

  @Get('google')
  @UseGuards(GoogleOAuthGuard)
  async googleAuth() {
    return;
  }

  @Get('google/callback')
  @UseGuards(GoogleOAuthGuard)
  async googleAuthRedirect(@Req() req, @Res() res) {
    let jwt
    if (req.user.data.user != undefined)
      jwt = await this.jwtService.signAsync({ id: req.user.data.user.id, require2fa: req.user.data.user.twoFactorEnabled });
    else
      jwt = await this.jwtService.signAsync({ id: req.user.data.id, require2fa: req.user.data.twoFactorEnabled });
    res.cookie('token', jwt, { httpOnly: true });
    return res.redirect(process.env.Redirection_URL);
  }

  @Get('get-2fa')
  @UseGuards(AuthGuard)
  async enableTwoFactorAuth(
    @Req() req,
  ): Promise<void> {
    const id = req.user.id;
    const result = await this.authService.enableTwoFactorAuth(id);
    return result;
  }

  @Post('enable-2fa')
  @UseGuards(AuthGuard)
  async EnableTwoFactorAuth(
    @Req() req,
    @Body('token') token: string,
    @Body('secret') secret: string,
    @Res() res,
  ): Promise<{ success: boolean }> {
    const id = req.user.id;
    const success = await this.authService.verifyTwoFactorAuth(id, token, 1, secret);
    if (success) {
      const jwt = await this.jwtService.signAsync({ id: req.user.id, require2fa: false });
      res.cookie('token', jwt, { httpOnly: true });
      return res.status(200).send({ success });
    }
    return res.status(200).send({ success });
  }

  @Post('verify-2fa')
  async verifyTwoFactorAuth(
    @Req() req : any,
    @Body('token') token: string,
    @Res() res,
  ): Promise<{ success: boolean }> {
    if(!req.cookies.token)
      return res.status(230).send( "You are not authorized" );
    const decoded = await this.jwtService.verifyAsync(req.cookies.token);
    const success = await this.authService.verifyTwoFactorAuth(decoded.id, token, 0);
    if (success) {
      const jwt = await this.jwtService.signAsync({ id: decoded.id, require2fa: false });
      res.cookie('token', jwt, { httpOnly: true });
      return res.status(200).send({ success });
    }
    return res.status(200).send({ success });
  }
    

  @Post('disable-2fa')
  @UseGuards(AuthGuard)
  async disableTwoFactorAuth(@Req() req): Promise<void> {
    const id = req.user.id;
    const result = await this.authService.disableTwoFactorAuth(id);
    return result;
  }

  @Post('local/login')
  @UseGuards(LocalAuthGuard)
  async lgin(@Req() req, @Res() res) {
    try {
      let jwt = '';
      jwt = await this.jwtService.signAsync({ id: req.user.id, require2fa: req.user.twoFactorEnabled });
     
      res.cookie(
        'token',
        jwt,
        { httpOnly: true, maxAge: 3600000 * 24 },
        { httpOnly: true, maxAge: 3600000 * 24 },
      );
      return res.status(200).send({ user: req.user, jwt: jwt, require2fa: req.user.twoFactorEnabled});
    } catch (error) {
      return res.status(500).send('Internal Server Error');
    }
  }

  @Get('logout')
  @UseGuards(AuthGuard)
  async logout(@Req() req, @Res() res) {
    try { 
      const token = req.cookies.token;
      
      // Verify the token before clearing the cookie
      const jwt = await this.jwtService.verifyAsync(req.cookies.token);
      
      // Add token to blacklist with a buffer (e.g., 60 seconds before actual expiration)
      const bufferSeconds = 60;
      await this.redisService.addJwtToBlacklist(`blacklist:${token}`, token, jwt.exp - jwt.iat - bufferSeconds);
      
      // Clear the cookie after verifying the token
      res.clearCookie('token');
  
      return res.status(200).send({ message: 'logout success' });
    } catch (error) {
      return res.status(500).send({ message: 'logout failed' });
    }
  }   
}
