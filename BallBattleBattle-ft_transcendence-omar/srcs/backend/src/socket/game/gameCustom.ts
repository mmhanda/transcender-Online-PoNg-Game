const width: number = 100,
  height: number = 100,
  INITIAL_VELOCITY: number = 0.5,
  VELOCITY_INCREASE: number = 0.00000;

class elem {
  x: number;
  y: number;
  width: number;
  height: number;
  direction_y: number;
  velocity: number;
  direction_x: number;
  constructor(options) {
    this.x = options.x * (width / 650);
    this.y = options.y * (height / 400);
    this.width = options.width * (width / 650);
    this.height = options.height * (height / 400);
    this.direction_y = 1;
    this.direction_x = 1.3;
    this.velocity = INITIAL_VELOCITY;
  }
}

export default class room {
  player1: elem;
  player2: elem;
  ball: elem;
  Player2: boolean;
  roomId: string;
  AdminId: string;
  MeetId: string;
  dbAdminId: string;
  dbMeetId: string;
  scoreLeft: number;
  scoreRight: number;
  Admin_avatar: string;
  Meet_avatar: string;
  Admin_fullName: string;
  Meet_fullName: string;
  Admin_player_state: object;
  Meet_player_state: object;
  Admin_tier: object;
  Meet_tier: object;
  IntervalId: any;
  time_start: number;
  time_end: number;
  constructor(roomId: string, Player2: boolean, admin: string, dbAdminId: string, dbMeetId: string, Admin_avatar: string, Admin_fullName: string, Meet_avatar: string, Meet_fullName: string, Admin_player_state: object, Meet_player_state: object, Admin_tier: object, Meet_tier: object) {
    this.roomId = roomId;
    this.Player2 = Player2;
    this.AdminId = admin;
    this.dbAdminId = dbAdminId;
    this.Admin_avatar = Admin_avatar;
    this.Admin_fullName = Admin_fullName;
    this.Meet_avatar = Meet_avatar;
    this.Meet_fullName = Meet_fullName;
    this.Admin_player_state = Admin_player_state;
    this.Meet_player_state = Meet_player_state;
    this.Admin_tier = Admin_tier;
    this.Meet_tier = Meet_tier;
    this.scoreLeft = 0;
    this.scoreRight = 0;
    this.IntervalId = -1;
    this.time_start = 0;
    this.time_end = 0;
    this.dbMeetId = dbMeetId;
    this.MeetId = "";
    this.player1 = new elem({
      x: 2,
      y: 160,
      width: 15,
      height: 80,
    });

    this.player2 = new elem({
      x: 648,
      y: 160,
      width: 15,
      height: 80,
    });

    this.ball = new elem({
      x: 50,
      y: 50,
      width: 15,
      height: 10,
      direction_y: 1,
    });
  }

  ballWallCollision() {
    if (
      (this.ball.y >= this.player2.y + 1 &&
        this.ball.y <= this.player2.y + this.player2.height &&
        this.ball.x >= this.player2.x - this.player2.width) ||
      (this.ball.y >= this.player1.y + 1 &&
        this.ball.y <= this.player1.y + this.player1.height &&
        this.ball.x <= this.player1.x + this.player1.width)
    ) {
      if (
        (this.ball.y - 4.2 <= this.player2.y ||
          this.ball.y >= this.player2.y + 14) &&
        this.ball.x > 50
      )
        this.ball.direction_y *= -1;

      if (
        this.ball.y - 4.2 <= this.player1.y ||
        (this.ball.y >= this.player1.y + 14 && this.ball.x < 50)
      )
        this.ball.direction_y *= -1;

      this.ball.direction_x *= -1;
    } else if (this.ball.x - this.player1.width < this.player1.x) {
      this.scoreLeft += 1;
      this.ball.x = 50;
      this.ball.y = 50;
      this.ball.velocity = INITIAL_VELOCITY;
    } else if (this.ball.x + this.player2.width > this.player2.x) {
      this.scoreRight += 1;
      this.ball.x = 50;
      this.ball.y = 50;
      this.ball.velocity = INITIAL_VELOCITY;
    } else if (this.scoreRight === 8 || this.scoreLeft === 8)
      clearInterval(this.IntervalId);
  }

  ballBounce() {
    if (
      this.ball.y - this.ball.height + 1 <= 0 ||
      this.ball.y + this.ball.height - 1 >= height
    ) {
      this.ball.direction_y *= -1;
      this.ball.y += this.ball.direction_y * this.ball.velocity;
      this.ball.x += this.ball.direction_x * this.ball.velocity;
      this.ball.velocity += VELOCITY_INCREASE;
    } else {
      this.ball.y += this.ball.direction_y * this.ball.velocity;
      this.ball.x += this.ball.direction_x * this.ball.velocity;
      this.ball.velocity += VELOCITY_INCREASE;
    }
    this.ballWallCollision();
  }

  start() {
    this.ball.velocity = INITIAL_VELOCITY;
    this.ball.x = 50;
    this.ball.y = 50;
    setTimeout(() => {
      this.IntervalId = setInterval(() => {
        this.ballBounce();
      }, 12);
    }, 6000);
  }

  set paddleOne(paddleOne) { this.player1.y = paddleOne - 10; }
  set paddleTwo(paddleTwo) { this.player2.y = paddleTwo - 10; }
  set timeStart(timeStart) { this.time_start = timeStart; }
  set timeEnd(timeEnd) { this.time_end = timeEnd; }

  get paddleOne() { return this.player1.y + 10; }
  get paddleTwo() { return this.player2.y + 10; }

  get ballX() { return this.ball.x; }
  get ballY() { return this.ball.y; }

  get AdminScore() { return this.scoreLeft; }
  get MeetScore() { return this.scoreRight; }
  get RoomID() { return this.roomId; }
  get TimeStart() { return this.time_start; }
  get TimeEnd() { return this.time_end; }
}
