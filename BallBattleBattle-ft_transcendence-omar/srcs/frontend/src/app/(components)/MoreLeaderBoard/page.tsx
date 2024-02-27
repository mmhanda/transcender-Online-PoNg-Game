'use client';
import "./more.css"
import Infos from "./infos"
import Image from 'next/image'
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import { Localhost, default_img } from "@/app/tools/global";
import Link from "next/link";

const Top3 = ({ rank }: { rank:number }) => {
    if (rank == 1)
        return (
            <div className="flex w-full justify-center items-center mt-[-4px]">
                <Image unoptimized  width={100} height={100} src="/GoldCrown.svg" alt="trophy" className="z-[1] absolute rotate-[-30deg] h-14 w-14 inline-block" />
                <span className="z-[2] text-[#b68900] pt-2 font-bold w-full text-[12px] text-center">
                    1
                </span>
            </div>
        )
    else if (rank == 2)
        return (
            <div className="flex w-full justify-center items-center mt-[-4px]">
                <Image unoptimized  width={100} height={100} src="/PlomoPlata.svg" alt="trophy" className="z-[1] absolute rotate-[-30deg] h-14 w-14 inline-block" />
                <span className="z-[2] text-[#7d7d7d] pt-2 font-bold w-full text-[12px] text-center">
                    2
                </span>
            </div>
        )
    else
        return (
            <div className="flex w-full justify-center items-center mt-[-4px]">
                <Image unoptimized  width={100} height={100} src="/Cu.svg" alt="trophy" className="z-[1] absolute rotate-[-30deg] h-14 w-14 inline-block" />
                <span className="z-[2] text-[#763805] pt-2 font-bold w-full text-[12px] text-center">
                    3
                </span>
            </div>
        )
}


const LeaderBoardMore = () => {
    const [basicInfo, setBasicInfo] = useState<any>(null);
    const { data, isLoading, error, status } = useQuery({
        queryKey: ['leaderboard-page'],
        queryFn: async () => {
            axios.defaults.withCredentials = true;
            try {
                const response = await axios.get(`${Localhost()}/playerstats/leaderboard/top100`);
                return response.data;
            } catch (error) {
                
            }
        }
    });

    useEffect(() => {
        if (data && data.length > 0)
            setBasicInfo({item:data[0], rank:1});
    }, [isLoading, data]);

    return (
        <div className="w-full flex justify-between max-h-full mx-auto overflow-hidden">
            <Infos basicInfo={basicInfo}/>
            <div className=" w-full our-table-fixed lg:ml-2 overflow-x-hidden overflow-y-auto lg:rounded-tl-xl block max-h-full">
                <table className="w-full relative max-h-full">
                    <thead className="z-[3] mt-[20px] sticky top-0">
                        <tr className="z-[3] backdrop-blur-[20px] bg-[#aa70e4] bg-opacity-[.30] text-sm uppercase leading-normal text-white">
                            <th className="px-6 py-4 text-center text-[10px]">RANK</th>
                            <th className="px-6 py-4 text-left text-[10px]">NAME</th>
                            <th className="px-6 py-4 text-center text-[10px]">RATING</th>
                            <th className="px-0 py-4 text-center text-[10px] w-[80px] sm:w-auto">NO. MATCHES</th>
                        </tr>
                    </thead>
                    <tbody className=" text-sm font-light text-white bg-[#aa70e4] bg-opacity-[.18]">
                        {data && data.map((item:any, index:number) => {
                            let rankPercent = 0;
                            if ('tiers' in item && 'rank' in item) {
                                rankPercent =  100 - (((item.tiers.maxRank + 1) - item.rank) / 2);
                            }
                            return (
                                <tr onClick={() => {setBasicInfo({item, rank: index + 1})}} key={index + "_" + item.userId} className="border-b select-none border-white border-opacity-[.15] hover:bg-white hover:bg-opacity-[.08]  cursor-pointer relative">
                                    <td className="relative">
                                        <Link href={(item?.user?.id) ? "/user/" + item?.user?.id : ""} className="absolute lg:hidden w-full h-full top-0"></Link>
                                        <div className="flex items-center">
                                            {
                                                index >= 3 ?
                                                <span className="font-bold w-full text-center">
                                                    {index + 1}
                                                </span>
                                                : <Top3 rank={index + 1} />
                                            }
                                        </div>
                                    </td>
                                    <td className="relative text-left">
                                        <Link href={(item?.user?.id) ? "/user/" + item?.user?.id : ""} className="absolute lg:hidden w-full h-full top-0"></Link>
                                        <div className="flex items-center">
                                            <Image unoptimized  width={100} height={100} alt="" className="min-w-10 min-h-10 w-10 h-10 border-1 border-[#ffffffa0] border rounded-full" src={default_img('user' in item ? item.user.avatar : null, item.user.fullname)} />
                                            <div className="flex flex-col flex-1 ml-2">
                                                <span className="max-w-[80px] sm:max-w-[120px] font-semibold overflow-hidden overflow-ellipsis whitespace-nowrap">{'user' in item && item.user.fullname}</span>
                                                <div className="flex gap-1">
                                                    <Image unoptimized  width={100} height={100} src={default_img('tiers' in item ? item.tiers.image : null, "")} alt={'tiers' in item ? item.tiers.name : ""} className="h-6 w-6 inline-block" />
                                                    <span style={{ color: 'tiers' in item ? item.tiers.color : "white" }} className="font-semibold">{'tiers' in item && item.tiers.name}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="relative text-center h-[68px] justify-center items-center flex flex-col font-semibold">
                                        <Link href={(item?.user?.id) ? "/user/" + item?.user?.id : ""} className="absolute lg:hidden w-full h-full top-0"></Link>
                                        {item.rank}
                                        <div className="rounded-full overflow-hidden h-[.4rem] bg-white bg-opacity-20 w-[60px] sm:w-[90px]">
                                            <div style={{width: rankPercent + "%", background: 'tiers' in item ? item.tiers.color : "white"}} className="h-full rounded-full bg-opacity-100"></div>
                                        </div>
                                    </td>
                                    <td className="relative">
                                        <Link href={(item?.user?.id) ? "/user/" + item?.user?.id : ""} className="absolute lg:hidden w-full h-full top-0"></Link>
                                        <div className="text-center font-bold w-full">
                                            {item.matchCount}
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

        </div>
    )
}

export default LeaderBoardMore