import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import room from './game';
import Tools from './tools';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthGuard } from '../Guard/Auth.guard';
import { toJSON } from 'flatted';

export const Rooms = [];

let room_index: number = 0, start = true;

@WebSocketGateway({
  cors: '*',
  namespace: '/global',
})

export class MyGateWay {
  @WebSocketServer()
  server: Server;
  private tools: Tools;
  constructor(private prisma: PrismaService) {
    this.tools = new Tools(this.prisma);
  }

  purgeRoom = (client) => {
    let index = -1;
    if (Rooms) {
      const room = Rooms.find(
        (room) => room.AdminId === client.id || room.MeetId === client.id,
      );

      if (room) {
        room.timeEnd = performance.now();
        if (room.AdminId && room.MeetId) {
          this.tools.main(room);
        }
        this.server.emit("watch-disconnect", { RoomId: room.RoomID });
        index = Rooms.map((index) => index.RoomID).indexOf(room.RoomID);
        if (index >= 0) Rooms.splice(index, 1);
        this.server.to(room.RoomID).emit('meet-disconnected');
        const availableRooms = Rooms.filter((room) => room.Player2 === false);
        this.server.emit("Rooms-Change", toJSON(availableRooms));
      }
    }
  }

  handleConnection(client: Socket) {
  }

  handleDisconnect(client: any) {
    this.purgeRoom(client);
  }

  @UseGuards(AuthGuard)
  @SubscribeMessage('disconnect-regular')
  onDisconnect(@ConnectedSocket() client: any) {
    this.purgeRoom(client);
  };

  @UseGuards(AuthGuard)
  @SubscribeMessage("get-Rooms")
  sendRooms(@ConnectedSocket() socket) {
    const availableRooms = Rooms.filter((room) => room.Player2 === false);
    this.server.to(socket.id).emit("get-rooms", toJSON(availableRooms));
  }

  @UseGuards(AuthGuard)
  @SubscribeMessage("get-Player-Data")
  async getPlayerData(@MessageBody() body: any, @ConnectedSocket() socket) {
    const room = Rooms.find((room) => room.RoomID === body.roomId);
    if (room) {
      const { fullname: Admin_fullName, avatar: Admin_avatar, table_style: Admin_table_style, playerStats: Admin_player_state, tier: Admin_tier } = await this.tools.getUsrId(room.dbAdminId);
      const { fullname: Meet_fullName, avatar: Meet_avatar, table_style: Meet_table_style, playerStats: Meet_player_state, tier: Meet_tier } = await this.tools.getUsrId(room.dbMeetId);
      this.server.to(socket.id).emit("get-Player-Data", { Meet_fullName, Meet_avatar, Meet_table_style, Admin_fullName, Admin_avatar, Admin_table_style, Admin_player_state, Admin_tier, Meet_player_state, Meet_tier });
    }
  }

