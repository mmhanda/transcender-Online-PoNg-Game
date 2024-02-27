import { ConversationService } from 'src/conversation/conversation.service';
import { FriendsService } from 'src/friends/friends.service';
import { MembershipService } from 'src/membership/membership.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';

class Tools {
  constructor(
    private prisma: PrismaService,
    private conversationService: ConversationService,
    private readonly userService: UsersService,
    private readonly friendService: FriendsService,
    private readonly memberService: MembershipService,
  ) { }

  async newConversation(payload: any, senderId: number) {
    try {
      // create new conversation
      const conversation = await this.conversationService.create({
        name: 'user',
        type: 'direct',
        status: 'private',
        password: '',
        description: 'user',
        guestId: payload.receiverId,
      });

      // create new membership
      await this.memberService.create({
        conversationId: conversation.data.id,
        userId: senderId,
        status: 'owner',
        unread: 0,
      });
      await this.memberService.create({
        conversationId: conversation.data.id,
        userId: payload.receiverId,
        status: 'admin',
        unread: 0,
      });

      // create new message
      const message = await this.prisma.message.create({
        data: {
          content: payload.content,
          conversationId: conversation.data.id,
          senderId: senderId,
        },
      });
      return {
        message: 'Message sent successfully',
        data: {
          cid: conversation.data.cid,
          id: conversation.data.id,
          content: message.content,
          senderId: message.senderId,
          createdAt: message.createdAt,
          conversationId: message.conversationId,
          type: conversation.data.type,
        },
        status: 200,
      };
    } catch (err) {

      throw err;
    }
  }

  async conversationExist(payload: any, senderId: number) {
    try {
      const conversation = await this.conversationService.findOneByCId(payload.conversationId);
      const message = await this.prisma.message.create({
        data: {
          content: payload.content,
          conversationId: conversation.data.id,
          senderId: senderId,
        },
      });
      return {
        message: 'Message sent successfully',
        data: {
          id: payload.conversationId,
          content: message.content,
          senderId: message.senderId,
          createdAt: message.createdAt,
          conversationId: message.conversationId,
          type: conversation.data.type,
        },
        status: 200,
      };
    } catch (err) {

      throw err;
    }
  }

  async getConversationClients(conversationId: string) {
    try {
      const conversation = await this.prisma.conversation.findUnique({
        where: {
          cid: conversationId,
        },
        include: {
          members: {
            include: {
              user: {
                select: {
                  id: true,
                },
              },
            },
          },
        },
      });
      if (!conversation) {
        return [];
      }
      const clientIds = conversation.members.map((member) => member.user.id);
      return clientIds;
    } catch (error) {
      throw error;
    }
  }

  async updateUser(id: number, unreadNotification: number) {
    try {
      const user = await this.prisma.user.update({
        where: {
          id: +id,
        },
        data: {
          unreadNotification: unreadNotification,
        },
      });
      return user;
    } catch (err) {

    }
  }

  async createNotification(
    challengeId: number,
    friendId: number,
    type: any,
    content: string,
  ) {
    try {
      const notification = await this.prisma.notification.create({
        data: {
          challengeId: challengeId,
          friendId: friendId,
          type: type,
          content: content,
        },
      });
      return notification;
    } catch (err) {

    }
  }

  async getUsrId(client: number) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: client,
        },
      });
      return user;
    } catch (err) {

    }
  }

  async savenewChallenge(senderId: number, receiverId: number) {
    try {
      const challenge = await this.prisma.challenge.create({
        data: {
          senderId: senderId,
          receiverId: receiverId,
        },
      });
      return challenge;
    } catch (err) {

    }
  }

  async checkUserinGame(id: number) {
    try {
      const user = await this.prisma.match.findFirst({
        where: {
          status: 'ingame',
          OR: [
            {
              hostId: id,
            },
            {
              guestId: id,
            },
          ],
        },
      });
      return user ? true : false;
    } catch (err) {

    }
  }
}

export default Tools;
