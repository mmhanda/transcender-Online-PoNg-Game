import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { OnModuleInit } from '@nestjs/common';
import { Server } from 'socket.io';

@WebSocketGateway()
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
  @SubscribeMessage('newMessage')
  onMessage(@MessageBody() body: any) {
    this.server.emit('onMessage', { msg: 'You are Connected', body });
    this.server.emit('specialEvent', { event: 'specialEvent' });
    console.log(body);
  }
}