  @UseGuards(AuthGuard)
  @SubscribeMessage('join-room')
  async onMessage(@ConnectedSocket() socket) {
    const availableRoom = Rooms.find((room) => room.Player2 === true);
    if (availableRoom?.dbAdminId && availableRoom.dbAdminId === socket.user.id) {
      this.server.to(socket.id).emit("already-in-game");
      return;
    }

    if (Rooms.length === 0 || !availableRoom) {
      const { fullname: Admin_fullName, avatar: Admin_avatar, table_style: Admin_table_style, playerStats: Admin_player_state, tier: Admin_tier } = await this.tools.getUsrId(socket.user.id);
      const initRoom = new room(performance.now().toString(), true, socket.id, socket.user.id, Admin_avatar, Admin_fullName, Admin_player_state, Admin_tier);
      socket.join(initRoom.RoomID);
      Rooms.push(initRoom);
      this.server.to(socket.id).emit('isAdmin', { isAdmin: 'true' });
      this.server.to(socket.id).emit("user-data-Admin-regular", { Meet_fullName: "Guest", Meet_avatar: null, Meet_table_style: 0, Meet_player_state: {}, Meet_tier: {}, Admin_fullName, Admin_avatar, Admin_table_style, Admin_player_state, Admin_tier });
    } else {
      availableRoom.dbMeetId = socket.user.id;
      const { fullname: Admin_fullName, avatar: Admin_avatar, table_style: Admin_table_style, playerStats: Admin_player_state, tier: Admin_tier } = await this.tools.getUsrId(availableRoom.dbAdminId);
      const { fullname: Meet_fullName, avatar: Meet_avatar, table_style: Meet_table_style, playerStats: Meet_player_state, tier: Meet_tier } = await this.tools.getUsrId(availableRoom.dbMeetId);

      availableRoom.Player2 = false;
      availableRoom.MeetId = socket.id;
      availableRoom.Meet_Avatar = Meet_avatar;
      availableRoom.Meet_FullName = Meet_fullName;
      availableRoom.Meet_player_state = Meet_player_state;
      availableRoom.Meet_tier = Meet_tier;
      socket.join(availableRoom.RoomID);

      this.server
        .to([availableRoom.AdminId, availableRoom.MeetId])
        .emit('meet-joined');


      this.server.to(availableRoom.AdminId).emit('user-data-regular', { Meet_fullName, Meet_avatar, Meet_table_style, Admin_fullName, Admin_avatar, Admin_table_style, Admin_player_state, Admin_tier, Meet_player_state, Meet_tier });
      this.server.to(availableRoom.MeetId).emit('user-data-regular', { Meet_fullName: Admin_fullName, Meet_avatar: Admin_avatar, Meet_table_style: Admin_table_style, Admin_fullName: Meet_fullName, Admin_avatar: Meet_avatar, Admin_table_style: Meet_table_style, Admin_player_state: Meet_player_state, Admin_tier: Meet_tier, Meet_player_state: Admin_player_state, Meet_tier: Admin_tier });

      availableRoom.timeStart = performance.now();
      availableRoom.start();

      if (availableRoom.AdminId && availableRoom.MeetId) {
        this.tools.saveGame(availableRoom);
        this.tools.updateUserStatus(availableRoom.dbAdminId, "inGame");
        this.tools.updateUserStatus(availableRoom.dbMeetId, "inGame");
      }
      this.server.emit("Rooms-Change", toJSON(Rooms));
      if (start) {
        setInterval(() => {
          if (Rooms[room_index]) {
            this.server.to(Rooms[room_index].RoomID).emit('Drawx', {
              ballX: Rooms[room_index].ballX,
              ballY: Rooms[room_index].ballY,
              playerYAdmin: Rooms[room_index].paddleOne,
              playerYMeet: Rooms[room_index].paddleTwo,
              AdminScore: Rooms[room_index].AdminScore,
              MeetScore: Rooms[room_index].MeetScore,
            });
            this.server.emit('watch', {
              ballX: Rooms[room_index].ballX,
              ballY: Rooms[room_index].ballY,
              playerYAdmin: Rooms[room_index].paddleOne,
              playerYMeet: Rooms[room_index].paddleTwo,
              AdminScore: Rooms[room_index].AdminScore,
              MeetScore: Rooms[room_index].MeetScore,
              RoomId: Rooms[room_index].RoomID,
            });
            if (room_index === Rooms.length - 1) room_index = 0;
            else room_index++;
            if (
              Rooms[room_index].AdminScore === 8 ||
              Rooms[room_index].MeetScore === 8
            ) {
              Rooms[room_index].timeEnd = performance.now();
              if (Rooms[room_index].AdminId && Rooms[room_index].MeetId) {
                this.tools.main(Rooms[room_index]);
              }
              this.server.to(Rooms[room_index].RoomID).emit('Drawx', {
                AdminScore: Rooms[room_index].AdminScore,
                MeetScore: Rooms[room_index].MeetScore,
              });
              this.server.emit("watch-disconnect", { RoomId: Rooms[room_index].RoomID });
              Rooms.splice(room_index, 1);
              room_index = 0;
              this.server.emit("Rooms-Change", toJSON(Rooms));
            }
          }
        }, 6);
        start = false;
      }
    }
  }
  @SubscribeMessage('coordinates_Admin')
  onReceivingAdmin(@MessageBody() body: any, @ConnectedSocket() client) {
    if (body.playerY < 0 || body.playerY > 100) return;
    const room = Rooms.find((room) => room.AdminId === client.id);
    if (room) room.paddleOne = body.playerY;
  }
  @SubscribeMessage('coordinates_Meet')
  onReceivingMeet(@MessageBody() body: any, @ConnectedSocket() client) {
    if (body.playerY < 0 || body.playerY > 100) return;
    const room = Rooms.find((room) => room.MeetId === client.id);
    if (room) room.paddleTwo = body.playerY;
  }
}
