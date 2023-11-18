const width:number = 100, height:number = 100, INITIAL_VELOCITY: number = 0.025, VELOCITY_INCREASE:number = 0.000005;

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
  scoreLeft: number;
  scoreRigth: number;
  constructor(roomId: string, Player2: boolean, admin: string) {
    this.roomId = roomId;
    this.Player2 = Player2;
    this.AdminId = admin;
    this.scoreLeft = 0;
    this.scoreRigth = 0;
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

  ballWallCollision() {
    if (
        (this.ball.y + this.ball.gravity + this.ball.width <= (this.player2.y + 2) + this.player2.height &&
            this.ball.x + this.ball.width + 0.01 >= this.player2.x - (this.player2.width / 2.8) &&
            this.ball.y + this.ball.gravity > (this.player2.y - 1.3)) ||
        (this.ball.y + this.ball.gravity > (this.player1.y - 2) &&
            this.ball.x + 0.01 <= this.player1.x + this.player1.width + 0.2 &&
            this.ball.y < (this.player1.y + 2) + this.player1.height)
    ) {
        this.ball.direction_x *= -1;
    } else if (this.ball.x + 0.01 < this.player1.x) {
        this.scoreLeft += 1;
        this.ball.x = width / 2;
        this.ball.y = height / 2;
        this.ball.direction_x = Math.random() < 0.5 ? -1 : 1 * Math.cos(Math.random() * Math.PI * 0.8 - (Math.PI * 0.8) / 2);
        this.ball.velocity = INITIAL_VELOCITY;
    } else if (this.ball.x + 0.01 > this.player2.x + this.player2.width) {
        this.scoreRigth += 1;
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
    this.ball.x = 50;
    this.ball.y = 50;
    this.while_loop();
  }

  set paddleOne(paddleOne) { this.player1.y = paddleOne - 10; }
  set paddleTwo(paddleTwo) { this.player2.y = paddleTwo - 10; }

  get paddleOne() { return this.player1.y + 10; }
  get paddleTwo() { return this.player2.y + 10; }

  get ballX() { return this.ball.x; }
  get ballY() { return this.ball.y; }

  get AdminScore() { return this.scoreLeft };
  get MeetScore() { return this.scoreRigth };
}