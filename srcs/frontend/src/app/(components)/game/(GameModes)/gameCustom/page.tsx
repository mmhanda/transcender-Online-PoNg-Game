"use client";
import { useEffect, useState } from "react";
import Ball from "./Ball";
import Paddle from "./Paddle";
import "./styles.css";
import { useSearchParams } from "next/navigation";
import { socket } from "@/app/tools/socket/socket";
import GameState from "../components/game-state";
import GameScore from "../components/game-score";
import { useRouter } from 'next/navigation';

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

const Pong = () => {

  const router = useSearchParams();
  const redirect = useRouter();
  const [scoreLeft, setScoreLeft] = useState('0');
  const [scoreRight, setScoreRight] = useState('0');
  const [step, setStep] = useState<number>(0);
  const [Updating, setUpdating] = useState<boolean>(false);
  const [Winner, setWinner] = useState<boolean>(false);
  const [fontUser, setFrontUser] = useState<FrontendUser>();
  const [fontUserMapSkin, setFontUserMapSkin] = useState<number>(0);

  useEffect(() => {

    let keepUpdating: boolean = false,
      isMeet: boolean = false, clearTime1: any, clearTime2: any, clearTime3: any, isWinnerAnnounced: boolean = false;

    const disconnect = () => {
      clearTimeout(clearTime2);
      clearTimeout(clearTime3);
      socket.emit("disconnect-custom");
      socket.off("join-room-custom");
      socket.off("isAdminCustom");
      socket.off("DrawCustom");
      socket.off("meet-disconnected-custom");
    }

    const ball = new Ball(document.getElementById("ball"));
    const playerPaddle = new Paddle(document.getElementById("player-paddle"));
    const Player2Paddle = new Paddle(document.getElementById("bot-paddle"));
    let Player2Height: number = 50,
      ballY: number = 50,
      ballX: number = 50;
    let ISadmin: boolean = false, CreateOrJoin: string = "", MeetId: string = "";

    CreateOrJoin = router.get("CreateOrJoin") === "create" ? 'create' : 'join';

    MeetId = router.get("userId") as string;

    socket.emit("join-room-custom", { CreateOrJoin, MeetId });
    socket.once("isAdminCustom", (Admin) => {
      if (Admin?.isAdmin === "true") {
        keepUpdating = true;
        ISadmin = true;
        clearTime3 = setTimeout(() => {
          if (!isMeet) setStep(2);
        }, 12000);
        clearTime2 = setTimeout(() => {
          if (!isMeet) redirect.replace('/game');
        }, 15000);
      }
    });

    socket.on("user-data-Admin-Custom", (data: FrontendUser) => {
      setFontUserMapSkin(data?.Admin_table_style!);
      setFrontUser(data);
    });

    socket.on("user-data-Custom", (data: FrontendUser) => {
      setFontUserMapSkin(data?.Admin_table_style!);
      setFrontUser(data);
    });

    socket.once("meet-joined-custom", async () => {
      setStep(1);
      await new Promise((resolve) => setTimeout(resolve, 5000));
      if (isWinnerAnnounced) return;
      setStep(3);
      setUpdating(true);
      if (ISadmin) {
        keepUpdating = false;
        isMeet = true;
        window.requestAnimationFrame(update);
      } else {
        isMeet = true;
        update();
      }
    });

    socket.on("DrawCustom", (draw) => {
      ballX = draw.ballX;
      ballY = draw.ballY;
      if (ISadmin) {
        Player2Height = draw.playerYMeet;
        setScoreLeft(draw.AdminScore);
        setScoreRight(draw.MeetScore);
        if (draw.AdminScore == "8" || draw.MeetScore == "8") {
          keepUpdating = true;
        }
      } else {
        setScoreLeft(draw.MeetScore);
        setScoreRight(draw.AdminScore);
        Player2Height = draw.playerYAdmin;
        if (draw.AdminScore == "8" || draw.MeetScore == "8") {
          keepUpdating = true;
        }
      }
    });

    socket.on("meet-disconnected-custom", () => {
      announceWinner(false);
      clearTimeout(clearTime2);
      clearTimeout(clearTime3);
    });

    const announceWinner = (Who: boolean) => {
      setUpdating(false);
      isWinnerAnnounced = true;
      if (Who) {
        if (ISadmin) {
          if (Number(document.getElementById("scoreLeft")?.textContent!) < Number(document.getElementById("scoreRight")?.textContent!)) {
            setWinner(true);
          } else setWinner(false);
          setStep(4);
        } else {
          if (Number(document.getElementById("scoreLeft")?.textContent!) < Number(document.getElementById("scoreRight")?.textContent!)) {
            setWinner(true);
          } else setWinner(false);
          setStep(4);
        }
      } else {
        setWinner(true);
        setStep(4);
      }

      clearTime1 = setTimeout(() => {
        redirect.replace('/game');
      }, 5000);
    }

    function update() {
      if (keepUpdating || !isMeet
      ) {
        ball.x = 50;
        ball.y = 50;
        disconnect();
        announceWinner(true);
        return;
      }

      Player2Paddle.update(Player2Height);

      ball.update(ISadmin, ballX, ballY);
      window.requestAnimationFrame(update);
    }

    document.getElementById("table")?.addEventListener("mousemove", (e) => {
      const paddleTable = document.getElementById("table")?.getBoundingClientRect();
      const pos: number | undefined = (e.y - (paddleTable?.bottom! - paddleTable?.height!)) / (paddleTable?.height!) * 100;
      if (pos >= 90 || pos <= 10) return;
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
    }
    );

    return () => {
      disconnect();
      clearTimeout(clearTime1);
    }
  }, [redirect, router]);

  return (
    <div className="flex justify-center relative h-screen">
      {
        (step != 3) &&
        <div className="w-full z-20 h-full">
          <div className="w-full h-full flex justify-center items-center">
            <GameState step={step} win={Winner} imgAvatar1={fontUser?.Admin_avatar!} imgAvatar2={fontUser?.Meet_avatar!} UserLeftName={fontUser?.Admin_fullName!} UserRightName={fontUser?.Meet_fullName!} RankLeft={fontUser?.Admin_tier?.name!} RankRight={fontUser?.Meet_tier?.name!} XpLeft={fontUser?.Admin_player_state.xp!} XpRight={fontUser?.Meet_player_state.xp!} />
          </div>
        </div>
      }
      <div className={`gameCol flex flex-col relative space-y-8 ${!Updating && 'hidden'}`}>
        <GameScore imgAvatar1={fontUser?.Admin_avatar!} imgAvatar2={fontUser?.Meet_avatar!} scoreLeft={scoreLeft} scoreRight={scoreRight} UserLeftName={fontUser?.Admin_fullName!} UserRightName={fontUser?.Meet_fullName!} RankLeft={fontUser?.Admin_tier?.name!} RankRight={fontUser?.Meet_tier?.name!} XpLeft={fontUser?.Admin_player_state.xp!} XpRight={fontUser?.Meet_player_state.xp!} />
        <div className="table h-[40%] z-[100000000] lg:h-[50%] 2xl:h-[60%] relative items-center justify-center" id="table">
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

export default Pong;
