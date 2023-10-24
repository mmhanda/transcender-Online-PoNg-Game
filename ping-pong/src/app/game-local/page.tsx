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

        if (playerScoreElem.textContent === "3") EndGame("Left Player Won!");
        if (botScoreElem.textContent === "3") EndGame("Right Player Won!");
        if (LastTime != null) {
          const delta: number = time - LastTime;
          ball.update(delta, [playerPaddle.rect(), botPaddle.rect()]);
          if (isLose()) {
            handleLose();
          }

          const hue: number = parseFloat(
            getComputedStyle(document.documentElement).getPropertyValue("--hue")
          );
          const hueColorChange: number = hue + delta * 0.04;
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
        playerPaddle.position = 50;
      }

      function isLose() {
        const rect = ball.rect();
        return rect.left <= 0 || rect.right >= window.innerWidth;
      }

      document.addEventListener("keydown", (event) => {
        let name = event.key;
        if (name === "w" && playerPaddle.position >= 0) {
          playerPaddle.position -= 6;
        } else if (name === "s" && playerPaddle.position <= 100) {
          playerPaddle.position += 6;
        }
      });

      document.addEventListener("keydown", (event) => {
        let name = event.key;
        if (name === "ArrowUp" && botPaddle.position >= 0) {
          botPaddle.position -= 6;
        } else if (name === "ArrowDown" && botPaddle.position <= 100) {
          botPaddle.position += 6;
        }
      });

      // document.addEventListener("mousemove", (e) => {
      //   botPaddle.position = (e.y / window.innerHeight) * 100;
      // });

      window.requestAnimationFrame(update);
    }

    runGame = true;
  }, []);

  return (
    <div>
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
