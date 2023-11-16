"use client";
import { useEffect, useState } from "react";
import Ball from "./Ball";
import Paddle from "./Paddle";
import "./styles.css";
import Modal from "react-modal";
import { customStyles } from "../game/Paddle";
import { useSearchParams } from "next/navigation";

export default function Pong() {
  let runGame: boolean = false,
    keepUpdating: boolean = false,
    timeout: boolean = true;

  const [message, setMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const router = useSearchParams();
  const color: any = router.get("color");

  function sleep(ms: any) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  useEffect(() => {
    if (runGame) {
      const ball = new Ball(document.getElementById("ball"));
      const playerPaddle = new Paddle(document.getElementById("player-paddle"));
      const botPaddle = new Paddle(document.getElementById("bot-paddle"));
      const playerScoreElem = document.getElementById("player-score");
      const botScoreElem = document.getElementById("bot-score");
      let hueColorChangeSet: string = color;

      let LastTime: any = null;

      function EndGame(msg: string) {
        keepUpdating = false;
        setMessage(msg);
        setIsOpen(true);
      }

      document.documentElement.style.setProperty("--hue", hueColorChangeSet);

      async function update(time: any) {
        if (!keepUpdating) return;
        if (playerScoreElem?.textContent === "3") EndGame("You Won!");
        if (botScoreElem?.textContent === "3") EndGame("You Won!");
        if (LastTime != null) {
          const delta: number = time - LastTime;
          ball.update(delta, [playerPaddle.rect(), botPaddle.rect()]);
          botPaddle.update(delta, ball.y);

          if (isLose()) {
            handleLose();
          }
        }
        LastTime = time;
        window.requestAnimationFrame(update);
      }

      async function change() {
        if (timeout) {
          await sleep(1500).then(() => {
            timeout = false;
            keepUpdating = true;
            window.requestAnimationFrame(update);
          });
        } else window.requestAnimationFrame(update);
      }

      function handleLose() {
        const rect = ball.rect();

        if (!playerScoreElem || !botScoreElem) return;
        if (rect.right >= window.innerWidth - window.innerWidth / 3.5) {
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
        return (
          rect.left <= window.innerWidth / 3.5 ||
          rect.right >= window.innerWidth - window.innerWidth / 3.5
        );
      }

      document.addEventListener("mousemove", (e) => {
        playerPaddle.position = (e.y / window.innerHeight) * 100;
      });
      change();
    }
    runGame = true;
  }, []);

  return (
    <div
      className="gameContainer gameContainer h-[250px] min-h-[1em] w-px self-stretch
      bg-gradient-to-tr from-transparent via-neutral-500
        to-transparent opacity-20 dark:opacity-100"
      // style={{ height: `${window?.innerHeight}px` }}
      style={{ height: `100%` }}
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
      <div className="middle_line"></div>
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
