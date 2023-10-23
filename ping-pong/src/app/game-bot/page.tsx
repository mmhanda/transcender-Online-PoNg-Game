"use client";

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
  // const socket = useContext(WebsocketContext);

  const [value, setValue] = useState("");

  const [messages, setMessages] = useState<MessagePayload[]>([]);

  useEffect(() => {
    // socket.on("connect", () => {
    //     console.log("Connected !");
    //   });

    //   socket.on("onMessage", (newMessage: MessagePayload) => {
    //       console.log("onMessage Event Recived!");
    //       console.log("newMessage.content: " + newMessage.content);
    //   setMessages((prev) => [...prev, newMessage]);
    // });

    // socket.on("specialEvent", (data) => {
    //   console.log(data);
    // });

    if (runGame) {
      console.log(runGame);
      const ball = new Ball(document.getElementById("ball"));
      const playerPaddle = new Paddle(document.getElementById("player-paddle"));
      const botPaddle = new Paddle(document.getElementById("bot-paddle"));
      const playerScoreElem = document.getElementById("player-score");
      const botScoreElem = document.getElementById("bot-score");

      let LastTime: any = null;

      function update(time: any) {
        if (LastTime != null) {
          const delta: number = time - LastTime;
          let Player2Rect = botPaddle.rect();
          console.log("top " + Player2Rect.top);
          console.log("bottom " + Player2Rect.bottom);
          console.log("left " + Player2Rect.left);
          console.log("right " + Player2Rect.right);
          ball.update(delta, [playerPaddle.rect(), botPaddle.rect()]);
          botPaddle.update(delta, ball.y);
          // console.log(delta);
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

        if (!playerScoreElem | !botScoreElem) return;
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
        playerPaddle.position = (e.y / window.innerHeight) * 100; //for getting to percentenge of the window of where the mouse is and the paddle should go
      });
      window.requestAnimationFrame(update);
    }

    runGame = true;

    // return () => {
    //     /// in this cleanup function we turn off the socket to prevent it from desconection when getting out of the compenent and the need of reconecting again
    //   console.log("Unregistering Events...");
    //   socket.off("onMessage");
    //   socket.off("connect");
    //   socket.off("specialEvent");
    // };
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
