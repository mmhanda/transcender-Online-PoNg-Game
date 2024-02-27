import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import room from './gameCustom';
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

export class MyGateWayCustom {
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
        this.server.to(room.RoomID).emit('meet-disconnected-custom');
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
  @SubscribeMessage('disconnect-custom')
  onDisconnect(@ConnectedSocket() client: any) {
    this.purgeRoom(client);
  };

  @UseGuards(AuthGuard)
  @SubscribeMessage("get-Rooms-custom")
  sendRooms(@ConnectedSocket() socket) {
    const availableRooms = Rooms.filter((room) => room.Player2 === false);
    this.server.to(socket.id).emit("get-rooms-custom", toJSON(availableRooms));
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
  @SubscribeMessage('join-room-custom')
  async onMessage(@MessageBody() body: any, @ConnectedSocket() socket) {
    
    let availableRoom = Rooms.find((room) => room.dbMeetId === socket.user.id.toString());
    if (availableRoom && body?.CreateOrJoin === 'create') availableRoom = null;

    if ((Rooms.length === 0 || !availableRoom) && body?.CreateOrJoin === 'create') {
      const { fullname: Admin_fullName, avatar: Admin_avatar, table_style: Admin_table_style, playerStats: Admin_player_state, tier: Admin_tier } = await this.tools.getUsrId(socket.user.id);
      const { fullname: Meet_fullName, avatar: Meet_avatar, playerStats: Meet_player_state, tier: Meet_tier } = await this.tools.getUsrId(+body.MeetId);
      const initRoom = new room(performance.now().toString(), true, socket.id, socket.user.id, body.MeetId, Admin_avatar, Admin_fullName, Meet_avatar, Meet_fullName, Admin_player_state, Meet_player_state, Admin_tier, Meet_tier);
      socket.join(initRoom.RoomID);
      Rooms.push(initRoom);
      this.server.to(socket.id).emit('isAdminCustom', { isAdmin: 'true' });

      this.server.to(socket.id).emit("user-data-Admin-Custom", { Meet_fullName: "Guest", Meet_avatar: null, Meet_table_style: 0, Meet_player_state: {}, Meet_tier: {}, Admin_fullName, Admin_avatar, Admin_table_style, Admin_player_state, Admin_tier });

    } else if (availableRoom && body?.CreateOrJoin === 'join') {
      availableRoom.dbMeetId = socket.user.id;
      const { fullname: Admin_fullName, avatar: Admin_avatar, table_style: Admin_table_style, playerStats: Admin_player_state, tier: Admin_tier } = await this.tools.getUsrId(availableRoom.dbAdminId);
      const { fullname: Meet_fullName, avatar: Meet_avatar, table_style: Meet_table_style, playerStats: Meet_player_state, tier: Meet_tier } = await this.tools.getUsrId(availableRoom.dbMeetId);

      availableRoom.Player2 = false;
      availableRoom.MeetId = socket.id;
      availableRoom.Meet_Avatar = Meet_avatar;
      socket.join(availableRoom.RoomID);

      this.server
        .to([availableRoom.AdminId, availableRoom.MeetId])
        .emit('meet-joined-custom');

      this.server.to(availableRoom.AdminId).emit('user-data-Custom', { Meet_fullName, Meet_avatar, Meet_table_style, Admin_fullName, Admin_avatar, Admin_table_style, Admin_player_state, Admin_tier, Meet_player_state, Meet_tier });
      this.server.to(availableRoom.MeetId).emit('user-data-Custom', { Meet_fullName: Admin_fullName, Meet_avatar: Admin_avatar, Meet_table_style: Admin_table_style, Admin_fullName: Meet_fullName, Admin_avatar: Meet_avatar, Admin_table_style: Meet_table_style, Admin_player_state: Meet_player_state, Admin_tier: Meet_tier, Meet_player_state: Admin_player_state, Meet_tier: Admin_tier });
      availableRoom.timeStart = performance.now();
      availableRoom.start();

      if (availableRoom.AdminId && availableRoom.MeetId) {
        this.tools.saveGame(availableRoom);
        this.tools.updateUserStatus(availableRoom.dbAdminId, "inGame");
        this.tools.updateUserStatus(availableRoom.dbMeetId, "inGame");
      }
      this.server.emit("Rooms-Change-custom", toJSON(Rooms));
      if (start) {
        setInterval(() => {
          if (Rooms[room_index]) {
            this.server.to(Rooms[room_index].RoomID).emit('DrawCustom', {
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
              this.server.to(Rooms[room_index].RoomID).emit('DrawCustom', {
                AdminScore: Rooms[room_index].AdminScore,
                MeetScore: Rooms[room_index].MeetScore,
              });
              this.server.emit("watch-disconnect", { RoomId: Rooms[room_index].RoomID });
              Rooms.splice(room_index, 1);
              room_index = 0;
              this.server.emit("Rooms-Change-custom", toJSON(Rooms));
            }
          }
        }, 6);
        start = false;
      }
    }
  }
  @SubscribeMessage('coordinates_Admin_custom')
  onReceivingAdmin(@MessageBody() body: any, @ConnectedSocket() client) {
    if (body.playerY < 0 || body.playerY > 100) return;
    const room = Rooms.find((room) => room.AdminId === client.id);
    if (room) room.paddleOne = body.playerY;
  }
  @SubscribeMessage('coordinates_Meet_custom')
  onReceivingMeet(@MessageBody() body: any, @ConnectedSocket() client) {
    if (body.playerY < 0 || body.playerY > 100) return;
    const room = Rooms.find((room) => room.MeetId === client.id);
    if (room) room.paddleTwo = body.playerY;
  }
}