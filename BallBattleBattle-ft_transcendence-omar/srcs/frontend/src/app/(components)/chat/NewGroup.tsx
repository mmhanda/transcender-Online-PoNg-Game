'use client';
import { Localhost } from "@/app/tools/global";
import axios from "axios";
import Image from "next/image";
import { use, useEffect, useRef, useState } from "react";
import { useQueryClient } from "react-query";
import  { useRouter } from 'next/navigation'
import InputText from "./inputtext";
interface Props {
    show: boolean;
    setShow: (show: boolean) => void;
}

const NewGroup = ({ show, setShow }: Props) => {
    const refName = useRef<HTMLDivElement>(null);
    const type: string = "group";
    const [channelName, setChannelName] = useState<string>();
    const [description, setDescription] = useState<string>();
    const [password, setPassword] = useState<string>();
    const [status, setStatus] = useState<string>("public");
    const QueryClient = useQueryClient();
    const [validPassword, setValidPassword] = useState<string>('');
    const Router = useRouter();
    useEffect(() => {
        function handleClickOutside(event: any) {
            if (refName.current && !refName.current.contains(event.target as Node)) {
                if (event.target?.classList?.contains("group-btn"))
                    return;
                setShow(false);
            }
        }
        document.addEventListener('click', handleClickOutside);
    }, [setShow]);

    const handleRadioChange = (e: any) => {
        setStatus(e.target.id);
    }
    return (
        <div className={'z-10 flex justify-center h-full items-center opacity-0 overflow-hidden absolute w-full transition-opacity duration-200 ease-in-out ' + (show ? "!opacity-100" : " pointer-events-none z-[-100000]")}>
            <div className={(show ? 'flex absolute justify-center items-center bg-[#211549] bg-opacity-50 w-full h-full backdrop-blur-[8px]' : ' hidden pointer-events-none z-[-100000]')}></div>
            <div ref={refName} className={"bg-[#130C26] bg-opacity-[.5] backdrop-blur-[5px] absolute rounded-[18px] my-auto w-fit h-fit mt-8 translate-y-[-50px] transition-all duration-300 ease-in-out opacity-0 hidden" + (show && " !flex !flex-col transform-none opacity-100")}>
                <div className="relative max-w-[26rem] px-8 mb-4">
                    <p className="text-white font-bold text-center uppercase py-4 text-[16px]">START NEW CHANNEL</p>
                    <div className="gap-2 text-[#C5C4CA] text-center text-[12px]">Build vibrant communities effortlessly – create a new channel, and foster engaging discussions today!</div>
                    <div className="pt-5 pb-1 flex flex-col gap-4">
                        <div className="relative flex items-center">
                            <Image unoptimized  alt="password" width={100} height={100} src="/group.svg?" className="opacity-50 w-[15px] left-[15px] absolute" />
                            {/* <input
                                type="text"
                                className="focus:border-[#a970e3] border-transparent border-2 placeholder-[#ffffff] placeholder-opacity-50 rounded-[11px] w-full py-[1rem] bg-[#ebd4ff] bg-opacity-[.08] text-[10px] pl-10"
                                title="CHANNEL NAME"
                                placeholder="CHANNEL NAME"
                                value={channelName}
                                onChange={(e) => setChannelName(e.target.value)}
                            /> */}
                            <InputText type="text" value={channelName} setValue={setChannelName} placeholder="CHANNEL NAME" title="CHANNEL NAME" />
                        </div>
                        <div className="relative flex items-center">
                            <Image unoptimized  alt="description" width={100} height={100} src="/description.svg" className="opacity-50 w-[15px] left-[15px] absolute" />
                            {/* <input
                                type="text"
                                className="focus:border-[#a970e3] border-transparent border-2 placeholder-[#ffffff] placeholder-opacity-50 rounded-[11px] w-full py-[1rem] bg-[#ebd4ff] bg-opacity-[.08] text-[10px] pl-10"
                                title="DESCRIPTION"
                                placeholder="DESCRIPTION"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            /> */}
                            <InputText type="text" value={description} setValue={setDescription} placeholder="DESCRIPTION" title="DESCRIPTION" />
                        </div>

                        <div role="radiogroup" className="flex flex-col gap-2">
                            <div className="flex items-center">
                                <div className="rounded-full w-[1.2rem] h-[1.2rem] flex flex-shrink-0 justify-center items-center relative">
                                    <input onChange={(e) => {
                                        handleRadioChange(e);
                                    }} aria-labelledby="public" checked={(status == 'public')} type="radio" name="type" id="public" className="checkbox appearance-none focus:opacity-100 focus:outline-none rounded-full border-[#A970E3] border-2 absolute cursor-pointer w-full h-full checked:border-none" />
                                    <div className="after:content-[''] after:absolute after:top-[.3rem] after:rounded-full after:left-[.3rem] after:bg-[#A970E3] after:w-[.6rem] after:h-[.6rem] check-icon hidden border-2 border-[#A970E3] rounded-full w-full h-full z-1"></div>
                                </div>
                                <label htmlFor="public" id="label1" className="ml-2 text-[.7rem] leading-4 font-normal text-white text-opacity-60">PUBLIC</label>
                            </div>
                            <div className="flex items-center">
                                <div className="rounded-full w-[1.2rem] h-[1.2rem] flex flex-shrink-0 justify-center items-center relative">
                                    <input onChange={(e) => {
                                        handleRadioChange(e);
                                    }} aria-labelledby="private" checked={(status == 'private')} type="radio" name="type" id="private" className="checkbox appearance-none focus:opacity-100 focus:outline-none rounded-full border-[#A970E3] border-2 absolute cursor-pointer w-full h-full checked:border-none" />
                                    <div className="after:content-[''] after:absolute after:top-[.3rem] after:rounded-full after:left-[.3rem] after:bg-[#A970E3] after:w-[.6rem] after:h-[.6rem] check-icon hidden border-2 border-[#A970E3] rounded-full w-full h-full z-1"></div>
                                </div>
                                <label htmlFor="private" id="label2" className="ml-2 text-[.7rem] leading-4 font-normal text-white text-opacity-60">PRIVATE</label>
                            </div>
                            <div className="flex items-center">
                                <div className="rounded-full w-[1.2rem] h-[1.2rem] flex flex-shrink-0 justify-center items-center relative">
                                    <input onChange={(e) => {
                                        handleRadioChange(e);
                                    }} aria-labelledby="private" checked={(status == 'protected')} type="radio" name="type" id="protected" className="checkbox appearance-none focus:opacity-100 focus:outline-none rounded-full border-[#A970E3] border-2 absolute cursor-pointer w-full h-full checked:border-none" />
                                    <div className="after:content-[''] after:absolute after:top-[.3rem] after:rounded-full after:left-[.3rem] after:bg-[#A970E3] after:w-[.6rem] after:h-[.6rem] check-icon hidden border-2 border-[#A970E3] rounded-full w-full h-full z-1"></div>
                                </div>
                                <label htmlFor="protected" id="label2" className="ml-2 text-[.7rem] leading-4 font-normal text-white text-opacity-60">PROTECTED</label>
                            </div>
                        </div>
                        <div className={`${(status == 'protected') ? "h-[50px]" : " h-0"} overflow-hidden flex  transform duration-500 ease-in-out relative items-center`}>
                            <Image unoptimized  alt="description" width={100} height={100} src="/lock.svg" className="opacity-50 w-[13px] left-[15px] absolute" />
                            {/* <input
                                type="password"
                                className="focus:border-[#a970e3] border-transparent border-2 placeholder-[#ffffff] placeholder-opacity-50 rounded-[11px] w-full py-[1rem] bg-[#ebd4ff] bg-opacity-[.08] text-[10px] pl-10"
                                title="PASSWORD"
                                placeholder="PASSWORD"
                                autoComplete="off"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            /> */}
                            <InputText type="password" value={password} setValue={setPassword} placeholder="PASSWORD" title="PASSWORD" />
                        </div>
                        {
                            (validPassword != '') && <div className="text-[#ff0000] text-[10px]">{validPassword}</div>
                        }
                        <button onClick={() => {
                            if (channelName && description && status && type && channelName.replace(/\s/g, '').length != 0) {
                                const data = {
                                    name: channelName,
                                    description: description,
                                    status: status,
                                    type: type,
                                    password: password
                                }
                                if (!password && status == 'protected') {
                                    setValidPassword('Password is required');
                                    return;
                                }
                                if (password && password.length < 6 && status == 'protected') {
                                    setValidPassword('Password must be at least 6 characters');
                                    return;
                                }
                                else {
                                    axios.defaults.withCredentials = true;
                                    axios.post(`${Localhost()}/conversation`, data).then((res) => {
                                        if (res.status == 230)
                                            setValidPassword(res.data.message);
                                        else{
                                            Router.push(`/chat/${res.data.data.cid}`);
                                            QueryClient.invalidateQueries('Conversation');
                                            setShow(false);
                                        }
                                        
                                    })
                                }
                            }

                        }}
                            className="rounded-[11px] py-[.9rem] w-full bg-[#A970E3] font-medium text-[13px] text-white text-opacity-90">START NOW</button>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default NewGroup;