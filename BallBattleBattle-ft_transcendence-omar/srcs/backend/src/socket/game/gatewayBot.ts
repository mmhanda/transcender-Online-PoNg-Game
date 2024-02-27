import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import room from './gameBot';
import { AuthGuard } from '../Guard/Auth.guard';
import Tools from './tools';
import { PrismaService } from 'src/prisma/prisma.service';

export const Rooms = [];

let room_index: number = 0, start = true;

const purgeRoom = (client) => {

  let index = -1;

  if (Rooms) {
    const room = Rooms.find(
      (room) => room.AdminId === client.id || room.MeetId === client.id,
    );

    if (room) {
      index = Rooms.map((index) => index.RoomID).indexOf(room.RoomID);
      if (index >= 0) Rooms.splice(index, 1);
    }
  }
}

@WebSocketGateway({
  cors: '*',
  namespace: '/global',
})
export class MyGateWayBot {
  @WebSocketServer()
  server: Server;
  private tools: Tools;
  constructor(private prisma: PrismaService) {
    this.tools = new Tools(this.prisma);
  }
  handleConnection(client: Socket) { }

  handleDisconnect(client: any) {
    purgeRoom(client);
  }

  @UseGuards(AuthGuard)
  @SubscribeMessage('disconnect-bot')
  onDisconnect(@ConnectedSocket() client: any) {
    purgeRoom(client);
  };

  @UseGuards(AuthGuard)
  @SubscribeMessage('join-room-bot')
  async onMessage(@MessageBody() body: any, @ConnectedSocket() socket) {
    const initRoom = new room(performance.now().toString(), true, socket.id);
    socket.join(initRoom.RoomID);
    Rooms.push(initRoom);
    initRoom.timeStart = performance.now();
    initRoom.start();

    const { fullname, avatar, table_style, playerStats, tier } = await this.tools.getUsrId(socket.user.id);
    this.server.to(socket.id).emit("user-data-bot", { fullname, avatar, table_style, playerStats, tier });
    if (start) {
      setInterval(() => {
        if (Rooms[room_index]) {
          this.server.to(Rooms[room_index].RoomID).emit('DrawBot', {
            ballX: Rooms[room_index].ballX,
            ballY: Rooms[room_index].ballY,
            playerYMeet: Rooms[room_index].paddleTwo,
            AdminScore: Rooms[room_index].AdminScore,
            MeetScore: Rooms[room_index].MeetScore,
          });
          if (room_index === Rooms.length - 1) room_index = 0;
          else room_index++;
          if (
            Rooms[room_index].AdminScore === 8 ||
            Rooms[room_index].MeetScore === 8
          ) {
            Rooms[room_index].timeEnd = performance.now();
            this.server.to(Rooms[room_index].RoomID).emit('DrawBot', {
              AdminScore: Rooms[room_index].AdminScore,
              MeetScore: Rooms[room_index].MeetScore,
            });
            Rooms.splice(room_index, 1);
            room_index = 0;
          }
        }
      }, 6);
      start = false;
    }
  }
  @SubscribeMessage('coordinates_Admin_Bot')
  onReceivingAdmin(@MessageBody() body: any, @ConnectedSocket() client) {
    if (body.playerY < 0 || body.playerY > 100) return;
    const room = Rooms.find((room) => room.AdminId === client.id);
    if (room) room.paddleOne = body.playerY;
  }

  async getUsrId(client: number) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: client,
        },
      });
      return user;
    }
    catch (err) {
    }
  }
}
