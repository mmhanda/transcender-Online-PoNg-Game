'use client';
import Link from "next/link";
import './match.css'
import Image from 'next/image';
import { socket } from "@/app/tools/socket/socket";
import { useEffect, useState } from "react";
import { default_img } from "@/app/tools/global";

const Match = ({ gameData, Data }: any) => {
	return (
		<div className=" mx-0.5 ">
			<div style={{ borderTopLeftRadius: 15, borderTopRightRadius: 15 }} className="flex bg-white w-[185px] overflow-hidden relative">
				<Image unoptimized  width={200} height={200} src={default_img((gameData as any)?.Meet_avatar ? Data[(gameData as any)?.Meet_avatar] : null, Data[(gameData as any)?.Meet_fullName])}
					alt="Image 1"
					className="image image-left w-24 h-24" />
				<Image unoptimized  width={200} height={200} src={default_img((gameData as any)?.Admin_avatar ? Data[(gameData as any)?.Admin_avatar] : null, Data[(gameData as any)?.Admin_fullName])}
					alt="Image 1"
					className="image image-right w-24 h-24 left-[-7px]" />
				<div className="absolute w-full h-full flex justify-center items-center ">
					<div className="bg-white w-7 h-7 rounded-full flex  justify-center items-center text-[#ba3939] font-bold text-xs pt-[2px] ">VS</div>
				</div>
			</div>
			<div className="relative overflow-hidden w-full bg-match rounded-b-xl text-center pt-[0.4rem] pb-[0.4rem]  ">
				<div style={{ wordSpacing: 3 }} className="p-0.5 font-light text leading-3 mb-[0.3rem]">{(gameData as any)?.scoreLeft + " - " + (gameData as any)?.scoreRight}</div>
			</div>
		</div>
	)
}

const Matches = ({ isLogin = false }: { isLogin: boolean }) => {

	const [liveGames, setLiveGames] = useState([]);
	const [Data, setData] = useState<any>({});
	const [liveGamesCustom, setLiveGamesCustom] = useState([]);
	const [DataCustom, setDataCustom] = useState<any>({});

	const disconnect = () => {
		socket.off("get-rooms");
		socket.off("Rooms-Change");
	}

	useEffect(() => {
		socket.emit("get-Rooms");
		socket.on("get-rooms", (Rooms) => {
			setData(Rooms);
			setLiveGames(Rooms.slice(1).filter((gameData: any) =>
				typeof gameData.scoreLeft !== "undefined" &&
				typeof gameData.scoreRight !== "undefined" &&
				typeof gameData.roomId !== "undefined")
			);
		});

		socket.on("Rooms-Change", (Changes) => {
			setData(Changes);
			setLiveGames(Changes.slice(1).filter((gameData: any) =>
				typeof gameData.scoreLeft !== "undefined" &&
				typeof gameData.scoreRight !== "undefined" &&
				typeof gameData.roomId !== "undefined")
			);
		});

		socket.emit("get-Rooms-custom");
		socket.on("get-rooms-custom", (Rooms) => {
			setDataCustom(Rooms);
			setLiveGamesCustom(Rooms.slice(1).filter((gameData: any) =>
				typeof gameData.scoreLeft !== "undefined" &&
				typeof gameData.scoreRight !== "undefined" &&
				typeof gameData.roomId !== "undefined")
			);
		});

		socket.on("Rooms-Change-custom", (Changes) => {
			setDataCustom(Changes);
			setLiveGamesCustom(Changes.slice(1).filter((gameData: any) =>
				typeof gameData.scoreLeft !== "undefined" &&
				typeof gameData.scoreRight !== "undefined" &&
				typeof gameData.roomId !== "undefined")
			);
		});

		return () => {
			disconnect();
		};
	}, []);

	return (
		<div className='w-full mb-4' id='matches-section'>
			<div className={'flex justify-between items-center py-2 ' + ((isLogin) ? ' px-[2rem] bg-[#fff] bg-opacity-[.08] border-[#ffffff] border-opacity-[.20] border-b-[.1px]' : ' px-4 ')}>
				<div className='flex items-center gap-3  '>
					<div className=' border-[2px] border-[#d17d7d] w-14 h-14 rounded-full bg-[#ba3939] flex justify-center'>
						<Image unoptimized  width={200} height={200} className=' w-7  self-center mb-[2px] ' src='/cloud.svg' alt='leaderboard' />
					</div>
					<div className=''>
						<div className=' text-white text-[1.3rem] font-light leading-[20px] '>Gameplays</div>
						<div className='text-[#d17d7d] text-xs leading-[15px] mt-1'>Hot live games</div>
					</div>
				</div>
			</div>
			<div className={'relative pb-3 w-full grid ' + ((isLogin) ? " px-4 bg-[#fff] bg-opacity-[.05]" : "")}>
				<ul className='flex flex-row our-scroll overflow-y-hidden justify-between'>

					{liveGames.map((gameData, index) => (
						<li
							className='relative cursor-pointer px-3 py-2 mt-4 rounded-full select-none'
							key={"match-" + index}
						>
							<Link href={`/game/watch-game?roomId=${Data[(gameData as any)?.roomId]}`}>
								<Match gameData={gameData} Data={Data} />
							</Link>
						</li>
					))
					}

					{liveGamesCustom.map((gameData, index) => (
						<li
							className='relative cursor-pointer px-3 py-2 mt-4 rounded-full select-none'
							key={"match-" + index}
						>
							<Link href={`/game/watch-game?roomId=${DataCustom[(gameData as any)?.roomId]}`}>
								<Match gameData={gameData} Data={DataCustom} />
							</Link>
						</li>
					))
					}

				</ul>
			</div>
		</div>
	)
}

export default Matches;