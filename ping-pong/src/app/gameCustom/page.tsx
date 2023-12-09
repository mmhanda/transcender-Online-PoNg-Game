"use client";
import { io } from "socket.io-client";
import Modal from "react-modal";
import { useEffect, useState } from "react";
import Ball from "./Ball";
import Paddle from "./Paddle";
import { customStyles } from "./Paddle";
import "./styles.css";
import { useSearchParams } from "next/navigation";

export default function Pong() {
  let runGame: boolean = false,
    keepUpdating: boolean = false,
    isMeet: boolean = false;

  const [message, setMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const router = useSearchParams();
  const color: string | null = router.get("color");

  useEffect(() => {
    if (runGame) {
      // const socket = io("http://10.12.8.8:3001/");
      const socket = io("http://localhost:3001");
      const ball = new Ball(document.getElementById("ball"));
      const playerPaddle = new Paddle(document.getElementById("player-paddle"));
      const Player2Paddle = new Paddle(document.getElementById("bot-paddle"));
      const playerScoreElem: HTMLElement | null =
        document.getElementById("player-score");
      const player2ScoreElem: HTMLElement | null =
        document.getElementById("bot-score");
      let Player2Height: number = 50,
        ballY: number = 50,
        ballX: number = 50;
      const hueColorChangeSet: string | null = color;
      let ISadmin: boolean = false;

      socket.connect();
      socket.emit("join-room-custom", { Role: "Host" });
      socket.once("isAdmin", (Admin) => {
        if (Admin?.isAdmin === "true") {
          keepUpdating = true;
          ISadmin = true;
        }
      });
      socket.once("launch-game", async () => {
        if (ISadmin) {
          keepUpdating = false;
          isMeet = true;
          window.requestAnimationFrame(update);
        } else {
          isMeet = true;
          update();
        }
      });

      socket.on("Drawx", (draw) => {
        ballX = draw.ballX;
        ballY = draw.ballY;
        if (ISadmin) {
          Player2Height = draw.playerYMeet;
          player2ScoreElem.textContent = draw.AdminScore;
          playerScoreElem.textContent = draw.MeetScore;
        } else {
          Player2Height = draw.playerYAdmin;
          playerScoreElem.textContent = draw.AdminScore;
          player2ScoreElem.textContent = draw.MeetScore;
        }
      });

      document.documentElement.style.setProperty("--hue", hueColorChangeSet);

      function update() {
        if (
          !isMeet ||
          keepUpdating ||
          playerScoreElem.textContent === "8" ||
          player2ScoreElem.textContent === "8"
        ) {
          ball.x = 50;
          ball.y = 50;
          if (
            playerScoreElem.textContent === "8" ||
            player2ScoreElem.textContent === "8"
          ) {
            setMessage("End game");
            // setIsOpen(true);
            socket.disconnect();
          }
          return;
        }

        Player2Paddle.update(Player2Height);

        ball.update(ISadmin, ballX, ballY);
        window.requestAnimationFrame(update);
      }

      document.addEventListener("mousemove", (e) => {
        const pos = (e.y / window.innerHeight) * 100;
        if (pos >= 92 || pos <= 8.5) return;
        playerPaddle.position = pos;
        if (ISadmin && isMeet) {
          socket.emit("coordinates_Admin_custom", {
            playerY: pos,
          });
        } else {
          socket.emit("coordinates_Meet_custom", {
            playerY: pos,
          });
        }
      });
    }
    runGame = true;
  }, []);

  return (
    <>
      <div
        className="gameContainer h-[250px] min-h-[1em] w-px self-stretch
        bg-gradient-to-tr from-transparent via-neutral-500
        to-transparent"
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
    </>
  );
}
