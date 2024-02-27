import { default_img } from "@/app/tools/global";
import Image from "next/image";

const GameScore = ({ scoreLeft, scoreRight, UserLeftName, UserRightName, imgAvatar1, imgAvatar2, RankLeft, RankRight, XpLeft, XpRight }:
  { scoreLeft: string, scoreRight: string, UserLeftName: string, UserRightName: string, imgAvatar1: string | null, imgAvatar2: string | null, RankLeft: string, RankRight: string, XpLeft: number, XpRight: number }) => {
  return (
    <div className={`relative mt-20 rounded-xl bg-[#E8CAFF] bg-opacity-20 backdrop-blur-[10px] sm:resize`}>
      <div className="absolute top-[-2.1rem] z-[5] w-full">
        <Image unoptimized  width={100} height={100} alt="Ballbattle" className="w-[4.2rem] h-[4.2rem] mx-auto" src="/BattleBall-logo.svg" />
      </div>
      <div className="flex justify-between items-end relative">
        {/* Player 1 */}
        <div className="flex items-center space-x-4">
          <Image unoptimized  width={100} height={100} src={default_img(imgAvatar1, UserLeftName, 'aa70e4')} alt="UserLeftName" className="min-w-[4rem] w-[4rem] min-h-[4rem] h-[4rem] bg-gray-200 rounded-l-xl " />
          <div className="font-semibold flex-col items-start hidden md:flex">
            <p className="text-xl uppercase overflow-hidden overflow-ellipsis whitespace-nowrap ">{UserLeftName}</p>
            <p className="text-sm mt-[-6px] font-normal text-[#FDB971] overflow-hidden overflow-ellipsis whitespace-nowrap uppercase ">{RankLeft} - LVL {XpLeft == 0 ? '0' : Math.floor(Math.log2(XpLeft))}</p>
          </div>
        </div>


        <div className="absolute w-full h-[60%] flex flex-row items-center justify-center font-semibold text-lg">
          <p className="" id="scoreRight">{scoreRight} </p>
          <p className="mx-2"> - </p>
          <p className="" id="scoreLeft"> {scoreLeft} </p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="font-semibold md:flex flex-col items-end hidden">
            <p className="text-xl uppercase overflow-hidden overflow-ellipsis whitespace-nowrap ">{UserRightName}</p>
            <p className="text-sm mt-[-6px] font-normal text-[#FDB971] overflow-hidden overflow-ellipsis whitespace-nowrap uppercase ">{RankRight} {RankRight && '- LVL'} {RankRight && (XpRight == 0 ? '0' : Math.floor(Math.log2(XpRight)))}</p>
          </div>
          <Image unoptimized  width={100} height={100} src={default_img(imgAvatar2, UserRightName, 'aa70e4')} alt="MB" className="min-w-[4rem] w-[4rem] min-h-[4rem] h-[4rem] bg-gray-200 rounded-r-xl " />
        </div>
      </div>
    </div>
  );
}

export default GameScore;