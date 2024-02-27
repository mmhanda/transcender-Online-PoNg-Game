'use client';
import { User } from "@/app/tools/fetch/api";
import { Localhost, default_img } from "@/app/tools/global";
import axios from "axios";
import Image from "next/image";
import { list } from "postcss";
import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import Uplaod from "./uplaod";
interface Props {
    show: boolean;
    setShow: (show: boolean) => void;
    details: any;

}

const MembersRow = ({ member, setNewListMembers, editMembers , isAdmin}: any) => {
    const [confirmation, setConfirmation] = useState<boolean>(false);
    const [changeRole, setChangeRole] = useState<boolean>(false);
    const ClientQuery = useQueryClient();
    
    if (member == null || member == undefined || 'user' in member == false)
        return null;
    return (
        <div className={"overflow-hidden min-h-[3.5rem] mr-2 relative bg-white bg-opacity-[0.075] flex  items-center before:content-[''] before:w-[4px] before:h-[30px] before:bg-[#FDB971] before:rounded-r-[3px] rounded-lg select-none cursor-pointer"}>

            <div className="z-[1] w-full text-sm flex relative">
                <div className="flex flex-1 first-letter:items-center ml-3">
                    <div className='w-[2.3rem] h-[2.3rem] p-[.2rem] rounded-full border-[1.5px] border-[#FDB971]'>
                        <Image unoptimized 
                            src={default_img(member.user.avatar, member.user.fullname)}
                            alt="valorant"
                            className='rounded-full w-full h-full'
                            width={100}
                            height={100}
                        />
                    </div>
                    
                    <div className='ml-1 flex flex-col justify-center pl-2'>
                        <div className=" text-white font-bold text-[.8rem] leading-[.75rem] mb-1">{member.user.fullname}</div>

                        <div className="text-[9px] leading-[.75rem] text-white text-opacity-50 uppercase">
                            {
                                member.status == "owner" ?
                                    <span className=" text-[#c187fb] text-opacity-100">{member.status}</span>
                                    :
                                    member.status == "admin" ?
                                        <span className=" text-green-400 text-opacity-100">{member.status}</span>
                                        :
                                        member.status
                            }
                        </div>
                    </div>
                </div>

                {
                    member.status != "owner" && isAdmin != 'member' &&
                    <div className="flex items-center gap-2 mr-2">
                        <button aria-label="Solid" className="hover:after:w-[9px] hover:after:h-[9px] before:h-[0] hover:before:w-[70px] hover:before:h-[20px] before:overflow-hidden after:overflow-hidden after:z-[1] z-[2] after:left-[-17px] after:top-[4px] after:absolute after:rotate-45 after:rounded-[1px] after:content-[''] after:!bg-[#aa70e4] before:bg-[#aa70e4] before:text-[10px] before:content-['Change_role'] before:absolute before:top-[-2px] before:left-[-82px] relative ">
                            <Image unoptimized  alt="description" width={100} height={100} src="/change-role.svg?1" className="opacity-50 w-[13px]" onClick={() => {

                                setChangeRole(true)
                            }} />
                        </button>
                        <button
                            aria-label="Solid" className="hover:after:w-[9px] hover:after:h-[9px] before:h-[0] hover:before:w-[60px] hover:before:h-[20px] before:overflow-hidden after:overflow-hidden after:z-[1] z-[2] after:left-[-17px] after:top-[4px] after:absolute after:rotate-45 after:rounded-[1px] after:content-[''] after:!bg-[#aa70e4] before:bg-[#aa70e4] before:text-[10px] before:content-['Remove'] before:absolute before:top-[-2px] before:left-[-72px] relative ">
                            <Image unoptimized  alt="description" width={100} height={100} src="/kickButton.svg" className="opacity-50 w-[13px]" onClick={() => {
                                setConfirmation(true)
                            }
                            } />
                        </button>
                    </div>
                }
            </div>
            {
                member.status != "owner" &&
                <div className={`${confirmation ? "w-12" : "w-0"} transform duration-500 ease-in-out  h-[3.5rem] flex flex-col rounded-l-[6px] absolute  right-0 z-[2]`}>
                    <button className=" rounded-tl-[10px] hover:after:w-[9px] hover:after:h-[9px] hover:before:w-[70px] hover:before:h-[20px] before:hidden hover:before:block before:overflow-hidden after:overflow-hidden after:z-[1] z-[2] after:left-[-17px] after:top-[8px] after:absolute after:rotate-45 after:rounded-[1px] after:content-[''] before:leading-[0] before:pt-[9px] after:!bg-[#aa70e4] before:bg-[#aa70e4] before:text-[10px] before:content-['Remove'] before:absolute before:top-[2.5px] before:left-[-82px] relative h-[50%] w-full bg-[#47b149] flex justify-center items-center" onClick={() => {
                        axios.defaults.withCredentials = true;
                        axios.get(`${Localhost()}/conversation/kick/${member.conversationCid}/${member.id}`).then((res) => {
                            //remove member from list 
                            setNewListMembers(editMembers.filter((m: any) => m.id != member.id))
                            setConfirmation(false)
                        })
                    }}>
                        <Image unoptimized  alt="remove" width={100} height={100} src="/check.svg?v=4" className="w-[13px]" />
                    </button>
                    <button className=" rounded-bl-[10px] hover:after:w-[9px] hover:after:h-[9px] hover:before:w-[70px] hover:before:h-[20px] before:hidden hover:before:block before:overflow-hidden after:overflow-hidden after:z-[1] z-[2] after:left-[-17px] after:top-[8px] after:absolute after:rotate-45 after:rounded-[1px] after:content-[''] before:leading-[0] before:pt-[9px] after:!bg-[#aa70e4] before:bg-[#aa70e4] before:text-[10px] before:content-['Cancel'] before:absolute before:top-[2.5px] before:left-[-82px] relative h-[50%] w-full bg-[#e16e60] flex justify-center items-center" onClick={() => setConfirmation(false)}>
                        <Image unoptimized  alt="cancel" width={100} height={100} src="/cros.svg" className="w-[13px]" />
                    </button>
                </div>
            }
            {
                member.status != "owner" &&
                <div className={`${changeRole ? "w-20" : "w-0"} transform duration-500 ease-in-out  h-[3.5rem] flex flex-col rounded-l-[6px] absolute  right-0 z-[2]`}>
                    <button className={`rounded-tl-[10px] overflow-hidden z-[2] relative h-[50%] w-full text-[#47b149] ${changeRole && "!text-white"} bg-[#47b149] flex justify-center items-center text-[10px] leading-[9px]`}
                        onClick={() => {
                            axios.defaults.withCredentials = true;
                            axios.get(`${Localhost()}/conversation/admin/${member.conversationCid}/${member.id}`).then((res) => {
                                setChangeRole(false)
                                setNewListMembers(editMembers.map((m: any) => {
                                    if (m.id == member.id) {
                                        m.status = m.status == "admin" ? "member" : "admin";
                                    }
                                    return m;
                                }))
                            })
                        }}>
                        {
                            member.status != "member" ?
                                "SET AS MEMBER"
                                :
                                "SET AS ADMIN"
                        }
                    </button>
                    <button className="rounded-bl-[10px] hover:after:w-[9px] hover:after:h-[9px] hover:before:w-[70px] hover:before:h-[20px] before:hidden hover:before:block before:overflow-hidden after:overflow-hidden after:z-[1] z-[2] after:left-[-17px] after:top-[8px] after:absolute after:rotate-45 after:rounded-[1px] after:content-[''] before:leading-[0] before:pt-[9px] after:!bg-[#aa70e4] before:bg-[#aa70e4] before:text-[10px] before:content-['Cancel'] before:absolute before:top-[2.5px] before:left-[-82px] relative h-[50%] w-full bg-[#e16e60] flex justify-center items-center" onClick={() => setChangeRole(false)}>
                        <Image unoptimized  alt="cancel" width={100} height={100} src="/cros.svg" className="w-[13px]" />
                    </button>
                </div>
            }
        </div>
    )
}
const Details = ({ show, setShow, details }: Props) => {
    const refName = useRef<HTMLDivElement>(null);
    // const [type, setType] = useState<string | null>(null);
    const client = useQueryClient();
    const [memberAdd, setMemberAdd] = useState<boolean>(false);
    const type: string = "group";
    const [channelName, setChannelName] = useState<string | undefined>();
    const [description, setDescription] = useState<string | undefined>();
    const [password, setPassword] = useState<string | undefined>();
    const [file, setFile] = useState<File>();
    const [Friends, setFriends] = useState([] as User[]);
    const [userId, setUserId] = useState<number | undefined>(undefined);
    const [status, setStatus] = useState<string>("public");
    const [listMembers, setListMembers] = useState<any[]>([]);


    useEffect(() => {
        function handleClickOutside(event: any) {
            if (refName.current && !refName.current.contains(event.target as Node)) {
                if (event.target?.classList?.contains("details-btn"))
                    return;
                setShow(false);
            }
        }
        document.addEventListener('click', handleClickOutside);
    }, [setShow]);

    useEffect(() => {
        setStatus(details?.status);
        setListMembers(details?.members);
        setChannelName(details?.name);
        setDescription(details?.description);
    }, [details]);

    const { data, isLoading, error } = useQuery({
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
    return (
        <div className={' z-10 flex justify-center h-full items-center opacity-0 overflow-hidden absolute w-full transition-opacity duration-200 ease-in-out ' + (show ? "!opacity-100" : " pointer-events-none z-[-100000]")}>
            <div className={(show ? 'flex absolute justify-center items-center bg-[#211549] bg-opacity-50 w-full h-full backdrop-blur-[8px]' : ' hidden pointer-events-none z-[-100000]')}></div>
            <div ref={refName} className={"min-w-[25rem] bg-[#130C26] bg-opacity-[.5] backdrop-blur-[5px] absolute rounded-[18px] my-auto w-fit h-fit mt-8 translate-y-[-50px] transition-all duration-300 ease-in-out opacity-0 hidden" + (show && " !flex !flex-col transform-none opacity-100  border-2 border-[#a970e3] border-opacity-20 pb-3 ")}>
                <div className="relative max-w-[26rem] px-8 mb-0">
                    <p className="text-white font-bold text-center uppercase pt-4 text-[16px]">MANAGE CHANNEL</p>
                    <div className="pt-2 pb-1 flex flex-col gap-2 overflow-hidden">
                        <div className="relative mb-1 rounded-full after:w-full after:h-full after:bg-[#241852] after:bg-opacity-40 after:font-bold after:text-sm  hover:after:flex after:hidden after:justify-center after:items-center after:top-0 after:absolute mx-auto overflow-hidden cursor-pointer">
                            <Uplaod avatar={details?.avatar} name={"%2B" + details?.count} setFile={setFile} />
                        </div>
                        <div className="relative flex items-center">
                            <Image unoptimized  alt="password" width={100} height={100} src="/group.svg?" className="opacity-50 w-[15px] left-[15px] absolute" />
                            <input
                            disabled={details.UserStatus != "owner" && details.UserStatus != "admin"}
                                type="text"
                                className="focus:border-[#a970e3] border-transparent border-2 placeholder-[#ffffff] placeholder-opacity-50 rounded-[11px] w-full py-[.8rem] bg-[#ebd4ff] bg-opacity-[.08] text-[12px] pl-10 disabled:opacity-20"
                                title="CHANNEL NAME"
                                placeholder="CHANNEL NAME"
                                defaultValue={details?.name}
                                onChange={(e) => {
                                    setChannelName(e.target.value)
                                }}
                            />
                        </div>
                        <div className="relative flex items-center">
                            <Image unoptimized  alt="description" width={100} height={100} src="/description.svg" className="opacity-50 w-[15px] left-[15px] absolute" />
                            <input
                            disabled={details.UserStatus != "owner" && details.UserStatus != "admin"}
                                type="text"
                                className="focus:border-[#a970e3] border-transparent border-2 placeholder-[#ffffff] placeholder-opacity-50 rounded-[11px] w-full py-[.8rem] bg-[#ebd4ff] bg-opacity-[.08] text-[12px] pl-10 disabled:opacity-20"
                                title="DESCRIPTION"
                                placeholder="DESCRIPTION"
                                defaultValue={details?.description}
                                onChange={(e) => {
                                    setDescription(e.target.value)
                                }}
                            />
                        </div>

                        <div role="radiogroup" className={`flex pl-[3px] mt-2 gap-2 mb-[-0px] ${(details.UserStatus != "owner" && details.UserStatus != "admin") && 'hidden'}`}>
                            <div className="flex items-center">
                                <div className="rounded-full w-[1.2rem] h-[1.2rem] flex flex-shrink-0 justify-center items-center relative">
                                    <input checked={status == "public"} onChange={(e) => setStatus("public")} aria-labelledby="public" type="radio" name="type_edit" id="public_edit" className="checkbox appearance-none focus:opacity-100 focus:outline-none rounded-full border-[#A970E3] border-2 absolute cursor-pointer w-full h-full checked:border-none" />
                                    <div className="after:content-[''] after:absolute after:top-[.3rem] after:rounded-full after:left-[.3rem] after:bg-[#A970E3] after:w-[.6rem] after:h-[.6rem] check-icon hidden border-2 border-[#A970E3] rounded-full w-full h-full z-1"></div>
                                </div>
                                <label htmlFor="public_edit" className="select-none ml-2 text-[.7rem] leading-4 font-normal text-[#a99cbb]">PUBLIC</label>
                            </div>
                            <div className="flex items-center">
                                <div className="rounded-full w-[1.2rem] h-[1.2rem] flex flex-shrink-0 justify-center items-center relative">
                                    <input checked={status == "private"} onChange={(e) => setStatus("private")} aria-labelledby="private" type="radio" name="type_edit" id="private_edit" className="checkbox appearance-none focus:opacity-100 focus:outline-none rounded-full border-[#A970E3] border-2 absolute cursor-pointer w-full h-full checked:border-none" />
                                    <div className="after:content-[''] after:absolute after:top-[.3rem] after:rounded-full after:left-[.3rem] after:bg-[#A970E3] after:w-[.6rem] after:h-[.6rem] check-icon hidden border-2 border-[#A970E3] rounded-full w-full h-full z-1"></div>
                                </div>
                                <label htmlFor="private_edit" className="select-none ml-2 text-[.7rem] leading-4 font-normal text-[#a99cbb]">PRIVATE</label>
                            </div>
                            <div className="flex items-center">
                                <div className="rounded-full w-[1.2rem] h-[1.2rem] flex flex-shrink-0 justify-center items-center relative">
                                    <input checked={status == "protected"} onChange={(e) => setStatus("protected")} aria-labelledby="protected" type="radio" name="type_edit" id="protected_edit" className="checkbox appearance-none focus:opacity-100 focus:outline-none rounded-full border-[#A970E3] border-2 absolute cursor-pointer w-full h-full checked:border-none" />
                                    <div className="after:content-[''] after:absolute after:top-[.3rem] after:rounded-full after:left-[.3rem] after:bg-[#A970E3] after:w-[.6rem] after:h-[.6rem] check-icon hidden border-2 border-[#A970E3] rounded-full w-full h-full z-1"></div>
                                </div>
                                <label htmlFor="protected_edit" className="select-none ml-2 text-[.7rem] leading-4 font-normal text-[#a99cbb]">PROTECTED</label>
                            </div>
                        </div>
                        <div className={`${(status == 'protected') ? " h-[50px] " : " h-0 "} overflow-hidden flex  transform duration-500 ease-in-out relative items-center`}>
                            <Image unoptimized  alt="description" width={100} height={100} src="/lock.svg" className="opacity-50 w-[13px] left-[15px] absolute" />
                            <input
                                disabled={details.UserStatus != "owner" && details.UserStatus != "admin"}
                                type="password"
                                className="focus:border-[#a970e3] border-transparent border-2 placeholder-[#ffffff] placeholder-opacity-50 rounded-[11px] w-full py-[1rem] bg-[#ebd4ff] bg-opacity-[.08] text-[10px] pl-10 disabled:opacity-20 "
                                title="PASSWORD"
                                placeholder="PASSWORD"
                                autoComplete="off"
                                onChange={(e) => {
                                    setPassword(e.target.value)
                                }}
                            />
                        </div>
                        <div className="flex justify-between items-center">
                            <h1 className="m-0 leading-[0]">
                                {
                                    !memberAdd ? "Members" : "Add members"
                                }
                            </h1>
                            <button disabled={details.UserStatus != "owner" && details.UserStatus != "admin"} onClick={() => setMemberAdd(!memberAdd)} className={`${memberAdd && "rotate-45"} transition-all duration-300 ease-in-out text-[#fff] text-[1.4rem] leading-[0] pb-[3px] rounded-full w-7 h-7 bg-[#e8d1ff] bg-opacity-[.15] hover:bg-opacity-[.25] disabled:opacity-20 `}>+</button>
                        </div>
                        <div className={`flex flex-col gap-2 max-h-[8rem] overflow-auto transform duration-500 ease-in-out relative ${memberAdd && "!max-h-0"}`}>
                            {
                                listMembers?.map((member: any, index: number) => {
                                    return <MembersRow isAdmin={details.UserStatus} key={member.id + "_" + index} setNewListMembers={setListMembers} editMembers={listMembers} member={member} />
                                })
                            }
                        </div>
                        <div className={`h-0 ${memberAdd && "!h-[11rem]"} transform duration-500 ease-in-out relative overflow-hidden`}>
                            <div className="relative flex items-center mb-2">
                                <Image unoptimized  alt="password" width={100} height={100} src="/search.svg" className="w-[15px] left-[14px] absolute" />
                                <input
                                    type="text"
                                    className="focus:border-[#a970e3] border-transparent border-2 placeholder-[#ffffff] placeholder-opacity-50 rounded-[11px] w-full py-[1rem] bg-[#ebd4ff] bg-opacity-[.08] text-[10px] pl-10"
                                    title="SEARCH"
                                    placeholder="SEARCH"
                                />
                            </div>
                            <div className="flex flex-col gap-2 max-h-[7.5rem] overflow-auto">
                                {

                                    Friends.length > 0 && Friends.map((frnd, index) => {
                                        //check if this friend is already in the members list
                                        if (details?.members?.find((member: any) => member.user.id == frnd.id))
                                            return null;
                                        return (
                                            <div onClick={() => { frnd.id != userId ? setUserId(frnd.id) : setUserId(undefined) }} key={index} className={" hover:bg-opacity-20 min-h-[3.2rem] mr-2 overflow-hidden relative bg-white bg-opacity-[0.075] flex  items-center before:content-[''] before:w-[4px] before:h-[30px] before:bg-[#FDB971] before:rounded-r-[3px] rounded-lg select-none cursor-pointer"}>
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
                                                    <div
                                                        onClick={() => {
                                                            //remove this friend from the list and add it to the members list

                                                            Friends.splice(index, 1);
                                                            axios.defaults.withCredentials = true;
                                                            axios.post(`${Localhost()}/membership`, { "userId": frnd.id, status: "member", conversationId: details.id, }).then((res) => {
                                                                client.invalidateQueries('GetConversationId');
                                                            });
                                                        }}
                                                        className="p-1 w-10 h-10 bg-white bg-opacity-20 flex justify-center items-center rounded-full mx-1">
                                                        <Image unoptimized  alt="icon for add new member" width={100} height={100} src="/cros.svg" className="w-[13px] rotate-45" />
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                        <button
                        disabled={details.UserStatus != "owner" && details.UserStatus != "admin"}
                            onClick={() => {
                                if (details.UserStatus == "owner" || details.UserStatus == "admin"){
                                    const formData = new FormData();
                                    formData.append("file", file as Blob);
                                    
                                    channelName && formData.append("name", channelName);
                                    description && formData.append("description", description);
                                    formData.append("status", status);
                                    formData.append("type", type);
                                    password && formData.append("password", password);
    
                                    
                                    axios.defaults.withCredentials = true;
                                    axios.patch(`${Localhost()}/conversation/${details.cid}`, formData).then((res) => {
                                        setShow(false);
                                        client.invalidateQueries('Conversation');
                                    });
                                }

                            }}
                            className=" disabled:opacity-20 rounded-[11px] py-[.9rem] w-full bg-[#A970E3] font-medium text-[13px] text-white text-opacity-90">EDIT NOW</button>
                        <button
                            className="rounded-[11px] py-[.9rem] w-full bg-[#ff4141] font-medium text-[13px] text-white text-opacity-90 hover:opacity-20"
                            onClick={() => {
                                axios.defaults.withCredentials = true;
                                axios.get(`${Localhost()}/conversation/leave/${details.id}`).then((res) => {
                                    setShow(false);
                                });
                            }}

                        >Leave</button>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Details;