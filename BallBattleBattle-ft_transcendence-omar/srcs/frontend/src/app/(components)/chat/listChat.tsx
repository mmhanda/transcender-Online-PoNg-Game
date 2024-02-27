import Image from "next/image";
import './chatStyle.css';
import { FC, useEffect, useState } from "react";
import { default_img, formatRelativeDate } from "@/app/tools/global";
import NewChat from "./NewChat";
import NewGroup from "./NewGroup";
import { socket } from "@/app/tools/socket/socket";
import convertations from "./[conversation]/page";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryClient } from "react-query";

interface Member {
    id: number;
    fullname: string;
    avatar: string;
    status: string;
}

interface Message {
    id: number;
    content: string;
    createdAt: string;
}
interface conv {
    id: number;
    avatar?: string | null;
    count?: number | null;
    cid: string;
    name: string;
    description: string | null;
    status: string;
    type: string;
    users: Member;
    lastMessage: Message;
    createdAt: string;
}
interface IConversation {
    conversation: Array<conv>;
    ConversationId?: number | string;
    seter: any;
    setuser?: any;
    setConversation: any;
}

const ListChats: FC<IConversation> = ({ conversation, seter, setuser, ConversationId, setConversation }) => {
    const [showNewChat, setShowNewChat] = useState(false);
    const [showNewGroup, setShowNewGroup] = useState(false);
    const [search, setSearch] = useState<string>('');
    // const router = useRouter();
    // const Client =  useQueryClient();
    useEffect(() => {
        socket.on('message', (data) => {
            setConversation((prevConversations: Array<conv>) => {
                const existingConversationIndex = prevConversations.findIndex(
                    (conv: conv) => conv.cid === data.id
                );

                if (existingConversationIndex !== -1) {
                    const updatedConversations = prevConversations.map((conv, index) => {
                        if (index === existingConversationIndex) {
                            return {
                                ...conv,
                                lastMessage: {
                                    ...conv.lastMessage,
                                    content: data.content !== undefined ? data.content : conv.lastMessage.content,
                                    createdAt: data.createdAt !== undefined ? data.createdAt : conv.lastMessage.createdAt,
                                },
                            };
                        }
                        return conv;
                    });

                    updatedConversations.sort((a, b) => {
                        const dateA = new Date(a.lastMessage?.createdAt).getTime();
                        const dateB = new Date(b.lastMessage?.createdAt).getTime();
                        return dateB - dateA;
                    });

                    return updatedConversations;
                } else {
                    const newConversation = {
                        id: data.id,
                        cid: data.id,
                        name: data.name,
                        description: data.description,
                        avatar: data.avatar,
                        count: data.count,
                        status: data.status,
                        type: data.type,
                        users:{
                            id: data.senderId,
                            fullname: data.fullname,
                            avatar: data.avatar,
                        },
                        createdAt: data.createdAt,
                        lastMessage: {
                            content: data.content ,
                            createdAt: data.createdAt,
                        },
                    };
                    const updatedConversations = [newConversation, ...prevConversations];

                    updatedConversations.sort((a, b) => {
                        const dateA = new Date(a.lastMessage?.createdAt).getTime();
                        const dateB = new Date(b.lastMessage?.createdAt).getTime();
                        return dateB - dateA;
                    });
                    return updatedConversations;
                }
            });
        });

        return () => {
            socket.off('message');
        };
    }, [setConversation]);


    return (
        <div className="flex flex-col w-full overflow-y-auto h-full">
            <NewChat show={showNewChat} setShow={setShowNewChat} />
            <NewGroup show={showNewGroup} setShow={setShowNewGroup} />
            <div className="w-full px-4 pt-4">
                <div className="relative flex w-full mb-4 text-center">
                    <label htmlFor="searsh_chat" className="flex justify-center items-center" >
                        <Image unoptimized  src="/search.svg?v1" alt="Picture of the author" priority={true} quality={75} width={100} height={100} className="absolute left-[12px] h-[1rem] w-[1rem] cursor-pointer" />
                    </label>
                    <input onChange={(event) => { setSearch(event.target.value) }} type="text" placeholder="FIND CHAT" className=" focus:border-[#a970e3] border-transparent border-2 placeholder-[#ffffff] placeholder-opacity-[.65] rounded-[11px] w-full py-[.85rem] bg-black bg-opacity-[.2] text-[12px] pl-10" />
                </div>
                <div className="relative flex gap-2">
                    <button onClick={() => setShowNewChat(true)} className="chat-btn hover:opacity-80 bg-[#A970E3] text-[#ffffff] h-[46px] flex-1 rounded-lg text-[12px]">
                        START NEW CHAT
                    </button>
                    <button onClick={() => { setShowNewGroup(true) }} className="group-btn hover:opacity-80 bg-[#A970E3] font-bold text-[#ffffff] h-[46px] w-[46px] rounded-full text-[12px]">
                        <Image unoptimized  src="/group.svg?" alt="Picture of the author" priority={true} quality={75} width={100} height={100} className="pointer-events-none mx-auto w-5 cursor-pointer" />
                    </button>
                </div>
            </div>

            <div className=" flex flex-col w-full h-full overflow-y-auto pb-4">
                <ul className="chat-user-list px-2 py-4 ">
                    {
                        search.length == 0 ?
                            Array.isArray(conversation) && conversation.length > 0 &&
                            conversation.map((conversation, index) =>
                            (
                                conversation && 
                                <li
                                    onClick={() => {
                                        if (window.location.pathname !== `/chat/${conversation.cid}`)
                                            seter(conversation.cid)
                                        setuser(conversation.users);
                                    }}
                                    key={conversation?.cid + '_' + index} className={"select-none cursor-pointer mb-2 px-2 py-[15px] transition-all ease-in-out hover:bg-white hover:bg-opacity-[.08] rounded-sm " + (ConversationId == conversation.cid ? "bg-white bg-opacity-[.08]" : "")}>
                                    {
                                        conversation.type === "group" ?
                                            <div
                                                onClick={() => {
                                                    seter(conversation.cid)
                                                    
                                                }}
                                                className="flex items-center">
                                                <div className="relative self-center">
                                                    <Image unoptimized  width={100} height={100} src={default_img(conversation?.avatar, "%2B" + conversation?.count, "A970E3", "fff")} className="rounded-full  w-[36px] h-[36px] min-w-[36px] min-h-[36px]" alt="" />
                                                </div>
                                                <div className="flex-grow overflow-hidden pl-2 w-[180px] sm:w-[240px] md:w-[280px] lg:w-[300px]">
                                                    <h5 className="mb-2 py-1 text-[1rem] leading-[.85rem] font-semibold">{conversation.name}</h5>
                                                    <p className="mb-0 text-white text-opacity-[.50]  truncate text-[.75rem] leading-[.8rem]">{conversation?.description ? (conversation.description) : null}</p>
                                                </div>
                                                <div className="text-[.75rem] leading-[.8rem] opacity-90 text-white justify-center relative before:w-5 before:content-['●'] before:text-[3.5px] before:absolute before:-left-[6px]">
                                                    {conversation?.lastMessage?.createdAt ? formatRelativeDate(conversation.lastMessage.createdAt) : formatRelativeDate(conversation.createdAt)}
                                                </div>
                                            </div>
                                            :
                                            <div
                                                onClick={() => {
                                                    seter(conversation.cid)
                                                }}
                                                className="flex items-center">
                                                <div className="relative self-center">
                                                    <Image unoptimized  width={100} height={100} src={default_img(conversation.users?.avatar, conversation.users?.fullname)} className="rounded-full w-[36px] h-[36px] min-w-[36px] min-h-[36px]" alt="" />
                                                    <span className={`absolute w-[8px] h-[8px] ${conversation.users?.status == 'online' ? 'bg-green-500':conversation.users?.status== 'offline' ? ' bg-red-500' : ' bg-yellow-500'}  border-[1px] border-white rounded-full top-7 right-1 `}></span>
                                                </div>
                                                <div className="overflow-hidden pl-2">
                                                    <h5 className="mb-2 py-1 text-[1rem] leading-[.85rem] font-semibold truncate">{conversation.users?.fullname}</h5>
                                                    <p className="mb-0 text-white text-opacity-[.50] truncate text-[.75rem] leading-[.8rem]">{conversation?.lastMessage ? (conversation.lastMessage.content) : null}</p>
                                                </div>
                                                <div className="text-[.75rem] leading-[.8rem] opacity-90 text-white justify-center relative before:w-5 before:content-['●'] before:text-[3.5px] before:absolute before:-left-[6px] ml-auto">
                                                    {conversation?.lastMessage?.createdAt ? formatRelativeDate(conversation.lastMessage.createdAt) : formatRelativeDate(conversation.createdAt)}
                                                </div>
                                            </div>
                                    }
                                </li>
                            ))
                            :
                            Array.isArray(conversation) && conversation.length > 0 &&
                            conversation.filter(item => {
                                const nameMatch = item?.name?.toLowerCase().includes(search.toLowerCase());
                                const fullnameMatch = item.users?.fullname?.toLowerCase().includes(search.toLowerCase());
                                const lastmsgMatch = item?.lastMessage?.content?.toLowerCase().includes(search.toLowerCase());
                                const descriptionMatch = item?.description?.toLowerCase().includes(search.toLowerCase());

                                return nameMatch || fullnameMatch || lastmsgMatch || descriptionMatch;
                            }).map((conversation, index) =>
                            (
                                conversation &&
                                <li
                                    onClick={() => {
                                        if (window.location.pathname !== `/chat/${conversation.cid}`)
                                            seter(conversation.cid)
                                        
                                        setuser(conversation.users);
                                    }}
                                    key={conversation?.cid + '_' + index} className={"select-none cursor-pointer mb-2 px-2 py-[15px] transition-all ease-in-out hover:bg-white hover:bg-opacity-[.08] rounded-sm " + (ConversationId == conversation.cid ? "bg-white bg-opacity-[.08]" : "")}>
                                    {
                                        conversation.type === "group" ?
                                        <div
                                            onClick={() => {
                                                seter(conversation.cid)
                                                
                                            }}
                                            className="flex items-center">
                                            <div className="relative self-center">
                                                <Image unoptimized  width={100} height={100} src={default_img(conversation?.avatar, "%2B" + conversation?.count, "A970E3", "fff")} className="rounded-full  w-[36px] h-[36px] min-w-[36px] min-h-[36px]" alt="" />
                                            </div>
                                            <div className="flex-grow overflow-hidden pl-2 w-[180px] sm:w-[240px] md:w-[280px] lg:w-[300px]">
                                                <h5 className="mb-2 py-1 text-[1rem] leading-[.85rem] font-semibold">{conversation.name}</h5>
                                                <p className="mb-0 text-white text-opacity-[.50]  truncate text-[.75rem] leading-[.8rem]">{conversation?.description ? (conversation.description) : null}</p>
                                            </div>
                                            <div className="text-[.75rem] leading-[.8rem] opacity-90 text-white justify-center relative before:w-5 before:content-['●'] before:text-[3.5px] before:absolute before:-left-[6px]">
                                                {conversation?.lastMessage?.createdAt ? formatRelativeDate(conversation.lastMessage.createdAt) : formatRelativeDate(conversation.createdAt)}
                                            </div>
                                        </div>
                                        :
                                        <div
                                            onClick={() => {
                                                seter(conversation.cid)
                                                
                                            }}
                                            className="flex items-center">
                                            <div className="relative self-center">
                                                <Image unoptimized  width={100} height={100} src={default_img(conversation.users?.avatar, conversation.users?.fullname)} className="rounded-full w-[36px] h-[36px] min-w-[36px] min-h-[36px]" alt="" />
                                                <span className="absolute w-[8px] h-[8px] bg-green-500 border-[1px] border-white rounded-full top-7 right-1 "></span>
                                            </div>

                                            <div className="overflow-hidden pl-2">
                                                <h5 className="mb-2 py-1 text-[1rem] leading-[.85rem] font-semibold truncate">{conversation.users?.fullname}</h5>
                                                <p className="mb-0 text-white text-opacity-[.50] truncate text-[.75rem] leading-[.8rem]">{conversation?.lastMessage ? (conversation.lastMessage.content) : null}</p>
                                            </div>
                                            <div className="text-[.75rem] leading-[.8rem] opacity-90 text-white justify-center relative before:w-5 before:content-['●'] before:text-[3.5px] before:absolute before:-left-[6px] ml-auto">
                                                {conversation?.lastMessage?.createdAt ? formatRelativeDate(conversation.lastMessage.createdAt) : formatRelativeDate(conversation.createdAt)}
                                            </div>
                                        </div>
                                    }
                                </li>

                            ))
                    }
                </ul>
            </div>

        </div>
    );
}

export default ListChats;