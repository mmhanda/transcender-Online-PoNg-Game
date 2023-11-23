"use client";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import Ball from "./Ball";
import Paddle from "./Paddle";
import "./styles.css";
import { useSearchParams } from "next/navigation";

export default function watch() {

  const route = useSearchParams();
  const roomId = route.get('roomId');

  let runGame: boolean = false;

  const router = useSearchParams();
  const color: string | null = router.get("color");

  useEffect(() => {
    if (runGame) {
      // const socket = io("http://10.12.8.8:3001/");
      const socket = io("http://localhost:3001");
      const ball = new Ball(document.getElementById("ball"));
      const playerPaddle = new Paddle(document.getElementById("player-paddle"));
      const Player2Paddle = new Paddle(document.getElementById("bot-paddle"));
      const playerScoreElem: HTMLElement | null = document.getElementById("player-score");
      const player2ScoreElem: HTMLElement | null = document.getElementById("bot-score");
      let Player2Height: number = 50, PlayerHeight: number = 50,
        ballY: number = 50,
        ballX: number = 50;
      const hueColorChangeSet: string | null = color;
      let ISadmin: boolean = false;

      socket.connect();

      socket.on("watch", (draw) => {
        if (parseInt(draw.RoomId) === parseInt(roomId)) {
          console.log(draw.ballX);
          ballX = draw.ballX;
          ballY = draw.ballY;
          Player2Height = draw.playerYAdmin;
          PlayerHeight = draw.playerYMeet;
          playerScoreElem.textContent = draw.AdminScore;
          player2ScoreElem.textContent = draw.MeetScore;
        }
      });

      document.documentElement.style.setProperty("--hue", hueColorChangeSet);

      function update() {
        if (playerScoreElem.textContent === "8" || player2ScoreElem.textContent === "8") {
          ball.x = 50;
          ball.y = 50;
          Player2Paddle.update(50);
          playerPaddle.position = 50;
          socket.disconnect();
          return;
        }

        Player2Paddle.update(Player2Height);
        playerPaddle.position = PlayerHeight;
        ball.update(ISadmin, ballX, ballY);
        window.requestAnimationFrame(update);
      }
      window.requestAnimationFrame(update);
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
      </div>
    </>
  );
}
