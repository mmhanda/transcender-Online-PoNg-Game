const canvas = document.getElementById('pong');
const context = canvas.getContext('2d');

canvas.width = 100;
canvas.height = 100;

let scoreLeft = scoreRigth = 0;

class elem {
    constructor(options) {
        this.x = options.x * (canvas.width / 650);
        this.y = options.y * (canvas.height / 400);
        this.width = options.width * (canvas.width / 650);
        this.height = options.height * (canvas.height / 400);
        this.color = options.color;
        this.speed = options.speed || 2 * (canvas.width / 650);
        this.gravity = options.gravity * (canvas.height / 400);
    }
}

const player1 = new elem({
    x: 10,
    y: 160,
    width: 15,
    height: 80,
    color: "#fff",
    gravity: 2,
});

const player2 = new elem({
    x: 625,
    y: 160,
    width: 15,
    height: 80,
    color: '#fff',
    gravity: 2,
});

const ball = new elem({
    x: canvas.width / 2,
    y: canvas.height / 2,
    width: 15,
    height: 15,
    color: '#fff',
    speed: 1,
    gravity: 1,
});

function drawelem(elem) {
    context.fillStyle = elem.color;
    context.fillRect(elem.x, elem.y, elem.width, elem.height);
}

function displayscore1() {
    context.font = "10px Arial";
    context.fillStyle = "#fff";
    context.fillText(scoreLeft, canvas.width / 2 - 30, 10);
}

function displayscore2() {
    context.font = "10px Arial";
    context.fillStyle = "#fff";
    context.fillText(scoreRigth, canvas.width / 2 + 10, 10);
}

function drawAll() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawelem(player1);
    drawelem(player2);
    drawelem(ball);
    displayscore1();
    displayscore2();
}


function ballWallCollision() {
    if (
        (ball.y + ball.gravity <= player2.y + player2.height &&
            ball.x + ball.width + ball.speed >= player2.x &&
            ball.y + ball.gravity > player2.y) ||
        (ball.y + ball.gravity > player1.y &&
            ball.x + ball.speed <= player1.x + player1.width &&
            ball.y < player1.y + player1.height)
    ) {
        ball.speed *= -1;
    } else if (ball.x + ball.speed < player1.x) {
        scoreLeft += 1;
        ball.speed = ball.speed * -1;
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
    } else if (ball.x + ball.speed > player2.x + player2.width) {
        scoreRigth += 1;
        ball.speed = ball.speed * -1;
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
    }
    drawAll();
}

function ballBounce() {
    if (ball.y + ball.gravity <= 0 || ball.y + ball.gravity >= canvas.height) {
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
        player1.y -= player1.gravity * 6;
    } else if (key == 's' && player1.height + player1.y + player1.gravity < canvas.height) {
        player1.y += player1.gravity * 6;
    }
    if (key == 'i' && player2.y - player2.gravity > 0) {
        player2.y -= player2.gravity * 6;
    } else if (key == 'k' && player2.height + player2.y + player2.gravity < canvas.height) {
        player2.y += player2.gravity * 6;
    }
}

window.addEventListener('keypress', keys, false);

function while_loop() {
    ballBounce();
    window.requestAnimationFrame(while_loop);
}

while_loop();
