'use client'

import Link from "next/link";
import "./Rooms.css"
import { FC, useState } from "react";
import Image from "next/image";
import { Localhost, default_img } from "@/app/tools/global";
import Avtr from "@/app/tools/avatar";
import axios from "axios";
import { redirect } from "next/dist/server/api-utils";
import { useRouter } from 'next/navigation';//fixed

interface HotChannel {
    logged: boolean;
    hotCH: any[];
};

const Rooms: FC<HotChannel> = ({ logged = false, hotCH }) => {
    const [isDivActive, setIsDivActive] = useState(false);
    const [Content, setIsContent] = useState("Load More ...");
    const router = useRouter();
    const toggleDivStyle = () => {
        setIsDivActive(!isDivActive);
        setIsContent(isDivActive ? "Load More ..." : "Load Less")
    };
    const divClasses = `grid grid-cols-1 gap-6 lg:gap-3 ${logged ? 'sm:grid-cols-2' : 'sm:grid-cols-2'} ${logged ? 'lg:grid-cols-3' : 'lg:grid-cols-3'}  ${logged ? 'xl:grid-cols-4' : 'lg:grid-cols-3'} ${logged ? '2xl:grid-cols-5' : 'lg:grid-cols-3'}  ${isDivActive ? '' : 'max-h-[50rem] md:max-h-[33rem] overflow-hidden'}`;


    const joinRoom = (roomCid: string) => {
        if (logged) {
            axios.post(`${Localhost()}/conversation/join/${roomCid}`, {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            }).then(res => {
                router.push(`/chat/${roomCid}`);
            }).catch(err => {
                router.push('/chat/' + roomCid);
            })
        }
        else {
            router.push('/login');
        }
    }

    return (
        <div className="w-full mb-12" id="rooms-section">
            <div className={'flex justify-between items-center py-2 ' + ((logged) ? ' px-[2rem] bg-[#fff] bg-opacity-[.08] border-[#ffffff] border-opacity-[.20] border-b-[.1px]' : ' px-4 ')}>
                <div className='flex items-center gap-3  '>
                    <div className=' border-[2px] border-[#e88e8e] w-14 h-14 rounded-full bg-[#BE195D] flex justify-center'>
                        <Image unoptimized  width={50} height={50} className='w-6 mt-[3px] self-center ' src='/message.svg' alt='leaderboard' />
                    </div>
                    <div className=' '>
                        <div className=' text-white text-[1.3rem] font-light leading-[20px] '>Popular Rooms</div>
                        <div className='text-[#e88e8e] text-xs leading-[15px] mt-1'>Share your moment with others</div>
                    </div>
                </div>
            </div>
            <section tabIndex={-1} className={"relative focus:outline-none pt-4 rooms px-4"}>
                <div className={divClasses}>
                    {
                        hotCH.map((room, index) => (
                            <ul className="space-y-6" key={'room-' + index}>
                                <li className="card-bg border-[1px] border-[#5D5370] rounded-xl  py-2 px-1">
                                    <div className="flex justify-center items-center select-none">
                                        <div className="mx-2 flex justify-center items-center flex-col">
                                            <div className=" relative w-[4.25rem] m-auto flex justify-center items-center mb-2">
                                                <Avtr src={default_img(room.avatar, `%2B${room.membersCount.toString()}`, "A970E3", "fff")} />
                                            </div>
                                            <div className="flex items-center justify-center text-white gap-[.35rem] bg-[#ffffff40] rounded-full w-[60px] min-w-12">
                                                <span>
                                                    <Image unoptimized  src="/members.svg" width={100} height={100} alt="users" className="w-[14px] h-[14px]" />
                                                </span>
                                                <span className="font-light text-[.84rem]">{room.membersCount < 100 ? room.membersCount : '+99'}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col w-full px-1">
                                            <div>
                                                <div className="text-white">{room.name}</div>
                                                <div className="flex items-center gap-2 font-light text-[#bbb7c0] text-[.77rem]">
                                                    <span>
                                                        <Image unoptimized  alt="room type icon" src={room.status == 'public' ? "/PublicIcon.svg" : "/lock.svg"} width={100} height={100} className="w-[14px] h-[14px]" />
                                                    </span>
                                                    <span>{room.status}</span>
                                                </div>
                                            </div>
                                            <div className="font-light line-clamp-2 my-2 text-[#BCB9C3] text-[.85rem] min-h-[2.6rem]">
                                                {room.description}
                                            </div>
                                            <div className="flex justify-end">
                                                <div
                                                    onClick={() => {
                                                        if (logged)
                                                            joinRoom(room.cid)
                                                        else {
                                                            const login = document.getElementById('loginFirstBtn')
                                                            login?.click();
                                                        }
                                                    }}

                                                    className="cursor-pointer mr-1 flex items-center gap-2 w-max text-[12px] text-white bg-[#BE195D] hover:bg-[#be195e61] py-[.18rem] px-2 rounded-xl">
                                                    <Image unoptimized  width={11} height={11} src="/join.svg" alt="join" className="w-[11px] h-[11px]" />
                                                    <span>Join</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        ))
                    }
                </div>
                <div className="flex justify-center mt-4 mb-2">
                    <button onClick={toggleDivStyle} className="bg-[#BE195D] hover:bg-[#be195e61] py-1.5 px-3 rounded-full absolute">{Content}</button>
                </div>
            </section>
        </div>
    );
}

export default Rooms;