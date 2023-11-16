// const canvas = document.getElementById('pong');
// const context = canvas.getContext('2d');

// const width = 650

// const height = 400;

// let scoreLeft = scoreRigth = 0;

// class elem {
//     constructor(options) {
//         this.x = options.x;
//         this.y = options.y;
//         this.width = options.width;
//         this.height = options.height;
//         this.color = options.color;
//         this.speed = options.speed || 2;
//         this.gravity = options.gravity;
//     }
// }

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
//     console.log(elem);
//     context.fillStyle = elem.color;
//     context.fillRect(elem.x, elem.y, elem.width, elem.height);
// }

// function displayscore1() {
//     context.font = "10px Arial";
//     context.fillStyle = "#fff";
//     context.fillText(scoreLeft, width / 2 - 60, 30);
// }

// function displayscore2() {
//     context.font = "10px Arial";
//     context.fillStyle = "#fff";
//     context.fillText(scoreRigth, width / 2 + 60, 30);
// }

// function drawAll() {
//     context.clearRect(0,0,width, height);
//     drawelem(player1);
//     drawelem(player2);
//     drawelem(ball);
//     displayscore1();
//     displayscore2();
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

// window.addEventListener('keypress', keys, false);

// function while_loop() {
//     ballBounce();
//     window.requestAnimationFrame(while_loop);
// }

// while_loop();