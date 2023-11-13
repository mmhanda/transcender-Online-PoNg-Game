import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
// import { Body, OnModuleInit } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
const Rooms = [];

class room {
  name: string;
  Player2: boolean;
  AdminId: string;
  MeetId: string;
  constructor(name: string, Player2: boolean, admin: string) {
    this.name = name;
    this.Player2 = Player2;
    this.AdminId = admin;
  }
}

@WebSocketGateway({
  cors: {
    origin: '*',
    // origin: ['http://localhost:3000'],
  },
})
export class MyGateWay {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    // console.log(`Client connected with ID: ${client.id}`);
  }
  handleDisconnect(client: any) {
    let index = -1;
    if (Rooms) {
      const room = Rooms.find(
        (room) => room.AdminId === client.id || room.MeetId === client.id,
      );

      if (room) {
        index = Rooms.map((index) => index.name).indexOf(room.name);
        this.server.to(room.AdminId).emit('admin-disconnect');
        this.server.to(room.MeetId).emit('meet-disconnect');
      }
      // console.error('Rooms.length before  ' + Rooms.length);
      if (index >= 0) Rooms.splice(index, 1);
      // console.error('Rooms.length after ' + Rooms.length);
    }
  }

  @SubscribeMessage('join-room')
  onMessage(@MessageBody() body: any, @ConnectedSocket() socket) {
    const availableRoom = Rooms.find((room) => room.Player2 === true);

    if (Rooms.length === 0 || !availableRoom) {
      const initRoom = new room(Date.now().toString(), true, socket.id);
      socket.join(initRoom.name);
      Rooms.push(initRoom);
      this.server.emit('isAdmin', { isAdmin: 'true' });
    } else {
      availableRoom.Player2 = false;
      availableRoom.MeetId = socket.id;
      socket.join(availableRoom.name);
      this.server.emit('meet-joined');
      this.server.emit('isAdmin', { isAdmin: 'false' });
    }
  }
  @SubscribeMessage('coordinates_Admin')
  onReceivingAdmin(@MessageBody() body: any, @ConnectedSocket() client) {
    const room = Rooms.find((room) => room.AdminId === client.id);

    if (room) {
      this.server.to(room.MeetId).emit('Player-2-Meet', {
        ballX: body.ballX,
        ballY: body.ballY,
        playerY: body.playerY,
        adminScore: body.adminScore,
        player2Score: body.player2Score,
      });
    }
  }
  @SubscribeMessage('coordinates_Meet')
  onReceivingMeet(@MessageBody() body: any, @ConnectedSocket() client) {
    const room = Rooms.find((room) => room.MeetId === client.id);

    if (room) {
      this.server.to(room.AdminId).emit('Player-2-Admin', {
        playerY: body.playerY,
        rect: body.rect,
      });
    }
  }
  @SubscribeMessage('room-score')
  onDisconnect(@MessageBody() body: any) {
    console.error(body);
  }
}
