"use client";
import Link from "next/link";
import Image from "next/image";

const Page = () => {
  const data = [
    {
      img: "/choose-game-assets/robot.svg",
      title: "with bot",
      actionText: "play now",
      link: "/game/game-bot",
    },
    {
      img: "/choose-game-assets/earth.svg",
      title: "with other players",
      actionText: "play now",
      link: "/game/game",
    },
    {
      img: "/choose-game-assets/cloud.svg",
      title: "watch live",
      actionText: "go to dashboard",
      link: "/",
    },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh+70px)] items-center justify-center pt-64 lg:pt-0">
      <b className="text-white font-bold text-3xl lg:text-4xl uppercase -mt-20">CHOOSE and enjoy!</b>
      <div className="mt-10 flex flex-col items-center justify-center gap-10 lg:flex-row">
        {data.map((item) => (
          <Choice key={item.img} {...item} />
        ))}
      </div>
    </div>
  );
};

const Choice = ({
  img,
  title,
  actionText,
  link,
}: {
  img: string;
  title: string;
  actionText: string;
  link: string;
}) => {
  return (
    <div className="flex w-full max-w-[300px] min-w-[280px] flex-col rounded-2xl border-4 border-purple-950 border-opacity-40 bg-[#a970e333]">
      <div className="flex flex-grow flex-col items-center justify-center space-y-4 py-10">
        <Image unoptimized  src={img} alt="AI" width={100} height={100} className="aspect-square" />
        <p className="whitespace-nowrap text-xl uppercase opacity-70 w-full text-center">
          {title}
        </p>
      </div>
      <Link href={link}>
        <button className="w-full whitespace-nowrap rounded-b-2xl bg-[#A970E3] px-4 py-6 text-xl uppercase">
          {actionText}
        </button>
      </Link>
    </div>
  );
};

export default Page;
