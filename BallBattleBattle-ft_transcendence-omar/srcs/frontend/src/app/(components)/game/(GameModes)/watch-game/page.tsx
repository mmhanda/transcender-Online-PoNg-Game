"use client";
import { useEffect, useState } from "react";
import Ball from "./Ball";
import Paddle from "./Paddle";
import "./styles.css";
import { useRouter, useSearchParams } from "next/navigation";
import { socket } from "@/app/tools/socket/socket";
import GameScore from "../components/game-score";

interface Tier {
  name: string;
}

interface PlayerStats {
  xp: number;
}

interface FrontendUser {
  Meet_fullName: string;
  Meet_avatar: string | null;
  Meet_table_style: number;
  Admin_fullName: string;
  Admin_avatar: string | null;
  Admin_table_style: number;
  Admin_player_state: PlayerStats;
  Meet_player_state: PlayerStats;
  Admin_tier: Tier;
  Meet_tier: Tier;
}

const mapSkin = [
  "from-[#ffffff28] to-[#ffffff28]",
  "from-[#fefea857] to-[#fefea857]",
  "from-[#de979757] to-[#de979757]"
];

const Watch = () => {

  const route = useSearchParams();
  const redirect = useRouter();

  const [scoreLeft, setScoreLeft] = useState<string>('0');
  const [scoreRight, setScoreRight] = useState<string>('0');
  const [fontUser, setFrontUser] = useState<FrontendUser>();
  const [fontUserMapSkin, setFontUserMapSkin] = useState<number>(0);
  useEffect(() => {
    const roomId = route.get('roomId');
    let clearTime: any;

    const disconnect = () => {
      socket.off("watch");
      clearTimeout(clearTime);
    }

    const ball = new Ball(document.getElementById("ball"));
    const playerPaddle = new Paddle(document.getElementById("player-paddle"));
    const Player2Paddle = new Paddle(document.getElementById("bot-paddle"));
    let Player2Height: number = 50, PlayerHeight: number = 50,
      ballY: number = 50,
      ballX: number = 50;
    let ISadmin: boolean = false;
    let keepUpdating: boolean = true;

    socket.emit("get-Player-Data", { roomId });

    socket.on("get-Player-Data", (fontUser: FrontendUser) => {
      setFontUserMapSkin(fontUser?.Admin_table_style!);
      setFrontUser(fontUser);
    });

    socket.on("watch-disconnect", (game) => {
      if (parseInt(game.RoomId) === parseInt(roomId!)) {
        keepUpdating = false;
        clearTime = setTimeout(() => {
          redirect.replace('/');
        }, 3400);
      }
    });

    socket.on("watch", (draw) => {
      if (parseInt(draw.RoomId) === parseInt(roomId!)) {
        ballX = draw.ballX;
        ballY = draw.ballY;
        Player2Height = draw.playerYAdmin;
        PlayerHeight = draw.playerYMeet;
        setScoreLeft(draw.AdminScore);
        setScoreRight(draw.MeetScore);
        if (draw.AdminScore == "8" || draw.MeetScore == "8") {
          keepUpdating = false;
          clearTime = setTimeout(() => {
            redirect.replace('/');
          }, 3400);
        }
      }
    });

    function update() {
      if (keepUpdating === false) {
        ball.x = 50;
        ball.y = 50;
        Player2Paddle.update(50);
        playerPaddle.position = 50;
        return;
      }

      Player2Paddle.update(Player2Height);
      playerPaddle.position = PlayerHeight;
      ball.update(ISadmin, ballX, ballY);
      window.requestAnimationFrame(update);
    }
    window.requestAnimationFrame(update);

    return () => {
      disconnect();
    };
  }, [route, redirect]);

  return (
    <div className="flex justify-center relative h-screen">
      <div className={`gameCol flex flex-col relative space-y-8`}>
        <GameScore imgAvatar2={fontUser?.Admin_avatar!} imgAvatar1={fontUser?.Meet_avatar!} scoreLeft={scoreRight} scoreRight={scoreLeft} UserLeftName={fontUser?.Meet_fullName!} UserRightName={fontUser?.Admin_fullName!} RankLeft={fontUser?.Admin_tier?.name!} RankRight={fontUser?.Meet_tier?.name!} XpLeft={fontUser?.Admin_player_state.xp!} XpRight={fontUser?.Meet_player_state.xp!} />
        <div className="table h-[40%] z-[100000000] lg:h-[50%] 2xl:h-[60%] relative items-center justify-center">
          <div className={mapSkin[fontUserMapSkin] + ' after:rounded-r-[5px] after:absolute after:border-[5px] after:border-l-[0px] after:right-0 after:border-white after:h-full after:w-[calc(50%-18px)] '
            + ' before:absolute before:border-[5px] before:border-r-[0px] before:left-0 before:border-white before:h-full before:w-[calc(50%-18px)] before:rounded-l-[5px] '
            + " backdrop-blur-md from-0% bg-gradient-to-br via-[#ff000000] w-full h-full"}></div>
          <div className="ball bg-[#A970E3]" id="ball"></div>
          <div className="paddle left bg-white z-30 " id="player-paddle"></div>
          <div className="paddle right bg-white z-30 " id="bot-paddle"></div>
          <div className="h-full w-[6px] bg-white bg-opacity-20 absolute rounded-full"></div>
          <div className='h-[3px] w-full before:w-[calc(50%-11px-4%)] before:right-[calc(8px+2%)] before:h-full before:absolute before:bg-white before:bg-opacity-30 after:w-[calc(50%-11px-4%)] after:left-[calc(8px+2%)] after:h-full after:absolute after:bg-white after:bg-opacity-30 absolute rounded-full'></div>
        </div>
      </div>
    </div >
  );
}

export default Watch;