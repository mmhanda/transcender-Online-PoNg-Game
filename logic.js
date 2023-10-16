import Ball from "./Ball.js";
import Paddle from "./Paddle.js";

const ball = new Ball(document.getElementById("ball"));
const playerPaddle = new Paddle(document.getElementById("player-paddle"));
const botPaddle = new Paddle(document.getElementById("bot-paddle"));
const playerScoreElem = document.getElementById("player-score");
const botScoreElem = document.getElementById("bot-score");

let LastTime = null;

function update(time) {
  if (LastTime != null) {
    const delta = time - LastTime;
    ball.update(delta, [playerPaddle.rect(), botPaddle.rect()]);
    botPaddle.update(delta, ball.y);
    console.log(delta);
    if (isLose()) {
      handleLose();
    }

    const hue = parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue("--hue")
    );
    document.documentElement.style.setProperty("--hue", hue + delta * 0.04);
  }
  LastTime = time;
  window.requestAnimationFrame(update);
}

function handleLose() {
  const rect = ball.rect();

  if (rect.right >= window.innerWidth) {
    playerScoreElem.textContent = parseInt(playerScoreElem.textContent) + 1;
  } else {
    botScoreElem.textContent = parseInt(botScoreElem.textContent) + 1;
  }
  ball.reset();
  botPaddle.reset();
}

function isLose() {
  const rect = ball.rect();
  return rect.left <= 0 || rect.right >= window.innerWidth;
}

document.addEventListener("mousemove", (e) => {
  playerPaddle.position = (e.y / window.innerHeight) * 100; //for getting to percentenge of the window of where the mouse is and the paddle should go
});

window.requestAnimationFrame(update);
