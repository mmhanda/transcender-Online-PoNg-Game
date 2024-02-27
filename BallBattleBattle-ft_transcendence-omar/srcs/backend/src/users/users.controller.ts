import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  HttpException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { PlayerstatsService } from 'src/playerstats/playerstats.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '../auth/guard/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/tools/multer.config';
import { FriendsService } from 'src/friends/friends.service';
import { BlockService } from 'src/block/block.service';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly playerStatsService: PlayerstatsService,
    private readonly friendService: FriendsService,
    private readonly blockService: BlockService,
  ) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto, @Res() res) {
    if(createUserDto.password != createUserDto.confirmPassword) {
      return res.status(230).send({ message: 'Password and confirm password are not the same' });
    }
    const user = await this.usersService.create(createUserDto);
    if (user.status == 201) {
      const jwt = await this.jwtService.signAsync({ id: +user.data.id });
      const playStats = await this.playerStatsService.createPlayerstats(
        +user.data.id,
      );
      res.cookie('token', jwt, { httpOnly: true });
    }
    res.send(user);
  }
  
  @Get()
  findAll() {
    return this.usersService.findAll();
  }
  
  @UseGuards(AuthGuard)
  @Get('user/:username')
  async findOneByUsername(@Param('username') username: string) {
    const user = await this.usersService.findOneByUsername(username);
    return user;
  }
  
  @Get('me')
  @UseGuards(AuthGuard)
  async findMe(@Res() res, @Request() req) {
    const user = await this.usersService.findOne(req.user.id);
    if(user.status == 200){
      user.data.password = user.data.password == null ? false : true;
      if(user.data.status !== 'inGame')
        await this.usersService.updateStatus(req.user.id, 'online');
    }
    return res.send(user);
  }
  
  @Get(':id')
  @UseGuards(AuthGuard)
  async findOne(@Param('id') id: string, @Request() req) {
    try{
    if (id.length > 5)
      throw new HttpException('User not found', 404);
    if (+id == 0)
      id = req.user.id;
    const user = await this.usersService.findOne(+id);
    const playerstats = await this.playerStatsService.findAll();
    const tiers = await this.usersService.findLLTiers();
    if(user.status == 200) {
      const friend = await this.friendService.findTwoFriends(+id, req.user.id);
      if(friend.friends.length > 0){
        user.data.Friendstatus = friend.friends[0].status;
        if (friend.friends[0].senderId == +id && friend.friends[0].status == 'pending')
          user.data.Friendstatus = 'request';
      }
      else
        user.data.Friendstatus = false;
      user.data.Isyou = user.data.id === req.user.id ? true : false;
      const block = await this.blockService.findTwoBlocks(+id, req.user.id);
      user.data.Blockstatus = false;
      if(block.data.length > 0)
        user.data.Blockstatus = block.data[0].blockedId == +id ? 'block' : 'blocked';
      playerstats.forEach((element, index) => {
        if(element.userId == +id)
          user.data.classment = index + 1;
      });
      tiers.forEach((element) => {
        if(user.data.playerStats.rank >= element.minRank && user.data.playerStats.rank <= element.maxRank)
          user.data.tier = element;
      });
      user.data.playerStats.games = user.data.playerStats.guest.length + user.data.playerStats.host.length;
      user.data.playerStats.wins = user.data.playerStats.win.length;
      user.data.playerStats.winRate = Math.round((user.data.playerStats.wins / user.data.playerStats.games) * 100);
      user.data.friendCount = user.data.sender.length + user.data.receiver.length;
      delete user.data.playerStats.win;
      delete user.data.playerStats.host;
      delete user.data.playerStats.guest;
      delete user.data.sender;
      delete user.data.receiver;
      delete user.data.password;
      delete user.data.twoFactorSecret;
    }
    return user;
  }
  catch(error){
    return { status: 404, message: 'User not found' };
  }
  }

  @Patch()
  @UseInterceptors(FileInterceptor('file', multerConfig))
  @UseGuards(AuthGuard)
  async update(@Body() updateUserDto: UpdateUserDto, @UploadedFile() file: Express.Multer.File, @Request() req, @Res() res) {
    if(updateUserDto.password != updateUserDto.confirmPassword) {
      return res.status(230).send({ message: 'Password and confirm password are not the same' });
    }
    const id = req.user.id;
    const update = await this.usersService.update(id, updateUserDto, file);
    return res.send(update);
  }

  @Patch('unreadNotification/')
  @UseGuards(AuthGuard)
  async updateUnreadNotification(@Body() updateUserDto: UpdateUserDto, @Request() req) {
    const id = req.user.id;
    const update = await this.usersService.updateUnreadNotification(id);
    return update;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    // const playStats = await this.playerStatsService.deletePlayerstats(+id);
    const user = await this.usersService.remove(+id);
    return { user };
  }
}
