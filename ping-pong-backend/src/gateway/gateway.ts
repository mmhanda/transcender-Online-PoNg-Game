import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
// import { Body, OnModuleInit } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

const width:number = 650, height:number = 400;

let scoreLeft:number, scoreRigth:number = 0;

class elem {
  x: any
  y: any
  width: any
  height: any
  color: any
  speed: any
  gravity: any
    constructor(options) {
        this.x = options.x;
        this.y = options.y;
        this.width = options.width;
        this.height = options.height;
        this.color = options.color;
        this.speed = options.speed || 2;
        this.gravity = options.gravity;
    }
}

const player1 = new elem({
    x: 10,
    y: 160,
    width: 15,
    height: 80,
    color: "#fff",
    gravity: 2,
})

const player2 = new elem({
    x: 625,
    y: 160,
    width: 15,
    height: 80,
    color: '#fff',
    gravity: 2,
});

const ball = new elem({
    x: width / 2,
    y: height / 2,
    width: 15,
    height: 15,
    color: '#fff',
    speed: 1,
    gravity: 1
});

function drawelem(elem) {
    // console.log(elem);
    // context.fillStyle = elem.color;
    // context.fillRect(elem.x, elem.y, elem.width, elem.height);
}

function displayscore1() {
    // context.font = "10px Arial";
    // context.fillStyle = "#fff";
    // context.fillText(scoreLeft, width / 2 - 60, 30);
}

function displayscore2() {
    // context.font = "10px Arial";
    // context.fillStyle = "#fff";
    // context.fillText(scoreRigth, width / 2 + 60, 30);
}

function drawAll() {
    drawelem(player1);
    drawelem(player2);
    drawelem(ball);
    displayscore1();
    displayscore2();
}

function ballWallCollision() {
    if ((ball.y + ball.gravity <= player2.y + player2.height &&
         ball.x + ball.width + ball.speed >= player2.x && 
         ball.y + ball.gravity > player2.y) || (ball.y + ball.gravity > player1.y && ball.x + ball.speed <= player1.x + player1.width)) {
        ball.speed *= -1;
    } else if (ball.x + ball.speed < player1.x) {
        scoreLeft += 1;
        ball.speed = ball.speed * -1;
        ball.x = 100 + ball.speed;
        ball.y += ball.gravity;
    } else if (ball.x + ball.speed > player2.x + player2.width) {
        scoreRigth += 1;
        ball.speed = ball.speed * -1;
        ball.x = 100 + ball.speed;
        ball.y += ball.gravity;
    }
    drawAll();
}

function ballBounce() {
    if (ball.y + ball.gravity <= 0 || ball.y + ball.gravity >= height) {
        ball.gravity *= -1;
        ball.y += ball.gravity;
        ball.x += ball.speed;
    } else {
        ball.y += ball.gravity;
        ball.x += ball.speed;
    }
    ballWallCollision();
}

function keys(e) {
    const key = e.key;
    if (key == 'w' && player1.y - player1.gravity > 0) {
        player1.y -= player1.gravity * 4;
    } else if (key == 's' && player1.height + player1.y + player1.gravity < height) {
        player1.y += player1.gravity * 4;
    }
    if (key == 'i' && player2.y - player2.gravity > 0) {
        player2.y -= player2.gravity * 4;
    } else if (key == 'k' && player2.height + player2.y + player2.gravity < height) {
        player2.y += player2.gravity * 4;
    }
}

function while_loop() {
  while(1) {
    ballBounce();
  }
}

// while_loop();


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
      });
    }
  }
  @SubscribeMessage('room-score')
  onDisconnect(@MessageBody() body: any) {
    console.error(body);
  }
}
