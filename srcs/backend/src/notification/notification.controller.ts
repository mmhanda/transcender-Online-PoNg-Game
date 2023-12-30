import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { UsersService } from 'src/users/users.service';

interface Notification { 
  id?: number;
  senderId?: number;
  avatar: string;
  content: string;
  type: string;
  fullname?: string;
  conversationId?: number;
}
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService, private readonly usersServices: UsersService) { }

  @Post()
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationService.create(createNotificationDto);
  }

  @Get('user')
  @UseGuards(AuthGuard)
  async findAll(@Req() req: any) {
    const id = req.user.id;
    const notifications = await this.notificationService.findAll(id);
    const result: Notification[] = [];
    notifications.forEach((notification) => {
      if(notification.type == 'accepted' && notification.friend.sender.id == id){
        result.push({
          id: notification.id,
          senderId: notification.friend.receiver.id,
          avatar: notification.friend.receiver.avatar,
          content: notification.content,
          type: notification.type,
          fullname: notification.friend.receiver.fullname,
        });
      }
      else if(notification.type == 'friends' && notification.friend.sender.id != id){
        result.push({
          id: notification.id,
          senderId: notification.friend.sender.id,
          avatar: notification.friend.sender.avatar,
          content: notification.content,
          type: notification.type,
          fullname: notification.friend.sender.fullname,
        });
      }
      else if(notification.type == 'challenge'){
        result.push({
          id: notification.id,
          senderId: notification.challenge.sender.id,
          avatar: notification.challenge.sender.avatar,
          content: notification.content,
          type: notification.type,
          fullname: notification.challenge.sender.fullname,
          conversationId: notification.challenge.conversationId,
        });
      }
    
    });
    return { notifications: result };
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNotificationDto: UpdateNotificationDto) {
    return this.notificationService.update(+id, updateNotificationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notificationService.remove(+id);
  }
}
