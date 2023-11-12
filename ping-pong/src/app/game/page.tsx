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

  function sleep(ms: any) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  useEffect(() => {
    if (runGame) {
      const socket = io("http://10.30.177.35:3001");
      const ball = new Ball(document.getElementById("ball"));
      const playerPaddle = new Paddle(document.getElementById("player-paddle"));
      const Player2Paddle = new Paddle(document.getElementById("bot-paddle"));
      const playerScoreElem: any = document.getElementById("player-score");
      const player2ScoreElem: any = document.getElementById("bot-score");
      let Player2Height: number = 50,
        Player2Rect: any,
        ballY: number,
        ballX: number;
      let adminScore: number = 0,
        player2Score: number = 0;
      const hueColorChangeSet: string = "400";
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
          await sleep(2000);
          Score = true;
          keepUpdating = false;
          isMeet = true;
          window.requestAnimationFrame(update);
        } else {
          isMeet = true;
          update("");
        }
      });

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
          if (Player2.adminScore || Player2.player2Score) {
            adminScore = Player2.adminScore;
            player2Score = Player2.player2Score;
          }
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
            const paddleLeft = window.innerWidth - window.innerWidth / 3.4;
            Player2Rect.right = Player2Rect.left = paddleLeft;

            ball.update(
              delta,
              [playerPaddle.rect(), Player2Rect],
              ISadmin,
              ballX,
              ballY
            );

            if (ISadmin) {
              document.documentElement.style.setProperty(
                "--hue",
                hueColorChangeSet
              );
              socket.emit("coordinates_Admin", {
                ballX: ball.x,
                ballY: ball.y,
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
        }
        LastTime = time;
        window.requestAnimationFrame(update);
      }

      function handleLose() {
        const rect = ball.rect();
        if (rect.right >= window.innerWidth - window.innerWidth / 3.6) {
          adminScore = parseInt(playerScoreElem.textContent) + 1;
          playerScoreElem.textContent = adminScore.toString();
        } else {
          player2Score = parseInt(player2ScoreElem.textContent) + 1;
          player2ScoreElem.textContent = player2Score.toString();
        }
        Player2Paddle.reset();
        ball.reset();
      }

      function isLose() {
        const rect = ball.rect();
        return (
          rect.left <= window.innerWidth / 3.6 ||
          rect.right >= window.innerWidth - window.innerWidth / 3.6
        );
      }

      document.addEventListener("mousemove", (e) => {
        playerPaddle.position = (e.y / window.innerHeight) * 100;
        if (ISadmin && Score) {
          socket.emit("coordinates_Admin", {
            playerY: playerPaddle.position,
          });
        } else {
          socket.emit("coordinates_Meet", { playerY: playerPaddle.position });
        }
      });
    }
    runGame = true;
  }, []);

  return (
    <div
      className="gameContainer"
      style={{ height: `${window?.innerHeight}px` }}
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
