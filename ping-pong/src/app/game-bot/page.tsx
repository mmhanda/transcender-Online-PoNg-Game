"use client";
import { useEffect, useState } from "react";
import Ball from "./Ball";
import Paddle from "./Paddle";
import "./styles.css";
import Modal from "react-modal";
import { customStyles } from "../game/Paddle";

export default function Pong() {
  let runGame: boolean = false,
    keepUpdating: boolean = false;

  const [message, setMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (runGame) {
      const ball = new Ball(document.getElementById("ball"));
      const playerPaddle = new Paddle(document.getElementById("player-paddle"));
      const botPaddle = new Paddle(document.getElementById("bot-paddle"));
      const playerScoreElem = document.getElementById("player-score");
      const botScoreElem = document.getElementById("bot-score");

      let LastTime: any = null;

      function EndGame(msg: string) {
        keepUpdating = true;
        setMessage(msg);
        setIsOpen(true);
      }

      function update(time: any) {
        if (keepUpdating) return;

        if (playerScoreElem?.textContent === "3") EndGame("You Won!");
        if (botScoreElem?.textContent === "3") EndGame("You Won!");
        if (LastTime != null) {
          const delta: number = time - LastTime;
          ball.update(delta, [playerPaddle.rect(), botPaddle.rect()]);
          if (
            ball.y > window.innerHeight / 200 &&
            ball.y < window.innerHeight / 12.5
          )
            botPaddle.update(delta, ball.y);
          if (isLose()) {
            handleLose();
          }

          const hue: number = parseFloat(
            getComputedStyle(document.documentElement).getPropertyValue("--hue")
          );
          // const hueColorChange: number = hue + delta * 0.04;
          const hueColorChange: number = 400;
          const hueColorChangeSet: string = hueColorChange.toString();
          document.documentElement.style.setProperty(
            "--hue",
            hueColorChangeSet
          );
        }
        LastTime = time;
        window.requestAnimationFrame(update);
      }

      function handleLose() {
        const rect = ball.rect();

        if (!playerScoreElem || !botScoreElem) return;
        if (rect.right >= window.innerWidth) {
          const typeChanger: number = parseInt(playerScoreElem.textContent) + 1;
          playerScoreElem.textContent = typeChanger.toString();
        } else {
          const typeChanger: number = parseInt(botScoreElem.textContent) + 1;
          botScoreElem.textContent = typeChanger.toString();
        }
        ball.reset();
        botPaddle.reset();
      }

      function isLose() {
        const rect = ball.rect();
        return rect.left <= 0 || rect.right >= window.innerWidth;
      }

      document.addEventListener("mousemove", (e) => {
        const pos = (e.y / window.innerHeight) * 100 - window.innerHeight / 70;
        if (pos > window.innerHeight / 150 && pos < window.innerHeight / 12.1)
          playerPaddle.position = pos;
      });
      window.requestAnimationFrame(update);
    }

    runGame = true;
  }, []);

  return (
    <div
      className="gameContainer"
      style={{ height: `${window?.innerHeight / 1.3}px` }}
    >
      <div className="score">
        <div className="player-score" id="player-score">
          0
        </div>
        <div className="bot-score" id="bot-score">
          0
        </div>
      </div>
      <div className="ball" id="ball"></div>
      <div className="paddle left" id="player-paddle"></div>
      <div className="paddle right" id="bot-paddle"></div>
      <Modal
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        style={customStyles}
      >
        {`${message}`}
      </Modal>
    </div>
  );
}
