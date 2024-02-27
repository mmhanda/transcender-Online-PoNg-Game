import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaService) {}
  create(createNotificationDto: CreateNotificationDto) {
    return 'This action adds a new notification';
  }

  async createNotification(notification: any) {
    try {
      const newNotification = await this.prisma.notification.create({
        data: notification,
      });
      return newNotification;
    } catch (error) {
      return error;
    }
  }

  async findAll(id: number) {
    try {
      const notifications = await this.prisma.notification.findMany({
        where: {
          OR: [
            {
              friend: {
                receiverId: id,
              },
            },
            {
              challenge: {
                receiverId: id,
              },
            },
            {
              friend: {
                senderId: id,
              },
            },
          ],
        },
        select: {
          id: true,
          type: true,
          content: true,
          friend: {
            select: {
              id: true,
              sender: {
                select: {
                  id: true,
                  fullname: true,
                  avatar: true,
                },
              },
              receiver: {
                select: {
                  id: true,
                  fullname: true,
                  avatar: true,
                } 
              }
            },
          },
          challenge: {
            select: {
              id: true,
              sender: {
                select: {
                  id: true,
                  fullname: true,
                  avatar: true,
                },
              },
            },
          },
        },
      });
      return notifications;
    } catch (error) {
      return error;
    }
  }
  

  findOne(id: number) {
    return `This action returns a #${id} notification`;
  }

  async findByUser(id: number) { 
    try {
      // get all notifications by user id in friend or challenge
      const notifications = await this.prisma.notification.findMany({
        where: {
          OR: [
            {
              friend: {
                senderId: id,
              },
            },
            {
              friend: {
                receiverId: id,
              },
            },
            {
              challenge: {
                senderId: id,
              },
            },
            {
              challenge: {
                receiverId: id,
              },
            },
          ],
        },
        include: {
          friend: {
            include: {
              sender: true,
              receiver: true,
            },
          },
          challenge: {
            include: {
              sender: true,
              receiver: true,
            },
          },
        },
      });
      return notifications;
    } catch (error) {
      return error;
    }
  }

  update(id: number, updateNotificationDto: UpdateNotificationDto) {
    return `This action updates a #${id} notification`;
  }

  async remove(id: number) {
    try {
      const notification = await this.prisma.notification.delete({
        where: {
          id: id,
        },
      });
      return notification;
    }
    catch (error) {
      return error;
    }
  }
}
