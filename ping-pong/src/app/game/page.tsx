"use client";

import { createContext } from "react";
import { io, Socket } from "socket.io-client";

import { useContext, useEffect, useState } from "react";
// import { WebsocketContext } from "./WebsocketContext";
import Ball from "./Ball";
import Paddle from "./Paddle";
import "./styles.css";

type MessagePayload = {
  content: string;
  msg: string;
};

export default function Pong() {
  let runGame: boolean = false;

  const [value, setValue] = useState("");
  const [messages, setMessages] = useState<MessagePayload[]>([]);
  // const WebsocketContext = createContext<Socket>(InitSocket);
  // const socket = useContext(WebsocketContext);

  useEffect(() => {
    if (runGame) {
      const socket = io("http://localhost:3001");
      const ball = new Ball(document.getElementById("ball"));
      const playerPaddle = new Paddle(document.getElementById("player-paddle"));
      const Player2Paddle = new Paddle(document.getElementById("bot-paddle"));
      const playerScoreElem: any = document.getElementById("player-score");
      const player2ScoreElem: any = document.getElementById("bot-score");
      let Player2Height: any;
      let Player2Rect: any;
      let ISadmin: boolean = false;
      let adminScore: number = 0;
      let player2Score: number = 0;
      let ballY: any, ballX: any, ballRect: any;
      let hueColorChangeSet: string = "";
      socket.on("connect", () => {
        console.log("Connected !");
      });

      socket.once("isAdmin", (Admin) => {
        if (Admin.isAdmin === "true") ISadmin = true;
      });

      socket.on("Player-2-Admin", (Player2) => {
        if (ISadmin) {
          if (Player2.playerY) {
            Player2Height = Player2.playerY;
          }
          if (Player2.rect) {
            Player2Rect = Player2.rect;
          }
        }
      });

      socket.on("Player-2-Meet", (Player2) => {
        if (!ISadmin) {
          if (Player2.playerY) {
            Player2Height = Player2.playerY;
          }
          if (Player2.rect) {
            Player2Rect = Player2.rect;
          }
          if (Player2.ballX && Player2.ballY) {
            ballX = Player2.ballX;
            ballY = Player2.ballY;
          }
          if (Player2.hue) {
            hueColorChangeSet = Player2.hue;
          }
          if (Player2.adminScore || Player2.player2Score) {
            adminScore = Player2.adminScore;
            player2Score = Player2.player2Score;
          }
        }
      });

      socket.emit("join-room");

      let LastTime: any = null;

      function update(time: any) {
        if (LastTime != null) {
          const delta: number = time - LastTime;
          let playerPaddleRect = playerPaddle.rect();

          Player2Paddle.update(delta, Player2Height);

          if (Player2Rect) {
            const paddleLeft = window.innerWidth - 10;
            Player2Rect.left = paddleLeft;
            Player2Rect.right = paddleLeft - 10;
            ball.update(
              delta,
              [playerPaddle.rect(), Player2Rect],
              ISadmin,
              ballX,
              ballY
            );

            if (ISadmin) {
              const hue: number = parseFloat(
                getComputedStyle(document.documentElement).getPropertyValue(
                  "--hue"
                )
              );
              const hueColorChange: number = hue + delta * 0.04;
              hueColorChangeSet = hueColorChange.toString();
              document.documentElement.style.setProperty(
                "--hue",
                hueColorChangeSet
              );
              socket.emit("coordinates_Admin", {
                ballX: ball.x,
                ballY: ball.y,
                hue: hueColorChangeSet,
                rect: playerPaddleRect,
                adminScore: adminScore,
                player2Score: player2Score,
              });
            } else {
              document.documentElement.style.setProperty(
                "--hue",
                hueColorChangeSet
              );
              player2ScoreElem.textContent = adminScore.toString();
              playerScoreElem.textContent = player2Score.toString();
            }
          }

          if (!ISadmin) {
            socket.emit("coordinates_Meet", { rect: playerPaddleRect });
          } else {
            if (isLose()) handleLose();
          }
        }
        LastTime = time;
        window.requestAnimationFrame(update);
      }

      function handleLose() {
        const rect = ball.rect();

        if (!playerScoreElem || !player2ScoreElem) return;
        if (rect.right >= window.innerWidth) {
          adminScore = parseInt(playerScoreElem.textContent) + 1;
          playerScoreElem.textContent = adminScore.toString();
        } else {
          player2Score = parseInt(player2ScoreElem.textContent) + 1;
          player2ScoreElem.textContent = player2Score.toString();
        }
        ball.reset();
        Player2Paddle.reset();
      }

      function isLose() {
        const rect = ball.rect();
        return rect.left <= 0 || rect.right >= window.innerWidth;
      }

      document.addEventListener("mousemove", (e) => {
        playerPaddle.position = (e.y / window.innerHeight) * 100;
        if (ISadmin) {
          socket.emit("coordinates_Admin", { playerY: playerPaddle.position });
        } else {
          socket.emit("coordinates_Meet", { playerY: playerPaddle.position });
        }
      });
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
    </div>
  );
}
