'use client';

import axios from "axios";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { useQueryClient } from "react-query";
import { Localhost } from "@/app/tools/global";
import { useState } from "react";
import Link from "next/link";

interface Props {
    show: boolean;
    setShow: (show: boolean) => void;
    id?: string;
    channelStatus?: string;
}

const PretectedRoom = ({ show, setShow, id, channelStatus }: Props) => {
    const [err, setError] = useState<string | null>(null);
    const refName = useRef<HTMLDivElement>(null);
    const queryClient = useQueryClient();
    const [password, setPassword] = useState<string>();

    useEffect(() => {
        function handleClickOutside(event: any) {
            if (refName.current && !refName.current.contains(event.target as Node)) {
                if (event.target?.classList?.contains("protected-btn"))
                    return;
                else
                    setShow(false);
            }
        }
        document.addEventListener('click', handleClickOutside);
    }, [setShow]);

    return (
        <div className={'z-10 flex justify-center h-full items-center opacity-0 overflow-hidden absolute w-full transition-opacity duration-200 ease-in-out ' + (show ? "!opacity-100" : " pointer-events-none")}>
            <div className={(show ? 'flex absolute justify-center items-center bg-[#211549] bg-opacity-50 w-full h-full backdrop-blur-[8px]' : ' hidden ')}></div>
            <div ref={refName} className={"bg-[#130C26] bg-opacity-[.5] backdrop-blur-[5px] absolute rounded-[18px] my-auto w-fit h-fit mt-8 translate-y-[-50px] transition-all duration-300 ease-in-out opacity-0 hidden" + (show && " !flex !flex-col transform-none opacity-100")}>
                <div className="relative max-w-[26rem] px-8 mb-4">
                    <p className="text-white font-bold text-center uppercase py-4 text-[16px]">Room Password Required</p>
                    <div className=" text-[#C5C4CA] text-center text-[12px]">To join this room and start chatting, please enter the room password below. The password ensures a secure and private conversation within the room.</div>

                    {
                        channelStatus === 'protected' &&
                        <div className="relative flex items-center my-4">
                            <Image unoptimized  alt="password" width={100} height={100} src="/lock.svg" className="w-[10px] left-[15px] absolute" />
                            <input
                                type="password"
                                className="focus:border-[#a970e3] border-transparent border-2 placeholder-[#ffffff] placeholder-opacity-50 rounded-[11px] w-full py-[1rem] bg-[#ebd4ff] bg-opacity-[.08] text-[10px] pl-10"
                                title="PASSWORD"
                                placeholder="PASSWORD"
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                            />
                        </div>
                    }
                    <div className={`text-[#FF4D4D] text-[12px] text-center transform duration-500 ease-in-out  ${err?.length && "!h-8"} h-0 flex justify-center items-start overflow-hidden`}>{err}</div>
                    <div className=" flex flex-col w-full gap-1">

                    <button
                        onClick={() => {
                            axios.defaults.withCredentials = true;
                            if (id) {
                                axios.post(`${Localhost()}/conversation/join/${id}`, { password: password }).then((res) => {
                                    if (res.status === 201) {
                                        queryClient.invalidateQueries("GetConversationId");
                                        setShow(false);
                                    }
                                    if (res.status === 230) {
                                        setError(res.data.message);
                                    }
                                })
                            }
                        }
                        }
                        type="submit" className="rounded-[11px] py-[.9rem] w-full bg-[#A970E3] font-medium text-[13px] text-white text-opacity-90">
                        JOIN NOW
                    </button>
                    <Link className="rounded-[11px] py-[.9rem] w-full bg-[#ffffff2c] font-medium text-[13px] text-white text-opacity-90 text-center hover:bg-[#ffffff90]" href='/chat'>Cancel</Link>
                    </div>

                </div>
            </div>
        </div>
    )
};
export default PretectedRoom;