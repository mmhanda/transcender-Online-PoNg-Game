import { default_img, inMessageDate, inMessageformatRelativeDate } from "@/app/tools/global";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import Menu from "./Menu";
import PretectedRoom from "./ProtectedRoom";
import { useQueryClient } from "react-query";
interface Message {
    id: number;
    content: string;
    sender: {
        id: number;
        avatar: string;
        fullname: string;
        memberId?: string;
        conversationCid?: string;
        status?: string;
        isFriend?: boolean;
    };
    createdAt: string;
    me: boolean;
}

interface Props {
    msgs: Message[];
    type?: string;
    details?: any;
}

let lastDate: string = "";

const changeLastDate = (date: string) => {
    lastDate = date;
    return true;
}
const colors = ["text-[#25d3da]", "text-[#c082ff]", "text-[#F5B041]", "text-[#ff7b6b]", "text-[#e2cbae]", "text-[#FFD966]", "text-[#FF9B9B]", "text-[#FF6969]"]
interface Messager {
    id: number;
    avatar: string;
    fullname: string;
    idChat: number;
    memberId?: string;
    conversationCid?: string;
    status?: string;
    isFriend?: boolean;
}
const Messages = ({ msgs, details, type }: Props) => {
    const messageBox = useRef<HTMLDivElement>(null);
    const [showMenu, setShowMenu] = useState(false);
    const [Messager, setMessager] = useState<Messager>({ id: 0, avatar: "", fullname: "", idChat: 0, memberId: '0', conversationCid: '0', isFriend: false })
    const client = useQueryClient();

    useEffect(() => {
        lastDate = "";
        const element = messageBox.current;

        if (element) {
            const rect = element.getBoundingClientRect();
            const distanceToBottom = rect.bottom - window.innerHeight;
            if (distanceToBottom > 100)
                messageBox.current?.scrollIntoView({ behavior: "instant", block: "end" })
            else
                messageBox.current?.scrollIntoView({ behavior: "smooth", block: "end" })
        }
    }, [msgs]);
    useEffect(() => {
        lastDate = "";
        if (Messager && 'id' in Messager && Messager.id != 0) {
            msgs.map((message: Message, index: number) => {
                if (message.sender.id == Messager.id) {
                    message.sender.status = Messager.status;
                }
            })
        }
    }, [Messager, msgs])
    // if (showPassword == true && details.status == 'protected' && details.UserStatus == 'viseter')
    //     <PretectedRoom show={showPassword} setShow={setShowPassword} />
    // else

    const setMessagerCallBack = useCallback((newMessager:any) => {
        setMessager(newMessager);
    }, []);

    return (
        <>
            <Menu isAdmin={type == 'group'?details.UserStatus:'member'} setMessagerCallBack={setMessagerCallBack} Messager={Messager} show={showMenu} setShow={setShowMenu} />
            <div className=" mb-[50px] px-4 flex flex-col  w-full overflow-y-auto pt-2">
                {
                    msgs?.map((message: Message, index: number) => {
                        return (
                            <div key={message.id + '_' + index} >
                                {/* {
                                    ((lastDate != message.createdAt.substring(0, 10) || lastDate == "") && changeLastDate(message.createdAt.substring(0, 10))) &&
                                    <div className="w-full flex justify-center mb-2">
                                        <div className="uppercase bg-white bg-opacity-[.15] leading-[12px] py-2 px-3 text-[.7rem] rounded-full text-white text-opacity-80">
                                            {inMessageDate(lastDate)}
                                        </div>
                                    </div>
                                } */}
                                {
                                    message.me == true ?
                                        <div key={message.id + "message_" + index} className="flex justify-end items-center  mb-4">
                                            {/* <div onClick={() => setShowMenu(true)} className="mx-2 menu-btn cursor-pointer before:content-['...'] before:text-[25px] before:text-white before:text-opacity-70 before:relative before:top-[-8px]" /> */}
                                            <div
                                                className=" text-xs ml-2 pt-2 pb-2 px-4 bg-white bg-opacity-20 rounded-lg text-white max-w-[50%]  break-all"
                                            >
                                                <p className="text-white text-opacity-[.7] leading-0 overflow-hidden">
                                                    {message.content}
                                                </p>
                                                <p className="text-white text-opacity-[.8] leading-0 text-right " onClick={() => { }}>
                                                    {inMessageformatRelativeDate(message.createdAt)}
                                                </p>
                                            </div>
                                        </div>
                                        :
                                        <div key={message.id + "_" + index} className="flex justify-start mb-4 items-center">
                                            <Image unoptimized 
                                                src={default_img(message.sender?.avatar, message.sender?.fullname)}
                                                className="object-cover h-8 w-8 rounded-full"
                                                alt=""
                                                priority={true} quality={75} width={100} height={100}
                                            />
                                            <div
                                                className=" text-xs ml-2 pt-2 pb-2 px-4 bg-white bg-opacity-20 rounded-lg text-white max-w-[50%] min-w-[25%]  break-all "
                                            >
                                                <span className={`${colors[message.sender.id % 8]} font-bold text-[.9rem]`}>
                                                    {message.sender?.fullname}
                                                </span>
                                                <p className="text-white text-opacity-[.7] mt-1">
                                                    {message.content}
                                                </p>
                                                <p className="text-white text-opacity-[.8] leading-0 text-right " onClick={() => { }}>
                                                    {inMessageformatRelativeDate(message.createdAt)}
                                                </p>
                                            </div>
                                            <div onClick={() => {
                                                client.invalidateQueries('conversation');
                                                setMessager({ id: message.sender.id, avatar: message.sender.avatar, fullname: message.sender.fullname, idChat: message.id, memberId: message.sender.memberId, conversationCid: message.sender.conversationCid, status: message.sender.status, isFriend: message.sender.isFriend })
                                                setShowMenu(true)
                                            }} className="mx-2 menu-btn cursor-pointer before:content-['...'] before:text-[25px] before:text-white before:text-opacity-70 before:relative before:top-[-8px]" />
                                        </div>
                                }
                            </div>
                        )
                    })
                }
                <div id="end" ref={messageBox}></div>
            </div>
        </>

    )
}
export default Messages;
