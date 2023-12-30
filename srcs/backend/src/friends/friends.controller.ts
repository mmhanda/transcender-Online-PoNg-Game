import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { FriendsService } from './friends.service';
import { CreateFriendDto } from './dto/create-friend.dto';
import { UpdateFriendDto } from './dto/update-friend.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { NotificationService } from 'src/notification/notification.service';

interface friend {
  id: number;
  fullname: string;
  avatar: string | undefined;
  isMe?: boolean;
  status?: string;
}
@Controller('friends')
@ApiTags('friends')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService, private readonly notificationService: NotificationService) { }

  @Post()
  @UseGuards(AuthGuard)
  async create(@Body() createFriendDto: CreateFriendDto) {
    const frined = await this.friendsService.create(createFriendDto);
    await this.notificationService.createNotification({
      type: 'friends',
      friendId: frined.friend.id
    });
    return frined;
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll() {
    return this.friendsService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.friendsService.findOne(+id);
  }

  @Get('user/:id')
  @UseGuards(AuthGuard)
  async findFriends(@Param('id') id: string, @Req() req) {
    const userId = req.user.id;
    if (+id == 0)
      id = userId.toString();

    const friends = await this.friendsService.findFriends(+id);
    const friendsArray: friend[] = [];

    friends.friends.forEach((friend) => {
      let friendObj: friend;
      if(userId != id)
        friendObj = {
          id: friend.senderId === +id ? friend.receiverId : friend.senderId,
          fullname: friend.senderId === +id ? friend.receiver.fullname : friend.sender.fullname,
          avatar: friend.senderId === +id ? friend.receiver.avatar : friend.sender.avatar,
          isMe: friend.senderId === userId || friend.receiverId === userId ? true : false,
          status: friend.senderId === +id ? friend.receiver.status : friend.sender.status,
        };
      else
        friendObj = {
          id: friend.senderId === +id ? friend.receiverId : friend.senderId,
          fullname: friend.senderId === +id ? friend.receiver.fullname : friend.sender.fullname,
          avatar: friend.senderId === +id ? friend.receiver.avatar : friend.sender.avatar,
          isMe: false,
          status: friend.senderId === +id ? friend.receiver.status : friend.sender.status,
        };

      // Check if the current friend is the user themselves
      if (friend.senderId !== +id && friend.receiverId !== +id) {
        friendsArray.push(friendObj);
      }
      else {
        friendsArray.unshift(friendObj);
      }
    });

    return friendsArray;
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async update(@Param('id') id: string, @Body() updateFriendDto: UpdateFriendDto, @Req() req) {
    const tokenId = req.user.id;
    const friend = await this.friendsService.findTwoFriends(+id, tokenId);
    return this.friendsService.update(friend.friends[0].id, updateFriendDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async remove(@Param('id') id: string, @Req() req) {
    const tokenId = req.user.id;
    try {
      const friend = await this.friendsService.findTwoFriends(+id, tokenId);
      return this.friendsService.remove(friend.friends[0].id);
    }
    catch (error) {
      return {
        message: 'Error deleting friend',
        error,
      };
    }
  }
}
