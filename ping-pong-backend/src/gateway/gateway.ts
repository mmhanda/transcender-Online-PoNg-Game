import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Body, OnModuleInit } from '@nestjs/common';
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
    origin: ['http://localhost:3000'], // table for the allowed domain names to connect
  },
})
export class MyGateWay {
  @WebSocketServer()
  server: Server;

  // onModuleInit() {
  //   //we used this interface
  //   // to wait for the model to fully init so websocket not null/empty
  //   this.server.on('connection', (socket) => {
  //     console.log('connected ', socket.id);
  //   });
  //   this.server.on('disconnect', (socket) => {
  //     console.log('connected ', socket.id);
  //   });
  // }

  handleConnection(client: Socket) {
    console.log(`Client connected with ID: ${client.id}`);
  }
  handleDisconnect(client: any) {
    console.error('DISCONNECT ', client.id);
  }

  @SubscribeMessage('join-room')
  onMessage(@MessageBody() body: any, @ConnectedSocket() socket) {
    const availableRoom = Rooms.find((room) => room.Player2 === true);

    if (Rooms.length === 0 || !availableRoom) {
      const initRoom = new room(Date.now().toString(), true, socket.id);
      socket.join(initRoom.name);
      Rooms.push(initRoom);
      this.server.emit('isAdmin', { isAdmin: 'true' });
      // console.error('ADMIN CONNECTED');
    } else {
      availableRoom.Player2 = false;
      availableRoom.MeetId = socket.id;
      socket.join(availableRoom.name);
      this.server.emit('isAdmin', { isAdmin: 'false' });
      // console.error('MEET CONNECTED');
    }
    console.log(Rooms.length);

    console.log('join-room');
  }
  @SubscribeMessage('coordinates_Admin')
  onReceivingAdmin(@MessageBody() body: any) {
    this.server.emit('Player-2-Meet', {
      ballX: body.ballX,
      ballY: body.ballY,
      playerY: body.playerY,
      rect: body.rect,
      hue: body.hue,
      adminScore: body.adminScore,
      player2Score: body.player2Score,
    });
  }
  @SubscribeMessage('coordinates_Meet')
  onReceivingMeet(@MessageBody() body: any) {
    this.server.emit('Player-2-Admin', {
      playerY: body.playerY,
      rect: body.rect,
    });
  }
  @SubscribeMessage('pause-game')
  onDisconnect(@MessageBody() body: any) {
    console.error(body.state);
    this.server.emit('game-paused', {
      state: body.state,
    });
    console.error('vvvvvvvvv');
  }
}
