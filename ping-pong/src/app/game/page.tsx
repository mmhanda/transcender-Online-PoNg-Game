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
      const playerScoreElem = document.getElementById("player-score");
      const botScoreElem = document.getElementById("bot-score");
      let Player2Height: any;
      let Player2Rect: any;
      let ISadmin: any = undefined;
      let ballY: any, ballX: any, ballRect: any;
      let hueColorChangeSet: string = "";
      socket.on("connect", () => {
        console.log("Connected !");
      });

      // socket.on("onMessage", (newMessage: MessagePayload) => {
      //   console.log("onMessage Event Recived!");
      //   console.log("newMessage.content: " + newMessage.content);
      //   setMessages((prev) => [...prev, newMessage]);
      // });

      // socket.on("specialEvent", (data) => {
      //   console.log(data);
      // });

      socket.emit("join-room");

      socket.once("isAdmin", (Admin) => {
        if (Admin.isAdmin === "true") {
          ISadmin = true;
        } else {
          ISadmin = false;
        }
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
          if (Player2.ballRect) {
            ballRect = Player2.ballRect;
          }
          if (Player2.hue) {
            hueColorChangeSet = Player2.hue;
          }
        }
      });

      let LastTime: any = null;

      function update(time: any) {
        if (LastTime != null) {
          const delta: number = time - LastTime;

          let playerPaddleRect = playerPaddle.rect();

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
                ballRect: ball.rect(),
                hue: hueColorChangeSet,
                rect: playerPaddleRect,
              });
            } else {
              console.log(hueColorChangeSet);
              document.documentElement.style.setProperty(
                "--hue",
                hueColorChangeSet
              );
            }
          }

          if (!ISadmin) {
            socket.emit("coordinates_Meet", { rect: playerPaddleRect });
          }

          Player2Paddle.update(delta, Player2Height); // this var need to be recived
          if (isLose()) {
            handleLose();
          }
        }
        LastTime = time;
        window.requestAnimationFrame(update);
      }

      function handleLose() {
        const rect = ball.rect();

        if (!playerScoreElem | !botScoreElem) return;
        if (rect.right >= window.innerWidth) {
          const typeChanger: number = parseInt(playerScoreElem.textContent) + 1;
          playerScoreElem.textContent = typeChanger.toString();
        } else {
          const typeChanger: number = parseInt(botScoreElem.textContent) + 1;
          botScoreElem.textContent = typeChanger.toString();
        }
        ball.reset();
        Player2Paddle.reset();
      }

      function isLose() {
        const rect = ball.rect();
        return rect.left <= 0 || rect.right >= window.innerWidth;
      }

      document.addEventListener("mousemove", (e) => {
        playerPaddle.position = (e.y / window.innerHeight) * 100; //for getting to percentenge of the window of where the mouse is and the paddle should go
        if (ISadmin) {
          socket.emit("coordinates_Admin", { playerY: playerPaddle.position });
        } else {
          socket.emit("coordinates_Meet", { playerY: playerPaddle.position });
        }
      });
      window.requestAnimationFrame(update);

      return () => {
        /// in this cleanup function we turn off the socket to prevent it from desconection when getting out of the compenent and the need of reconecting again
        console.log("Unregistering Events...");
        socket.off("onMessage");
        socket.off("connect");
        socket.off("specialEvent");
      };
    }
    runGame = true;
  }, []);

  // const submitHandler = () => {
  //   socket.emit("newMessage", value);
  //   setValue("");
  // };

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
