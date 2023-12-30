import { default_img } from "@/app/tools/global";
import Image from "next/image";

import React, { useEffect, useState } from 'react';

const State = ({ step, win }: { step: number; win: boolean }) => {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    let countdownInterval: NodeJS.Timeout;

    if (step === 1) {
      countdownInterval = setInterval(() => {
        setCountdown((prevCountdown) => (prevCountdown > 0 ? prevCountdown - 1 : 0));
      }, 1000);
    }

    return () => {
      clearInterval(countdownInterval);
    };
  }, [step]);

  switch (step) {
    case 0:
      return (
        <>
          <p className="">WAITING</p>
          <p className="">...</p>
        </>
      );

    case 1:
      return (
        <>
          <p className="">GAME START</p>
          <p className="">
            IN <span className="opacity-50">{countdown}s</span>
          </p>
        </>
      );

    case 2:
      return (
        <div className="text-[#E28383]">
          <p className="">CHALLENGE</p>
          <p className="">NOT ACCEPTED</p>
        </div>
      );

    case 4:
      return (
        <>
          <p className="">YOU</p>
          <p className={win ? 'text-[#95cb3e]' : 'text-[#E28383]'}>
            {win ? 'WON' : 'LOST'}
          </p>
        </>
      );

    case 5:
      return (
        <>
          <p className="text-[#E28383]">YOU ARE ALREADY IN GAME</p>
        </>
      );

    default:
      return null;
  }
};

const GameState = ({ step, win, UserLeftName, UserRightName, imgAvatar1, imgAvatar2, RankLeft, RankRight, XpLeft, XpRight }: { step: number, win: boolean, UserLeftName: string, UserRightName: string, imgAvatar1: string | null, imgAvatar2: string | null, RankLeft: string, RankRight: string, XpLeft: number, XpRight: number }) => {
  return (
    <div className={`w-2/3 relative mt-20 rounded-xl bg-[#E8CAFF] bg-opacity-20 backdrop-blur-[10px] sm:resize`}>
      <div className="absolute top-[-2.7rem] z-[5] w-full">
        <Image unoptimized  width={100} height={100} alt="Ballbattle" className="w-[4.2rem] h-[4.2rem] mx-auto" src="/BattleBall-logo.svg" />
      </div>
      <div className="flex justify-between items-center relative">
        <div className="flex items-center">
          <Image unoptimized  width={100} height={100} src={default_img(imgAvatar1, UserLeftName, 'aa70e4')} alt="UserLeftName" className="min-w-[4.5rem] min-h-[4.5rem] bg-gray-200 rounded-l-xl !m-0" />
          <div className="font-semibold flex-col items-start hidden md:flex md:ml-3">
            <p className="text-xl uppercase overflow-hidden overflow-ellipsis whitespace-nowrap max-w-[130px]">{UserLeftName}</p>
            <p className="text-sm mt-[-6px] font-normal text-[#FDB971] overflow-hidden overflow-ellipsis whitespace-nowrap uppercase ">{RankLeft} - LVL {XpLeft == 0 ? '0' : Math.floor(Math.log2(XpLeft))}</p>
          </div>
        </div>
        <div className="relative top-[12px] w-full  text-center leading-[16px] font-semibold text-[14px]">
          <State step={step} win={win} />
        </div>

        <div className="flex items-center">
          <div className="font-semibold md:flex flex-col items-end hidden md:mr-3">
            <p className="text-xl uppercase overflow-hidden overflow-ellipsis whitespace-nowrap max-w-[130px]">
              {
                (step == 0 || step == 2) && UserRightName == "Guest" ?
                  <div className="h-[18px] animate-pulse bg-white bg-opacity-40 rounded w-[100px] mb-[6px]"></div>
                  : UserRightName
              }
            </p>
            <p className="text-sm mt-[-6px] font-normal text-[#FDB971] overflow-hidden overflow-ellipsis whitespace-nowrap uppercase ">
            {RankRight} {RankRight && '- LVL'} {RankRight && (XpRight == 0 ? '0' : Math.floor(Math.log2(XpRight)))}
            </p>
          </div>
          {
            (step == 0 || step == 2) && UserRightName == "Guest"
              ?
              <div className="min-w-[4.5rem] min-h-[4.5rem] w-[4.5rem] bg-[#aa70e4] h-[4.5rem] relative">
                <span className="animate-ping inline-flex w-full h-full bg-[#aa70e4] opacity-75">
                  <span className="relative w-full h-full flex justify-center items-center top-[-8px] text-2xl">...</span>
                </span>
              </div>
              : <Image unoptimized  width={100} height={100} src={default_img(imgAvatar2, UserRightName, 'aa70e4')} alt={'UserRightName'} className="min-w-[4.5rem] min-h-[4.5rem] bg-gray-200 rounded-r-xl !m-0" />
          }

        </div>
      </div>
    </div>
  )
}

export default GameState;