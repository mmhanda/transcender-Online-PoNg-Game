"use client";
import { useEffect, useState } from "react";
import Ball from "./Ball";
import Paddle from "./Paddle";
import "./styles.css";
import { socket } from "@/app/tools/socket/socket";
import GameScore from "../components/game-score";
import GameState from '../components/game-state';
import { useRouter } from "next/navigation";

const mapSkin = [
  "from-[#ffffff28] to-[#ffffff28]",
  "from-[#fefea857] to-[#fefea857]",
  "from-[#de979757] to-[#de979757]"
]

interface Tier {
  name: string;
}

interface PlayerStats {
  xp: number;
}

interface FrontendUser {
  fullname: string;
  avatar: string | null;
  table_style: number;
  playerStats: PlayerStats;
  tier: Tier;
};

export default function PongBot() {

  const [scoreLeft, setScoreLeft] = useState('0');
  const [scoreRight, setScoreRight] = useState('0');

  const [step, setStep] = useState<number>(1);
  const [Updating, setUpdating] = useState<boolean>(false);
  const [Winner, setWinner] = useState<boolean>(false);

  const [fontUser, setFrontUser] = useState<FrontendUser>();

  const redirect = useRouter();

  useEffect(() => {
    const ball = new Ball(document.getElementById("ball"));
    const playerPaddle = new Paddle(document.getElementById("player-paddle"));
    const Player2Paddle = new Paddle(document.getElementById("bot-paddle"));
    let Player2Height: number = 50,
      ballY: number = 50,
      ballX: number = 50;
    let keepUpdating: boolean = true, onStart: boolean = false, clearTime: any;

    socket.emit("join-room-bot");

    socket.once("user-data-bot", (data: FrontendUser) => {
      setFrontUser(data);
    });

    socket.on("DrawBot", (draw) => {
      ballX = draw.ballX;
      ballY = draw.ballY;
      Player2Height = draw.playerYMeet;
      setScoreLeft(draw.AdminScore);
      setScoreRight(draw.MeetScore);
      if (draw.AdminScore == "8" || draw.MeetScore == "8") {
        keepUpdating = false;
      }
    });

    const waitForGameStart = async () => {
      if (!onStart) {
        await new Promise((resolve) => setTimeout(resolve, 4500));
        onStart = true;
      }
      setStep(3);
      setUpdating(true);
    }

    const disconnect = () => {
      socket.emit("disconnect-bot");
      socket.off("join-room-bot");
      socket.off("DrawBot");
      ball.x = 50;
      ball.y = 50;
      Player2Paddle.position = 50;
    }

    const announceWinner = () => {
      setUpdating(false);
      setWinner(document.getElementById("scoreLeft")?.textContent! > document.getElementById("scoreRight")?.textContent!);
      setStep(4);
      clearTime = setTimeout(() => {
        redirect.replace('/game');
      }, 3000);
    }

    function update() {
      if (keepUpdating === false) {
        disconnect();
        announceWinner();
        return;
      }

      Player2Paddle.update(Player2Height);

      ball.update(ballX, ballY);
      window.requestAnimationFrame(update);
    }
    waitForGameStart();
    update();

    document.getElementById("table")?.addEventListener("mousemove", (e) => {
      const paddleTable = document.getElementById("table")?.getBoundingClientRect();
      const pos = (e.y - (paddleTable?.bottom! - paddleTable?.height!)) / (paddleTable?.height!) * 100;
      if (pos >= 90 || pos <= 10) return;
      playerPaddle.position = pos;
      socket.emit("coordinates_Admin_Bot", {
        playerY: pos,
      });
    }
    );

    return () => {
      disconnect();
      clearTimeout(clearTime);
    }
  }, [redirect]);

  return (
    <div className="flex justify-center relative h-screen">
      {
        (step != 3) &&
        <div className="w-full z-20 h-full">
          <div className="w-full h-full flex justify-center items-center">
            <GameState step={step} win={Winner} imgAvatar1={fontUser?.avatar!} imgAvatar2={null} UserLeftName={fontUser?.fullname!} UserRightName='Mega Bot' RankLeft={fontUser?.tier?.name!} RankRight={"Master"} XpLeft={fontUser?.playerStats.xp!} XpRight={0} />
          </div>
        </div>
      }
      <div className={`gameCol flex flex-col relative space-y-8 ${!Updating && 'hidden'}`}>
        <GameScore imgAvatar1={fontUser?.avatar!} imgAvatar2={null} scoreLeft={scoreLeft} scoreRight={scoreRight} UserLeftName={fontUser?.fullname!} UserRightName='Mega Bot' RankLeft={fontUser?.tier?.name!} RankRight={'Master'} XpLeft={fontUser?.playerStats.xp!} XpRight={0} />
        <div
          className="table h-[40%] z-[100000000] lg:h-[50%] 2xl:h-[60%] relative items-center justify-center"
          id="table"
        >
          <div className={mapSkin[fontUser?.table_style! ? fontUser?.table_style! : 0] + ' after:rounded-r-[5px] after:absolute after:border-[5px] after:border-l-[0px] after:right-0 after:border-white after:h-full after:w-[calc(50%-18px)] '
            + ' before:absolute before:border-[5px] before:border-r-[0px] before:left-0 before:border-white before:h-full before:w-[calc(50%-18px)] before:rounded-l-[5px] '
            + " backdrop-blur-md from-0% bg-gradient-to-br via-[#ff000000] w-full h-full"} ></div>
          <div className="ball bg-[#A970E3]" id="ball"></div>
          <div className="paddle left bg-white z-30" id="player-paddle"></div>
          <div className="paddle right bg-white z-30" id="bot-paddle"></div>
          <div className='h-full w-[6px] bg-white bg-opacity-20 absolute rounded-full'></div>
          <div className='h-[3px] w-full before:w-[calc(50%-11px-4%)] before:right-[calc(8px+2%)] before:h-full before:absolute before:bg-[#aa70e4] before:bg-opacity-30 after:w-[calc(50%-11px-4%)] after:left-[calc(8px+2%)] after:h-full after:absolute after:bg-[#aa70e4] after:bg-opacity-30 absolute rounded-full'></div>
        </div>
      </div>
    </div>
  );
}