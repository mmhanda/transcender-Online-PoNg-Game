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
    } else {
      availableRoom.Player2 = false;
      availableRoom.MeetId = socket.id;
      socket.join(availableRoom.name);
    }
    console.log(Rooms.length);

    console.log('join-game');
    this.server.emit('onMessage', { content: 'You are Connected', msg: body });
    this.server.emit('specialEvent', { event: 'specialEvent' });
    console.log(body);
  }
  @SubscribeMessage('coordinates')
  onReceiving(@MessageBody() body: any, @ConnectedSocket() socket: any) {
    const senderIsAdmin = Rooms.find((room) => room.AdminId === socket.id);
    const senderIsMeet = Rooms.find((room) => room.AdminId === socket.id);

    console.error(body);
    if (senderIsAdmin || senderIsMeet) {
      this.server.to(senderIsAdmin.name).emit('Player-2-Paddle', body);
      console.log('coordinates');
    }
  }
}
