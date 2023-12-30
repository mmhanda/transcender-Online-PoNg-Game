'use client'

import Image from "next/image";
import { FC } from "react";

interface LoadingProps {
  show: boolean;
}

const Comp: FC<LoadingProps> = ({ show }) => {
  return (
    <div className={!show ? "hidden" : "absolute w-full h-full top-0 bottom-0 right-0 left-0 bg-[#2b243d] backdrop-blur-[5px] bg-opacity-50 flex justify-center"}>
      <div className="flex flex-col justify-center items-center delay-1000">
        <Image unoptimized  src="/loading.svg" width={150} height={150} alt="Loading..." priority={true} />
        <div className="text-white text-[1rem] mt-4">Loading...</div>
      </div>
    </div>
  );
};

const Loading = () => {
  return (
    <Comp show={true} />
  )
}

export default Loading;