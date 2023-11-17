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

// const player1 = new elem({
//     x: 10,
//     y: 160,
//     width: 15,
//     height: 80,
//     color: "#fff",
//     gravity: 2,
// })

// const player2 = new elem({
//     x: 625,
//     y: 160,
//     width: 15,
//     height: 80,
//     color: '#fff',
//     gravity: 2,
// });

// const ball = new elem({
//     x: width / 2,
//     y: height / 2,
//     width: 15,
//     height: 15,
//     color: '#fff',
//     speed: 1,
//     gravity: 1
// });

// function drawelem(elem) {
//     // console.log(elem);
//     // context.fillStyle = elem.color;
//     // context.fillRect(elem.x, elem.y, elem.width, elem.height);
// }

// function drawBall(elem) {
  
// }

// function displayscore1() {
//     // context.font = "10px Arial";
//     // context.fillStyle = "#fff";
//     // context.fillText(scoreLeft, width / 2 - 60, 30);
// }

// function displayscore2() {
//     // context.font = "10px Arial";
//     // context.fillStyle = "#fff";
//     // context.fillText(scoreRigth, width / 2 + 60, 30);
// }

// function drawAll() {
//     // drawelem(player1);
//     // drawelem(player2);
//     drawBall(ball);
//     // displayscore1();
//     // displayscore2();
// }

// function ballWallCollision() {
//     if ((ball.y + ball.gravity <= player2.y + player2.height &&
//          ball.x + ball.width + ball.speed >= player2.x && 
//          ball.y + ball.gravity > player2.y) || (ball.y + ball.gravity > player1.y && ball.x + ball.speed <= player1.x + player1.width)) {
//         ball.speed *= -1;
//     } else if (ball.x + ball.speed < player1.x) {
//         scoreLeft += 1;
//         ball.speed = ball.speed * -1;
//         ball.x = 100 + ball.speed;
//         ball.y += ball.gravity;
//     } else if (ball.x + ball.speed > player2.x + player2.width) {
//         scoreRigth += 1;
//         ball.speed = ball.speed * -1;
//         ball.x = 100 + ball.speed;
//         ball.y += ball.gravity;
//     }
//     console.error(ball.x);
//     console.error(ball.y);
//     drawAll();
// }

// function ballBounce() {
//     if (ball.y + ball.gravity <= 0 || ball.y + ball.gravity >= height) {
//         ball.gravity *= -1;
//         ball.y += ball.gravity;
//         ball.x += ball.speed;
//     } else {
//         ball.y += ball.gravity;
//         ball.x += ball.speed;
//     }
//     ballWallCollision();
// }

// function keys(e) {
//     const key = e.key;
//     if (key == 'w' && player1.y - player1.gravity > 0) {
//         player1.y -= player1.gravity * 4;
//     } else if (key == 's' && player1.height + player1.y + player1.gravity < height) {
//         player1.y += player1.gravity * 4;
//     }
//     if (key == 'i' && player2.y - player2.gravity > 0) {
//         player2.y -= player2.gravity * 4;
//     } else if (key == 'k' && player2.height + player2.y + player2.gravity < height) {
//         player2.y += player2.gravity * 4;
//     }
// }

// function while_loop() {
//   setInterval(() => {
//     ballBounce();
//   }, 0);
// }



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
    }, 20);
  }

  start() {
    this.while_loop();
  }
  
  positions(paddleOne: number, paddleTwo: number) {
      // const key = e.key;
      // if (key == 'w' && this.player1.y - this.player1.gravity > 0) {
      //     this.player1.y -= this.player1.gravity * 4;
      // } else if (key == 's' && this.player1.height + this.player1.y + this.player1.gravity < height) {
      //     this.player1.y += this.player1.gravity * 4;
      // }
      this.player1.y = paddleOne;
      // if (key == 'i' && this.player2.y - this.player2.gravity > 0) {
      //     this.player2.y -= this.player2.gravity * 4;
      // } else if (key == 'k' && this.player2.height + this.player2.y + this.player2.gravity < height) {
      //     this.player2.y += this.player2.gravity * 4;
      // }
      this.player2.y = paddleTwo;
  }
  // }
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
      // socket.join(initRoom.roomId);
      Rooms.push(initRoom);
      this.server.emit('isAdmin', { isAdmin: 'true' });
    } else {
      availableRoom.Player2 = false;
      availableRoom.MeetId = socket.id;
      availableRoom.start();
      setInterval(()=> {
        this.server.to(availableRoom.MeetId).emit('Player-2-Meet', {
          ballX: availableRoom.ball.x,
          ballY: availableRoom.ball.y,
          // playerY: body.playerY,
          // adminScore: body.adminScore,
          // player2Score: body.player2Score,
        });
      }, 10)
      // socket.join(availableRoom.roomId);
      // while_loop();
      
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
