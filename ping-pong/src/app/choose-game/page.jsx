import Link from "next/link";
import Image from "next/image";

const Page = () => {
  return (
    <div className="flex justify-around items-center h-screen bg-gray-700">
      <Link href="/game-bot" passHref>
        <div className="text-center cursor-pointer mx-4 transform transition-transform hover:scale-105">
          <Image
            src="/choose-game-assets/ai.jpg"
            alt="AI"
            width={500}
            height={500}
          />
          <p className="mt-2 text-lg font-bold">Play against AI</p>
        </div>
      </Link>

      <Link href="/game" passHref>
        <div className="text-center cursor-pointer mx-4 transform transition-transform hover:scale-105">
          <Image
            src="/choose-game-assets/online.jpg"
            alt="Online"
            width={500}
            height={500}
          />
          <p className="mt-2 text-lg font-bold">Play online</p>
        </div>
      </Link>

      <Link href="/game-local" passHref>
        <div className="text-center cursor-pointer mx-4 transform transition-transform hover:scale-105">
          <Image
            src="/choose-game-assets/offline.jpg"
            alt="Offline"
            width={500}
            height={500}
          />
          <p className="mt-2 text-lg font-bold">Play offline</p>
        </div>
      </Link>
    </div>
  );
};

export default Page;
