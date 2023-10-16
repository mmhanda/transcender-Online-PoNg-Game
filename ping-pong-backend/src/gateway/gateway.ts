import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { OnModuleInit } from '@nestjs/common';
import { Server } from 'socket.io';

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
  @SubscribeMessage('newMessage')
  onMessage(@MessageBody() body: any) {
    this.server.emit('onMessage', { content: 'You are Connected', msg: body });
    this.server.emit('specialEvent', { event: 'specialEvent' });
    console.log(body);
  }
}
