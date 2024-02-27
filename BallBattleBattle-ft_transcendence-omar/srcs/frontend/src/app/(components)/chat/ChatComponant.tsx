'use client';
import { FC, useEffect, useState } from "react";
import ChatMain from "./Chat";
import ListChats from "./listChat";
import {Loading} from "../Loading/Loading";
import axios from "axios";
import Image from "next/image";
import { useQuery } from "react-query";
import Error from "@/app/tools/error";
import { Localhost } from "@/app/tools/global";
import { socket } from "@/app/tools/socket/socket";

interface User {
    id: number;
    fullname: string;
    avatar: string;
}

type Props = {
    id?: string;
}

const Chat = ({ id = '0' }: Props) => {
    const [loading, setLoading] = useState(true);
    const [conversation, setconversation] = useState([]);
    const [ConversationId, setConversationId] = useState(id ? id : '0');
    const [user, setuser] = useState<User>();
    const [Infos, setInfos] = useState<any>();
    
    useEffect(() => {
        (id) && setConversationId(id);
    }, [id]);

    useEffect(() => {
        socket.connect();
        return () => {
            socket.disconnect();
        };
    }, []);

    const { data, isLoading, error, status } = useQuery({
        queryKey: ['Conversation'],
        queryFn: async () => {
            axios.defaults.withCredentials = true;
            try {
                const response = await axios.get(`${Localhost()}/conversation`);
                (id) && setuser(response.data?.data?.find((item: any) => item.cid == id)?.users);
                
                return response.data.data;
            } catch (error) {
            }
        }
    });

    useEffect(() => {
        if (data && status == "success") {
            setconversation(data);
            setInfos(data.find((item: any) => item.cid == ConversationId));
        }
    }, [data, status, ConversationId]);

    if (isLoading) return <div className='absolute top-0 bottom-0 right-0 left-0 flex w-full h-screen justify-center items-center '><Loading show={true} /></div>;
    if (error) return <Error />;
    return (
        <div className="lg:flex h-full">
            <div className={(ConversationId == '0' ? ' flex ' : "hidden lg:flex ") + " h-full min-w-[360px] bg-[#aa70e4] bg-opacity-[.25] lg:w-[380px] overflow-y-hidden mb-[80px] lg:mb-0 "}>
                <ListChats setConversation={setconversation} conversation={conversation} seter={setConversationId} ConversationId={ConversationId} setuser={setuser}/>
            </div>

            {
                ConversationId != '0' ?
                    <div className="relative w-full overflow-hidden transition-all duration-150 bg-[#aa70e4] bg-opacity-[.18] h-full user-chat lg:flex">
                        <ChatMain
                            setIdConv={setConversationId}
                            seter={setConversationId}
                            idConv={ConversationId}
                            user={user}
                            infos={status == "success" && Infos != undefined ? Infos : {}}
                        />
                    </div>
                    :
                    <div className="relative w-full hidden overflow-hidden transition-all duration-150 bg-[#aa70e4] bg-opacity-[.18] h-full user-chat lg:flex">

                        <div className=" absolute w-full h-full flex justify-center items-center">
                            <div className="absolute w-full h-full"></div>
                            <div className="absolute w-full h-full flex flex-col justify-center items-center">
                                <div className="p-2">
                                    <Image unoptimized  src="/BattleBall-logo.svg" alt="Picture of the author" priority={true} quality={75} width={100} height={100} />
                                </div>
                                <div className="text-white text-2xl font-bold">All conversation are Closed</div>
                            </div>
                        </div>

                    </div>
            }


        </div>
    );
}

export {Chat};