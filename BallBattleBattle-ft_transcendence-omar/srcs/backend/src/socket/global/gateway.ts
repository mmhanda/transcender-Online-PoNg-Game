import { UseGuards } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthGuard } from '../Guard/Auth.guard';
import { JwtService } from '@nestjs/jwt';
import { ChallengeGuard } from '../Guard/challenge.guard';
import { FriendsService } from 'src/friends/friends.service';
import Tools from './tools';
import { MembershipService } from 'src/membership/membership.service';
import { MessageService } from 'src/message/message.service';
import { ConversationService } from 'src/conversation/conversation.service';
import { UsersService } from 'src/users/users.service';
import { SendMessageGuard } from '../Guard/sendMessage.guard';
import { InviteGuard } from '../Guard/invite.guard';

interface Message {
  id: number;
  content: string;
  senderId: number;
  avatar: string;
  conversationId: number;
  createdAt: Date;
  fullname: string;
  type?: string;
}

@WebSocketGateway({
  namespace: '/global',
  cors: {
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT', 'OPTIONS'],
  },
})
export class Gateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  clients = new Map<number, string[]>();
  private tool: Tools;
  constructor(
    private prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly messageService: MessageService,
    private readonly conversationService: ConversationService,
    private readonly userService: UsersService,
    private readonly friendService: FriendsService,
    private readonly memberService: MembershipService,
  ) {
    this.tool = new Tools(
      this.prisma,
      this.conversationService,
      this.userService,
      this.friendService,
      this.memberService,
    );
  }

  @UseGuards(AuthGuard)
  async handleConnection(client: any) {
    if (!client.handshake.headers.cookie) return;
    try {
      const token = client.handshake.headers.cookie
        .split('token=')[1]
        .split(';')[0];
      const decoded = await this.jwtService.verifyAsync(token);
      if (!decoded.id) return;
      if (this.clients.has(decoded.id))
        this.clients.get(decoded.id).push(client.id);
      else this.clients.set(decoded.id, [client]);
      const user_status = await this.tool.checkUserinGame(decoded.id);
      try {
        await this.prisma.user.update({
          where: {
            id: +decoded.id,
          },
          data: {
            status: user_status ? 'inGame' : 'online',
          },
        });
      } catch (err) { }
    } catch (err) { }
  }

  @UseGuards(AuthGuard)
  @SubscribeMessage('Global_acceptChallenge')
  async handleAcceptChallenge(payload: any) {
    const receiver_socket = this.clients.get(+payload.senderId);
    if (receiver_socket) {
      this.server.to(receiver_socket).emit('acceptChallenge');
    }
  }

  @UseGuards(AuthGuard, InviteGuard)
  @SubscribeMessage('Global_inviteFriend')
  async handleInvite(client: any, payload: any) {
    const receiver_socket = this.clients.get(+payload.inviteFriend);
    const sender = await this.tool.getUsrId(client.user.id);
    const receiver = await this.tool.getUsrId(+payload.inviteFriend);


    const friends = await this.friendService.create({
      senderId: sender.id,
      receiverId: receiver.id,
      status: 'pending',
    });
    const notification = await this.tool.createNotification(
      null,
      friends.friend.id,
      'friends',
      `You have been invited by ${sender.fullname}`,
    );

    if (friends && notification) {
      if (receiver_socket) {
        receiver_socket.forEach((socket) => {
          this.server.to(socket).emit('inviteFriend', {
            content: `You have been invited by ${sender.fullname}`,
            id: friends.friend.id,
            avatar: sender.avatar,
            type: 'friends',
            senderId: sender.id,
            fullname: sender.fullname,
          });
        });
      }
      await this.tool.updateUser(
        payload.inviteFriend,
        receiver.unreadNotification + 1,
      );
    }
  }

  @UseGuards(AuthGuard, ChallengeGuard)
  @SubscribeMessage('Global_challengeFriend')
  async handleChallenge(client: any, payload: any) {
    const receiver_socket = this.clients.get(+payload.challengeFriend);
    const sender = await this.tool.getUsrId(client.user.id);
    const receiver = await this.tool.getUsrId(+payload.challengeFriend);

    const challenge = await this.tool.savenewChallenge(sender.id, receiver.id);
    const notification = await this.tool.createNotification(
      challenge.id,
      null,
      'challenge',
      `You have been challenged by ${sender.fullname}`,
    );
    if (challenge && notification) {
      if (receiver_socket) {
        receiver_socket.forEach((socket) => {
          this.server.to(socket).emit('challengeFriend', {
            content: `You have been challenged by ${sender.fullname}`,
            id: challenge.id,
            avatar: sender.avatar,
            type: 'challenge',
            senderId: sender.id,
            fullname: sender.fullname,
          });
        });
      }
      await this.tool.updateUser(
        payload.challengeFriend,
        receiver.unreadNotification + 1,
      );
    }
  }

  @UseGuards(AuthGuard)
  @SubscribeMessage('Global_Message')
  async handleMessageGlobal(client: any, payload: any) {
    const sender = await this.tool.getUsrId(client.user.id);
    this.sendToConversation(
      payload.conversationId,
      {
        content: payload.content,
        avatar: sender.avatar,
        conversationId: payload.conversationId,
        type: 'message',
        fullname: sender.fullname,
        senderId: sender.id,
        createdAt: new Date(),
        id: 0,
      },
      sender.id,
      "Global_message"
    );
  }

  @UseGuards(AuthGuard)
  @SubscribeMessage('Global_acceptFriend')
  async handleAccept(client: any, payload: any) {
    const receiver_socket = this.clients.get(+payload.acceptFriend);
    const sender = await this.tool.getUsrId(client.user.id); // sender
    const receiver = await this.tool.getUsrId(+payload.acceptFriend);
    const friend = await this.friendService.findTwoFriends(
      sender.id,
      receiver.id,
    );
    await this.friendService.update(friend.friends[0].id, {
      status: 'accepted',
    });
    const notification = await this.tool.createNotification(
      null,
      friend.friends[0].id,
      'accepted',
      `You have been accepted by ${sender.fullname}`,
    );
    if (friend && notification) {
      if (receiver_socket) {
        receiver_socket.forEach((socket) => {
          this.server.to(socket).emit('acceptFriend', {
            content: `You have been accepted by ${sender.fullname}`,
            id: friend.friends[0].id,
            avatar: sender.avatar,
            type: 'friends',
            senderId: sender.id,
            fullname: sender.fullname,
          });
        });
      }
      await this.tool.updateUser(
        payload.acceptFriend,
        receiver.unreadNotification + 1,
      );
    }
  }

  @SubscribeMessage('Chat_message')
  @UseGuards(AuthGuard, SendMessageGuard)
  async handleMessage(client: any, payload: any) {
    const conversationId = payload.conversationId;
    const token = client.handshake.headers.cookie
      .split('token=')[1]
      .split(';')[0];
    const decoded = await this.jwtService.verifyAsync(token);
    const senderId = this.userService.findOne(decoded.id);

    if (
      (await this.conversationService.findOneByCId(conversationId)).status !=
      200
    ) {
      const result = await this.tool.newConversation(payload, decoded.id);
      if (result.status === 200) {
        const sender = await senderId;
        const message: Message = {
          id: result.data.id,
          content: result.data.content,
          senderId: result.data.senderId,
          createdAt: result.data.createdAt,
          conversationId: result.data.conversationId,
          fullname: sender.data.fullname,
          avatar: sender.data.avatar,
          type: result.data.type,
        };
        this.sendToConversation(result.data.cid, message, decoded.id);
      }
    } else {
      const result = await this.tool.conversationExist(payload, decoded.id);
      if (result.status === 200) {
        const sender = await senderId;
        const message: Message = {
          id: result.data.id,
          content: result.data.content,
          senderId: result.data.senderId,
          createdAt: result.data.createdAt,
          conversationId: result.data.conversationId,
          fullname: sender.data.fullname,
          avatar: sender.data.avatar,
          type: result.data.type,
        };
        this.sendToConversation(conversationId, message, decoded.id);
      }
    }
  }

  async sendToConversation(
    conversationId: string,
    message: Message,
    senderId: number,
    type?: string,
  ) {
    const users = await this.tool.getConversationClients(conversationId);
    users.forEach(async (user) => {
      if (this.clients.has(user) && user != senderId && await this.userService.checkUserBlocked(user, senderId) == false) {
        this.clients.get(user).forEach((client) => {
          this.server.to(client).emit(type || 'message', message);
        });
      }
    });
  }

  async handleDisconnect(client: any) {
    try {
      if (!client.handshake.headers.cookie) return;
      const token = client.handshake.headers.cookie
        .split('token=')[1]
        .split(';')[0];
      const decoded = await this.jwtService.verifyAsync(token);
      // delet client.id from users
      const user = this.clients.get(decoded.id);
      if (user) {
        const index = user.indexOf(client.id);
        if (index > -1) {
          user.splice(index, 1);
        }
      }
      await this.prisma.user.update({
        where: {
          id: +decoded.id,
        },
        data: {
          status: 'offline',
          lastSeen: new Date(),
        },
      });
    } catch (err) {
    }
  }
}
