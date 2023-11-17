import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
// import { Body, OnModuleInit } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import room from './game';

const Rooms = [];
let room_index: number = 0;

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
    if (room_index === -1)
      room_index = 0;
    // console.log(`Client connected with ID: ${client.id}`);
  }
  handleDisconnect(client: any) {
    let index = -1;
    if (Rooms) {
      const room = Rooms.find(
        (room) => room.AdminId === client.id || room.MeetId === client.id,
        );

      if (room) {
        index = Rooms.map((index) => index.roomId).indexOf(room.roomId);
        if (index >= 0) Rooms.splice(index, 1);
        console.error("index: " + index);
        if (room_index === 0)
        room_index = -1;
      }
    }
  }

  @SubscribeMessage('join-room')
  onMessage(@MessageBody() body: any, @ConnectedSocket() socket) {
    const availableRoom = Rooms.find((room) => room.Player2 === true);
    
    if (Rooms.length === 0 || !availableRoom) {
      const initRoom = new room(Date.now().toString(), true, socket.id);
      socket.join(initRoom.roomId);
      Rooms.push(initRoom);
      this.server.emit('isAdmin', { isAdmin: 'true' });
    } else {
      availableRoom.Player2 = false;
      availableRoom.MeetId = socket.id;
      socket.join(availableRoom.roomId);
      availableRoom.start();
      if (Rooms.length <= 1) {
        setInterval(()=> {
          if (Rooms[room_index]) {
          // console.log(room_index);
          this.server.sockets.in(Rooms[room_index].roomId).emit('Drawx', {
            ballX: Rooms[room_index].ballX,
            ballY: Rooms[room_index].ballY,
            playerYAdmin: Rooms[room_index].paddleOne,
            playerYMeet: Rooms[room_index].paddleTwo,
          })
          if (room_index === Rooms.length - 1)
            room_index = 0;
          else room_index ++;
      }
        }, 0)
      }
      this.server.emit('meet-joined');
      this.server.emit('isAdmin', { isAdmin: 'false' });
    }
  }
  @SubscribeMessage('coordinates_Admin')
  onReceivingAdmin(@MessageBody() body: any, @ConnectedSocket() client) {
    const room = Rooms.find((room) => room.AdminId === client.id);
    if (room) room.paddleOne = body.playerY;
  }
  @SubscribeMessage('coordinates_Meet')
  onReceivingMeet(@MessageBody() body: any, @ConnectedSocket() client) {
    const room = Rooms.find((room) => room.MeetId === client.id);
    if (room) room.paddleTwo = body.playerY;
  }
}
