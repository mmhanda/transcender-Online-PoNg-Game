import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { OnModuleInit } from '@nestjs/common';
import { Server } from 'socket.io';
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
export class MyGateWay implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  onModuleInit() {
    //we used this interface
    // to wait for the model to fully init so websocket not null/empty
    this.server.on('connection', (socket) => {
      console.log(socket.id);
      console.log('connected');
    });
  }
  @SubscribeMessage('join-room')
  onMessage(@MessageBody() body: any, @ConnectedSocket() socket) {
    const availableRoom = Rooms.find((room) => room.Player2 === true);

    if (Rooms.length === 0 || !availableRoom) {
      const initRoom = new room(Date.now().toString(), true, socket.id);
      socket.join(initRoom.name);
      Rooms.push(initRoom);
      this.server.emit('isAdmin', { isAdmin: 'true' });
      console.error('ADMIN CONNECTED');
    } else {
      availableRoom.Player2 = false;
      availableRoom.MeetId = socket.id;
      socket.join(availableRoom.name);
      this.server.emit('isAdmin', { isAdmin: 'false' });
      console.error('MEET CONNECTED');
    }
    console.log(Rooms.length);

    console.log('join-game');
    this.server.emit('onMessage', { content: 'You are Connected', msg: body });
    this.server.emit('specialEvent', { event: 'specialEvent' });
    console.log(body);
  }
  @SubscribeMessage('coordinates_Admin')
  onReceivingAdmin(@MessageBody() body: any, @ConnectedSocket() socket: any) {
    const senderIsAdmin = Rooms.find((room) => room.AdminId === socket.id);
    const senderIsMeet = Rooms.find((room) => room.MeetId === socket.id);

    if (body.playerY) {
      this.server.emit('Player-2-Meet', { playerY: body.playerY });
    }
    if (body.rect) {
      this.server.emit('Player-2-Meet', { rect: body.rect });
    }
    if (body.ballX && body.ballY && body.ballRect) {
      this.server.emit('Player-2-Meet', {
        ballX: body.ballX,
        ballY: body.ballY,
        ballRect: body.ballRect,
      });
      console.error('ballRect ' + body.ballRect);
      // console.error('ballX ' + body.ballX + ' ballY ' + body.ballY);
    }
    // }
  }
  @SubscribeMessage('coordinates_Meet')
  onReceivingMeet(@MessageBody() body: any, @ConnectedSocket() socket: any) {
    const senderIsAdmin = Rooms.find((room) => room.AdminId === socket.id);
    const senderIsMeet = Rooms.find((room) => room.MeetId === socket.id);

    // if (senderIsMeet) {
    // console.log('coordinates_Meet ' + body.playerY);
    // console.log('Rect_Meet ' + JSON.stringify(body.rect));
    if (body.playerY) {
      this.server.emit('Player-2-Admin', { playerY: body.playerY });
    }
    if (body.rect) {
      this.server.emit('Player-2-Admin', { rect: body.rect });
    }
    // }
  }
}
