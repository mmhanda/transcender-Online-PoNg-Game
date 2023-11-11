"use client";
import { io } from "socket.io-client";

import Modal from "react-modal";
import { useEffect, useState } from "react";
import Ball from "./Ball";
import Paddle from "./Paddle";
import { customStyles } from "./Paddle";
import "./styles.css";

export default function Pong() {
  let runGame: boolean = false,
    keepUpdating: boolean = false,
    isMeet: boolean = false,
    Score: boolean = false;

  const [message, setMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (runGame) {
      const socket = io("http://localhost:3001");
      const ball = new Ball(document.getElementById("ball"));
      const playerPaddle = new Paddle(document.getElementById("player-paddle"));
      const Player2Paddle = new Paddle(document.getElementById("bot-paddle"));
      const playerScoreElem: any = document.getElementById("player-score");
      const player2ScoreElem: any = document.getElementById("bot-score");
      let Player2Height: any, Player2Rect: any, ballY: any, ballX: any;
      let adminScore: number = 0,
        player2Score: number = 0;
      let hueColorChangeSet: string = "";
      let ISadmin: boolean = false;

      socket.connect();

      socket.emit("join-room");

      socket.once("isAdmin", (Admin) => {
        if (Admin.isAdmin === "true") {
          keepUpdating = true;
          ISadmin = true;
        }
      });

      socket.once("meet-joined", (Admin) => {
        if (ISadmin) {
          socket.emit("coordinates_Admin", { playerY: playerPaddle.position });
          Score = true;
          keepUpdating = false;
          isMeet = true;
          window.requestAnimationFrame(update);
        } else {
          socket.emit("coordinates_Meet", { playerY: playerPaddle.position });
          isMeet = true;
          window.requestAnimationFrame(update);
        }
      });

      // window.onbeforeunload = alert;
      // function alert() {
      //   return "You Will LOSE The Game!";
      // }

      document.addEventListener("visibilitychange", function () {
        EndGame("End Game!");
        socket.disconnect();
        keepUpdating = true;
        setIsOpen(true);
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

      socket.on("admin-disconnect", () => {
        if (ISadmin) {
          EndGame("End Game!");
        }
      });

      socket.on("meet-disconnect", () => {
        if (!ISadmin) {
          EndGame("End Game!");
        }
      });

      function EndGame(msg: string) {
        keepUpdating = true;
        setMessage(msg);
        setIsOpen(true);
        socket.emit("room-score", {
          admin: playerScoreElem.textContent,
          meet: player2ScoreElem.textContent,
        });
        socket.disconnect();
      }

      let LastTime: any = null;

      function update(time: any) {
        if (!isMeet || keepUpdating) return;

        if (
          playerScoreElem.textContent === "8" ||
          player2ScoreElem.textContent === "8"
        )
          EndGame("End Game!");
        if (LastTime != null) {
          const delta: number = time - LastTime;
          let player2PaddleRect = playerPaddle.rect();

          Player2Paddle.update(Player2Height);

          if (Player2Rect) {
              const paddleLeft = window.innerWidth - window.innerWidth / 3.5;
              Player2Rect.left = paddleLeft;
              Player2Rect.right = paddleLeft - 10; // also top and bottom

            ball.update(
              delta,
              [playerPaddle.rect(), Player2Rect],
              ISadmin,
              ballX,
              ballY
            );

            if (ISadmin) {
              // const hue: number = parseFloat(
              //   getComputedStyle(document.documentElement).getPropertyValue(
              //     "--hue"
              //   )
              // );
              const hueColorChange: number = 400;
              // const hueColorChange: number = hue + delta * 0.04;
              hueColorChangeSet = hueColorChange.toString();
              document.documentElement.style.setProperty(
                "--hue",
                hueColorChangeSet
              );
              socket.emit("coordinates_Admin", {
                ballX: ball.x,
                ballY: ball.y,
                hue: hueColorChangeSet,
                rect: player2PaddleRect,
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
            socket.emit("coordinates_Meet", { rect: player2PaddleRect });
          } else {
            if (isLose()) handleLose();
          }
          onbeforeunload;
        }
        LastTime = time;
        window.requestAnimationFrame(update);
      }

      function handleLose() {
        const rect = ball.rect();
        Player2Paddle.reset();
        ball.reset();

        if (!playerScoreElem || !player2ScoreElem || !Score || keepUpdating)
          return;
        if (rect.right >= window.innerWidth && !keepUpdating) {
          adminScore = parseInt(playerScoreElem.textContent) + 1;
          playerScoreElem.textContent = adminScore.toString();
        } else {
          player2Score = parseInt(player2ScoreElem.textContent) + 1;
          player2ScoreElem.textContent = player2Score.toString();
        }
      }

      function isLose() {
        const rect = ball.rect();
        return rect.left <= 0 || rect.right >= window.innerWidth;
      }

      document.addEventListener("mousemove", (e) => {
        const pos = (e.y / window.innerHeight) * 100 - window.innerHeight / 70;
        if (pos > window.innerHeight / 150 && pos < window.innerHeight / 12.1) {
          playerPaddle.position = pos;
          if (ISadmin) {
            socket.emit("coordinates_Admin", {
              playerY: playerPaddle.position,
            });
          } else {
            socket.emit("coordinates_Meet", { playerY: playerPaddle.position });
          }
        }
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
