'use client';
import { Localhost, default_img } from "@/app/tools/global";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import axios from "axios";
import { User } from "@/app/tools/fetch/api";
import { socket } from "@/app/tools/socket/socket";
import { useRouter } from 'next/navigation';
const sendMessageSocket = (data: any, type: string) => {
    if (socket) {
        socket.emit(type, data);
    } else {
    }
};
interface Props {
    show: boolean;
    setShow: (show: boolean) => void;
}

const CreateConversation = ({ show, setShow }: Props) => {
    const refName = useRef<HTMLDivElement>(null);
    const [userId, setUserId] = useState<number | undefined>(undefined);
    const [Friends, setFriends] = useState([] as User[]);
    const [inputValue, setInputValue] = useState('');
    const router = useRouter();
    const QueryClient = useQueryClient();
    const handleChange = (e: any) => {
        setInputValue(e.target.value);
    }
    const handleKeyEnter = (e: any) => {
        if (e.key === 'Enter') {
            if (userId != undefined && inputValue != '')
                sentMsg(inputValue, userId)
        }
    }
    useEffect(() => {
        function handleClickOutside(event: any) {
            if (refName.current && !refName.current.contains(event.target as Node)) {
                if (event.target?.classList?.contains("chat-btn"))
                    return;
                setShow(false);
            }
        }
        document.addEventListener('click', handleClickOutside);
    }, [setShow]);
    const { data, isLoading, error, status } = useQuery({
        queryKey: ['getFriends'],
        queryFn: async () => {
            axios.defaults.withCredentials = true;
            try {
                const res = await axios.get(`${Localhost()}/friends/user/0`); // get my friends list
                return res.data;
            } catch (error) {
            }
        }
    });
    useEffect(() => {
        if (data && data.length > 0) {
            setFriends(data);
        }
    }, [data])
    const sentMsg = async (msg: string, frndId: number) => {
        try {
            if (frndId != undefined) {
                axios.defaults.withCredentials = true;
                await axios.post(`${Localhost()}/conversation`, { name: '----', description: "Direct Message", status: "private", type: "direct", guestId: frndId }).then((res) => {
                    if (res.data.data.cid) {
                        sendMessageSocket({ content: msg, receiverId: frndId, conversationId: res.data.data.cid }, 'Global_Message');
                        sendMessageSocket({ content: msg, receiverId: frndId, conversationId: res.data.data.cid }, 'Chat_message');
                        QueryClient.invalidateQueries('Conversation');
                        router.push(`/chat/${res.data.data.cid}`);
                        setShow(false);
                    }
                });
            }
        } catch (error) { }
        setInputValue('');
    }
    return (
        <div className={'z-10 flex justify-center h-full items-center opacity-0 overflow-hidden absolute w-full transition-opacity duration-200 ease-in-out ' + (show ? "!opacity-100" : " pointer-events-none z-[-100000]")}>
            <div className={(show ? 'flex absolute justify-center items-center bg-[#211549] bg-opacity-50 w-full h-full backdrop-blur-[8px]' : ' pointer-events-none hidden z-[-100000]')}></div>
            <div ref={refName} className={"bg-[#130C26] bg-opacity-[.5] backdrop-blur-[5px] absolute rounded-[18px] my-auto w-fit h-fit mt-8 translate-y-[-50px] transition-all duration-300 ease-in-out opacity-0 hidden" + (show && " !flex !flex-col transform-none opacity-100")}>
                <div className="relative max-w-[26rem] px-8 mb-4">
                    <p className="text-white font-bold text-center uppercase py-4 text-[16px]">Create new chat</p>
                    <div className=" text-[#C5C4CA] text-center text-[12px]">Connect with others effortlessly – find them using their ID or name and spark exciting conversations today!</div>
                    <div className="relative flex items-center my-4">
                        <Image unoptimized  alt="password" width={100} height={100} src="/search.svg" className="w-[15px] left-[13px] absolute" />
                        <input
                            type="text"
                            className="placeholder-[#ffffffaa] rounded-[11px] w-full py-[1rem] bg-[#ebd4ff] bg-opacity-[.08] text-[10px] pl-10"
                            title="SEARCH"
                            placeholder="SEARCH"
                        />
                    </div>
                    <div className="flex flex-col gap-2 max-h-[12rem] overflow-auto">
                        {
                            Friends.map((frnd, index) => {
                                return (
                                    <div onClick={() => { frnd.id != userId ? setUserId(frnd.id) : setUserId(undefined) }} key={index} className={((userId == frnd.id) && "!bg-opacity-[0.16]") + " min-h-[3.2rem] mr-2 overflow-hidden relative bg-white bg-opacity-[0.075] flex  items-center before:content-[''] before:w-[4px] before:h-[30px] before:bg-[#FDB971] before:rounded-r-[3px] rounded-lg select-none cursor-pointer"}>
                                        <div className="w-full py-1 text-sm flex">
                                            <div className="flex flex-1 first-letter:items-center ml-3">
                                                <div className='w-[2.3rem] h-[2.3rem] p-[.2rem] rounded-full border-[1.5px] border-[#FDB971]'>
                                                    <Image unoptimized 
                                                        src={default_img(frnd.avatar, frnd.fullname)}
                                                        alt="valorant"
                                                        className='rounded-full w-full h-full'
                                                        width={100}
                                                        height={100}
                                                    />
                                                </div>
                                                <div className='ml-1 flex flex-col justify-center'>
                                                    <div className="ml-2 text-white font-bold text-[.8rem] leading-[.75rem]">{frnd.fullname}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div className={`relative flex items-center justify-center w-full self-center pt-4 pb-2 ${(userId != undefined) ? 'opacity-80' : "opacity-30"}`}>
                        <input disabled={(userId == undefined)} onKeyDown={handleKeyEnter} onChange={handleChange} value={inputValue} id="send1" placeholder="Message"
                            className={`${(userId == undefined) && 'cursor-not-allowed'} bg-white placeholder-[#ffffffaa] bg-opacity-[.07] h-[42px] w-full rounded-sm focus:border focus:border-[#ffffff2e]  pl-[10px] pr-[42px] text-[12px] flex`}
                            type="text"
                        />
                        <label htmlFor="send1" className="flex justify-center items-center absolute right-[10px]" onClick={() => {
                            if (userId != undefined && inputValue != '')
                                sentMsg(inputValue, userId)
                        }}>
                            <Image unoptimized  alt="Picture of the author" width={100} height={100} className={`w-4 opacity-80`} src="/Send.svg" />
                        </label>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default CreateConversation;