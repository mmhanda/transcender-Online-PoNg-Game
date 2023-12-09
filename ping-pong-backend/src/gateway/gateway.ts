import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import room from './game';

export const Rooms = [];

let room_index: number = 0;

@WebSocketGateway({
  cors: '*',
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
        index = Rooms.map((index) => index.RoomID).indexOf(room.RoomID);
        if (index >= 0) Rooms.splice(index, 1);
      }
    }
  }

  @SubscribeMessage('join-room')
  onMessage(@MessageBody() body: any, @ConnectedSocket() socket) {
    const availableRoom = Rooms.find((room) => room.Player2 === true);

    if (Rooms.length === 0 || !availableRoom) {
      const initRoom = new room(performance.now().toString(), true, socket.id);
      socket.join(initRoom.RoomID);
      Rooms.push(initRoom);
      this.server.to(socket.id).emit('isAdmin', { isAdmin: 'true' });
    } else {
      availableRoom.Player2 = false;
      availableRoom.MeetId = socket.id;
      socket.join(availableRoom.RoomID);

      this.server
        .to([availableRoom.AdminId, availableRoom.MeetId])
        .emit('launch-game');

      availableRoom.timeStart = performance.now();
      availableRoom.start();

      if (Rooms.length <= 1) {
        setInterval(() => {
          if (Rooms[room_index]) {
            this.server.sockets.in(Rooms[room_index].RoomID).emit('Drawx', {
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
              this.server.sockets.in(Rooms[room_index].RoomID).emit('Drawx', {
                AdminScore: Rooms[room_index].AdminScore,
                MeetScore: Rooms[room_index].MeetScore,
              });
              Rooms.splice(room_index, 1);
              room_index = 0;
            }
          }
        }, 0);
      }
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
