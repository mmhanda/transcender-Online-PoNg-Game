import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
// import { Body, OnModuleInit } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

const width:number = 100, height:number = 100;

let scoreLeft:number, scoreRigth:number = 0;

class elem {
  x: number
  y: number
  width: number
  height: number
  color: string
  speed: number
  gravity: number
    constructor(options) {
      this.x = options.x * (width / 650);
      this.y = options.y * (height / 400);
      this.width = options.width * (width / 650);
      this.height = options.height * (height / 400);
      this.color = options.color;
      this.speed = options.speed || 2 * (width / 650);
      this.gravity = options.gravity * (height / 400);
    }
}

const Rooms = [];

class room {
  roomId: string;
  Player2: boolean;
  AdminId: string;
  MeetId: string;
  // ball_x: number;
  // ball_y: number;
  player1: elem;
  player2: elem;
  ball: elem;
  constructor(roomId: string, Player2: boolean, admin: string) {
    this.roomId = roomId;
    this.Player2 = Player2;
    this.AdminId = admin;
    this.player1 = new elem({
        x: 10,
        y: 160,
        width: 15,
        height: 80,
        color: "#fff",
        gravity: 2,
    })
  
    this.player2 = new elem({
        x: 625,
        y: 160,
        width: 15,
        height: 80,
        color: '#fff',
        gravity: 2,
    });
  
    this.ball = new elem({
        x: width / 2,
        y: height / 2,
        width: 15,
        height: 15,
        color: '#fff',
        speed: 1,
        gravity: 1
    });
  }


  // start() {
  drawelem(elem) {
      // console.log(elem);
      // context.fillStyle = elem.color;
      // context.fillRect(elem.x, elem.y, elem.width, elem.height);
  }
  
  drawBall(elem) {
    
  }
  
  displayscore1() {
      // context.font = "10px Arial";
      // context.fillStyle = "#fff";
      // context.fillText(scoreLeft, width / 2 - 60, 30);
  }
  
  displayscore2() {
      // context.font = "10px Arial";
      // context.fillStyle = "#fff";
      // context.fillText(scoreRigth, width / 2 + 60, 30);
  }
  
  drawAll() {
      // drawelem(player1);
      // drawelem(player2);
      this.drawBall(this.ball);
      // displayscore1();
      // displayscore2();
  }
  
  ballWallCollision() {
    if (
        (this.ball.y + this.ball.gravity <= this.player2.y + this.player2.height &&
            this.ball.x + this.ball.width + this.ball.speed >= this.player2.x &&
            this.ball.y + this.ball.gravity > this.player2.y) ||
        (this.ball.y + this.ball.gravity > this.player1.y &&
            this.ball.x + this.ball.speed <= this.player1.x + this.player1.width &&
            this.ball.y < this.player1.y + this.player1.height)
    ) {
        this.ball.speed *= -1;
    } else if (this.ball.x + this.ball.speed < this.player1.x) {
        scoreLeft += 1;
        this.ball.speed = this.ball.speed * -1;
        this.ball.x = width / 2;
        this.ball.y = height / 2;
    } else if (this.ball.x + this.ball.speed > this.player2.x + this.player2.width) {
        scoreRigth += 1;
        this.ball.speed = this.ball.speed * -1;
        this.ball.x = width / 2;
        this.ball.y = height / 2;
    }
    this.drawAll();
}
  
  ballBounce() {
      if (this.ball.y + this.ball.gravity <= 0 || this.ball.y + this.ball.gravity >= height) {
          this.ball.gravity *= -1;
          this.ball.y += this.ball.gravity;
          this.ball.x += this.ball.speed;
      } else {
          this.ball.y += this.ball.gravity;
          this.ball.x += this.ball.speed;
      }
      this.ballWallCollision();
  }

  while_loop() {
    setInterval(() => {
      this.ballBounce();
    }, 40);
  }

  start() {
    this.while_loop();
  }
  

  positions(paddleOne: string, paddleTwo: string) {
    if (paddleOne == 'w' && this.player1.y - this.player1.gravity > 0) {
        this.player1.y -= this.player1.gravity * 4;
    } else if (paddleOne == 's' && this.player1.height + this.player1.y + this.player1.gravity < height) {
        this.player1.y += this.player1.gravity * 4;
    }
    if (paddleTwo == 'i' && this.player2.y - this.player2.gravity > 0) {
        this.player2.y -= this.player2.gravity * 4;
    } else if (paddleTwo == 'k' && this.player2.height + this.player2.y + this.player2.gravity < height) {
        this.player2.y += this.player2.gravity * 4;
    }
  }
}

let playerYAdmin: string, playerYMeet:string;

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
        index = Rooms.map((index) => index.roomId).indexOf(room.roomId);
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
      socket.join(initRoom.roomId);
      Rooms.push(initRoom);
      this.server.emit('isAdmin', { isAdmin: 'true' });
    } else {
      availableRoom.Player2 = false;
      availableRoom.MeetId = socket.id;
      socket.join(availableRoom.roomId);
      availableRoom.start();
      setInterval(()=> {
        availableRoom.positions(playerYAdmin, playerYMeet);
        this.server.sockets.in(availableRoom.roomId).emit('Drawx', {
          ballX: availableRoom.ball.x,
          ballY: availableRoom.ball.y,
          AdminY: availableRoom.player2.y,
          MeetY: availableRoom.player1.y,
        })
        // this.server.to(availableRoom.AdminId).emit('Player-2-Admin', {
          //   ballX: availableRoom.ball.x,
          //   ballY: availableRoom.ball.y,
          // })
        }, 0)
      console.error(availableRoom.player2.y + "\n" + availableRoom.player1.y,);
      // while_loop();
      this.server.emit('meet-joined');
      this.server.emit('isAdmin', { isAdmin: 'false' });
    }
  }
  @SubscribeMessage('coordinates_Admin')
  onReceivingAdmin(@MessageBody() body: any, @ConnectedSocket() client) {
    const room = Rooms.find((room) => room.AdminId === client.id);
    
    playerYAdmin = body.playerY;
    console.error(playerYAdmin);
    // if (room) {
    //     this.server.to(room.MeetId).emit('Player-2-Meet', {
    //     //     ballX: body.ballX,
    //     //     ballY: body.ballY,
    //         playerY: body.playerY,
    //     //     adminScore: body.adminScore,
    //     //     player2Score: body.player2Score,
    //       });
    //     }
      }
  @SubscribeMessage('coordinates_Meet')
  onReceivingMeet(@MessageBody() body: any, @ConnectedSocket() client) {
    const room = Rooms.find((room) => room.MeetId === client.id);
    playerYMeet = body.playerY;
    console.error(playerYMeet);
    
  //   if (room) {
  //     this.server.to(room.AdminId).emit('Player-2-Admin', {
  //       playerY: body.playerY,
  //   });
  // }
  }
  @SubscribeMessage('room-score')
  onDisconnect(@MessageBody() body: any) {
    console.error(body);
  }
}
