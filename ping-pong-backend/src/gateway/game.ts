const width:number = 100, height:number = 100, INITIAL_VELOCITY: number = 0.025, VELOCITY_INCREASE:number = 0.000005;

let scoreLeft:number, scoreRigth:number = 0 ;

class elem {
  x: number
  y: number
  width: number
  height: number
  color: string
  gravity: number
  velocity: number
  direction_x: number
    constructor(options) {
      this.x = options.x * (width / 650);
      this.y = options.y * (height / 400);
      this.width = options.width * (width / 650);
      this.height = options.height * (height / 400);
      this.color = options.color;
      this.gravity = options.gravity * (height / 400);
      this.direction_x = Math.random() < 0.5 ? -1 : 1 * Math.cos(Math.random() * Math.PI * 0.8 - (Math.PI * 0.8) / 2);
      this.velocity = INITIAL_VELOCITY;
    }
}

export default class room {
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
        x: 2,
        y: 160,
        width: 15,
        height: 80,
    })
  
    this.player2 = new elem({
        x: 648,
        y: 160,
        width: 15,
        height: 80,
    });
  
    this.ball = new elem({
        x: width / 2,
        y: height / 2,
        width: 15,
        height: 15,
        gravity: 1
    });
  }

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
        (this.ball.y + this.ball.gravity + this.ball.width <= (this.player2.y + 2) + this.player2.height &&
            this.ball.x + this.ball.width + 0.01 >= this.player2.x - (this.player2.width / 2.8) &&
            this.ball.y + this.ball.gravity > (this.player2.y - 2)) ||
        (this.ball.y + this.ball.gravity > (this.player1.y - 2) &&
            this.ball.x + 0.01 <= this.player1.x + this.player1.width + 0.2 &&
            this.ball.y < (this.player1.y + 2) + this.player1.height)
    ) {
        this.ball.direction_x *= -1;
    } else if (this.ball.x + 0.01 < this.player1.x) {
        scoreLeft += 1;
        this.ball.x = width / 2;
        this.ball.y = height / 2;
        this.ball.direction_x = Math.random() < 0.5 ? -1 : 1 * Math.cos(Math.random() * Math.PI * 0.8 - (Math.PI * 0.8) / 2);
        this.ball.velocity = INITIAL_VELOCITY;
    } else if (this.ball.x + 0.01 > this.player2.x + this.player2.width) {
        scoreRigth += 1;
        this.ball.x = width / 2;
        this.ball.y = height / 2;
        this.ball.direction_x = Math.random() < 0.5 ? -1 : 1 * Math.cos(Math.random() * Math.PI * 0.8 - (Math.PI * 0.8) / 2);
        this.ball.velocity = INITIAL_VELOCITY;
      }
  }
  
  ballBounce() {
      if (this.ball.y + this.ball.gravity <= 0 || this.ball.y + this.ball.gravity >= height) {
          this.ball.gravity *= -1;
          this.ball.y += this.ball.gravity * this.ball.velocity;
          this.ball.x += this.ball.direction_x * this.ball.velocity;
          this.ball.velocity += VELOCITY_INCREASE;
      } else {
        this.ball.y += this.ball.gravity * this.ball.velocity;
        this.ball.x += this.ball.direction_x * this.ball.velocity;
        this.ball.velocity += VELOCITY_INCREASE;
      }
      this.ballWallCollision();
  }

  while_loop() {
    setInterval(() => {
      this.ballBounce();
    }, 0);
  }

  start() {
    this.while_loop();
  }

  set paddleOne(paddleOne) { this.player1.y = paddleOne - 10; }
  set paddleTwo(paddleTwo) { this.player2.y = paddleTwo - 10; }

  get paddleOne() { return this.player1.y + 10; }
  get paddleTwo() { return this.player2.y + 10; }

  get ballX() { return this.ball.x; }
  get ballY() { return this.ball.y; }

  get AdminScore() { return scoreLeft };
  get MeetScore() { return scoreRigth };
}