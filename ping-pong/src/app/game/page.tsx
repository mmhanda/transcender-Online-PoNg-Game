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
  const color: any = router.get("color");

  function sleep(ms: any) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  useEffect(() => {
    if (runGame) {
      // const socket = io("http://10.13.5.6:3001/");
      const socket = io("http://localhost:3001");
      const ball = new Ball(document.getElementById("ball"));
      const playerPaddle = new Paddle(document.getElementById("player-paddle"));
      const Player2Paddle = new Paddle(document.getElementById("bot-paddle"));
      const playerScoreElem: any = document.getElementById("player-score");
      const player2ScoreElem: any = document.getElementById("bot-score");
      let Player2Height: number = 50,
        ballY: number = 50,
        ballX: number = 22;
      const hueColorChangeSet: string = color;
      let ISadmin: boolean = false;

      socket.connect();
      socket.emit("join-room");
      socket.once("isAdmin", (Admin) => {
        if (Admin.isAdmin === "true") {
          keepUpdating = true;
          ISadmin = true;
        }
      });
      socket.once("meet-joined", async () => {
        if (ISadmin) {
          await sleep(1000);
          keepUpdating = false;
          isMeet = true;
          window.requestAnimationFrame(update);
        } else {
          isMeet = true;
          update();
        }
      });

      socket.on('Drawx', (draw) => {
        if (draw.ballX && draw.ballY) {
          ballX = draw.ballX;
          ballY = draw.ballY;
        }
        if (ISadmin) {
          if (draw.playerYMeet) {
            Player2Height = draw.playerYMeet;
          }
        } else {
          if (draw.playerYAdmin) {
            Player2Height = draw.playerYAdmin;
          }
        }
      })

      document.documentElement.style.setProperty("--hue", hueColorChangeSet);

      function update() {
        if (!isMeet || keepUpdating) return;

          Player2Paddle.update(Player2Height);

          ball.update(
            ISadmin,
            ballX,
            ballY
          );
        window.requestAnimationFrame(update);
      }

      document.addEventListener("mousemove", (e) => {
        const pos = (e.y / window.innerHeight) * 100;
        if (pos >= 92 || pos <= 9 ) return;
        playerPaddle.position = pos;
        if (ISadmin && isMeet) {
          socket.emit("coordinates_Admin", {
            playerY: pos,
          });
        } else {
          socket.emit("coordinates_Meet", {
            playerY: pos,
          });
        }
      });
    }
    runGame = true;
  }, []);

  return (
    <>
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
      <div className="middle_line" ></div>
      <Modal
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        style={customStyles}
      >
        {`${message}`}
      </Modal>
    </>
  );
}
