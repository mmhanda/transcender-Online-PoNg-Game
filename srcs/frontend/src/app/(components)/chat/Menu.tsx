'use client';
import { Localhost, copyToClipboard, default_img } from "@/app/tools/global";
import { sendSocketData } from "@/app/tools/socket/socket";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Dispatch, FC, useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
interface Messager {
  id: number;
  avatar: string;
  fullname: string;
  idChat: number;
  memberId?: string;
  conversationCid?: string;
  status?: string;
  isFriend?: boolean;
};
interface Props {
  isAdmin?: string;
  show: boolean;
  setShow: (show: boolean) => void;
  setMessagerCallBack: (messager: Messager) => void;
  Messager: Messager;

}

interface TimerProps {
  show: boolean;
  ChatId?: string;
  memberId?: string;
  setMessagerCallBack: (messager: Messager) => void;
  Messager: Messager;
}

const TimerMute: FC<TimerProps> = ({ show, ChatId, memberId, setMessagerCallBack, Messager }) => {

  const [hidden, sethidden] = useState(false);
  const [inputValue, setInputValue] = useState(0);

  useEffect(() => {
    sethidden(show);
  }, [show]);


  if (hidden == false)
    return null;

  return (
    <div className="absolute self-center text-black top-[-25%] left-0 flex flex-col gap-2 z-[9999999999] bg-[#151027] rounded-[16px] px-3 py-2 w-full h-[8rem]">
      <input
        type="number" id="timer"
        min={1}
        onChange={(event: any) => {
          setInputValue(parseInt(event.target.value));
        }}
        className=" bg-[#6f1ed722] text-white justify-center items-center text-base flex pl-3 h-8 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" placeholder="in hours"
      />
      <button
        className="bg-[#48475A] hover:bg-opacity-75 text-white bg-opacity-95 items-center justify-center flex cursor-pointer px-[.5rem] py-1 z-50 "
        onClick={() => {
          axios.defaults.withCredentials = true;
          axios.post(`${Localhost()}/conversation/mute/`, { id: ChatId, memberId: memberId, time: inputValue }).then((res) => {
            setMessagerCallBack({ ...Messager, status: 'muted' })
            sethidden(false);
          })
        }}

      >Mute</button>
      <button
        className="bg-[#48475A] hover:bg-opacity-75 text-white  bg-opacity-95 items-center justify-center z-50 flex cursor-pointer px-[.5rem] py-1"
        onClick={() => {
          sethidden(false);
        }}
      >
        Cancel
      </button>
    </div>
  );
}

const Menu = ({ isAdmin, show, setShow, Messager, setMessagerCallBack }: Props) => {
  const [copyMessageVisible, setCopyMessageVisible] = useState(false);
  const refName = useRef<HTMLDivElement>(null);
  const [UserState, setUserState] = useState<string | undefined>();
  const [timerShow, setTimerShow] = useState(false);
  const [isFriend, setIsFriend] = useState<string | boolean>(false);
  const router = useRouter();
  const ClientQuery = useQueryClient();

  const handleCopyClick = (id: number) => {
    copyToClipboard(`${id}`)
    setCopyMessageVisible(true);
    setTimeout(() => {
      setCopyMessageVisible(false);
    }, 2000);
  }

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (refName.current && !refName.current.contains(event.target as Node)) {
        if (event.target?.classList?.contains("menu-btn"))
          return;
        setShow(false);
      }
    }
    document.addEventListener('click', handleClickOutside);
  }, [setShow]);

  useEffect(() => {
    if (Messager.isFriend != undefined)
      setIsFriend(Messager.isFriend)
  }, [Messager.isFriend]);

  const handleJoinGame = () => {
    sendSocketData({ challengeFriend: Messager.id }, 'Global_challengeFriend');
    router.push(`/game/gameCustom?CreateOrJoin=${'create'}&userId=${Messager.id}`);
  }

  return (
    <div className={'z-10 flex justify-center h-full items-center opacity-0 overflow-hidden absolute w-full transition-all duration-200 ease-in-out ' + (show ? "!opacity-100" : " pointer-events-none")}>
      <div className={(show ? 'flex absolute justify-center items-center bg-[#211549] bg-opacity-50 w-full h-full backdrop-blur-[8px]' : ' hidden ')} />
      <div ref={refName} className={"bg-[#1f1738] absolute rounded-[18px] my-auto w-fit h-fit mt-8 translate-y-[-50px] transition-all duration-300 ease-in-out opacity-0 hidden" + (show && " !flex !flex-col transform-none opacity-100")}>
        <div className="mb-[-2rem] relative">
          <div className="absolute w-full h-full overflow-hidden rounded-t-[18px]">
            <div className="absolute bg-[#4a2d4f] w-full h-full rounded-r-full rounded-b-full blur-xl -left-24 -top-24 opacity-80 "></div>
          </div>
          <div className="relative -top-8 w-auto ">
            <div className="w-full max-h-16 flex justify-center items-center rounded-full relative">
              <Image unoptimized
                width={120} height={120}
                src={default_img(Messager.avatar, Messager.fullname)}
                alt="User Avatar" className="w-16 h-16 rounded-full" />
            </div>
            <p className="text-white uppercase text-center font-bold text-base leading-4 mt-3 relative">{Messager.fullname}</p>
            <div className="h-[20px] justify-center items-center flex z-20 relative cursor-pointer" onClick={() => handleCopyClick(Messager?.id)}>
              <p className="text-white opacity-60 uppercase font-light text-[.8rem] leading-4">{Messager.id}</p>
              <Image unoptimized width={120} height={120} src="/copy.svg" alt="Copy User ID" className="ml-1 w-[.6rem] h-[.6rem]" />
              {copyMessageVisible && (
                <div className="absolute text-white text-xs bg-slate-500 px-1 rounded-sm">
                  Copied!
                </div>
              )}
            </div>
            <div className="mt-2 flex justify-center gap-2 mx-5">
              <div className=' bg-gray-500 h-[32px] w-[32px] rounded-xl items-center justify-center flex cursor-pointer' >
                <Link title="View Profile" href={`/user/${Messager.id}`}> <Image unoptimized width={100} height={100} src='/Profile.svg' alt="Check Button" className="w-4 h-4" /></Link>
              </div>
              <div className=" bg-[#2c4fce] h-[32px] w-[32px] rounded-xl top-24 items-center justify-center flex cursor-pointer" onClick={() => {
                if (Messager.id != undefined) {
                  axios.defaults.withCredentials = true;
                  axios.post(`${Localhost()}/conversation`, { name: Messager.fullname, description: "Direct Message", status: "private", type: "direct", guestId: Messager.id }).then((res) => {
                    if (res.data.data.cid) {
                      ClientQuery.invalidateQueries('Conversation');
                      router.push(`/chat/${res.data.data.cid}`);
                      setShow(false);
                    }
                  })
                }

              }}>
                <Image unoptimized width={120} height={120} src="/chat.svg" alt="Private Chat Button" className="w-[50%]" />
              </div>
              <div className=" bg-[#4F466E] h-[32px] w-[32px] rounded-xl  items-center justify-center flex cursor-pointer" onClick={() => { handleJoinGame() }}>
                <Image unoptimized width={120} height={120} src="/Game.svg" alt="Game Button" className="w-[60%]" />
              </div>
            </div>

            {
              (isAdmin == 'owner' || isAdmin == 'admine' )   ?
                <div className=" relative">
                  <div className="mx-6 flex justify-center items-center my-4 before:bg-[#4e3a51] before:z-[-1] z-[1] before:content-[''] before:h-[1px] before:absolute  before:w-full relative">
                    <div className=" bg-[#4e3a51] rounded-[16.5px] items-center justify-center flex py-[.2rem] px-[.45rem]">
                      <p className="text-white text-opacity-80 text-[.65rem] font-medium leading-4 z-10">ADMIN ROLES</p>
                    </div>
                  </div>
                  <div className="relative flex px-3 gap-2">

                    <div className={`select-none  bg-[#48475A] rounded-2xl bg-opacity-95 items-center justify-center flex cursor-pointer px-[.5rem] py-1 ${Messager.status != undefined ? 'hover:opacity-80' : ' opacity-20 cursor-not-allowed'}`}
                      onClick={() => {
                        {
                          if (Messager.status == 'member' || Messager.status == 'muted') {
                            axios.defaults.withCredentials = true;
                            axios.get(`${Localhost()}/conversation/ban/${Messager.conversationCid}/${Messager.memberId}`).then((res) => {
                              setMessagerCallBack({ ...Messager, status: 'baned' })
                              ClientQuery.invalidateQueries('GetConversationId');
                            })
                          }
                          else if (Messager.status == 'baned') {
                            axios.defaults.withCredentials = true;
                            axios.get(`${Localhost()}/conversation/unban/${Messager.conversationCid}/${Messager.memberId}`).then((res) => {
                              setMessagerCallBack({ ...Messager, status: 'member' })
                            })
                          }
                        }
                      }}>
                      <Image unoptimized width={100} height={100} src={"/banButton.svg"} alt="Ban Button" className="w-3 mr-1" />
                      <p className=" text-white font-medium text-xs leading-4">
                        {
                          Messager.status == 'member' ? 'BAN' : Messager.status == 'baned' ? 'UNBAN' : 'BAN'
                        }
                      </p>
                    </div>



                    <div className={`select-none  bg-[#48475A] rounded-2xl bg-opacity-95 items-center justify-center flex cursor-pointer px-[.5rem] py-1 ${Messager.status == 'member' || Messager.status == 'muted' ? 'hover:opacity-80' : ' opacity-20 cursor-not-allowed'}`} onClick={() => {

                      if (Messager.status == 'member') {
                        setTimerShow(true);
                      }
                      else if (Messager.status == 'muted') {
                        axios.defaults.withCredentials = true;
                        //${Messager.conversationCid}/${Messager.memberId}
                        axios.post(`${Localhost()}/conversation/unmute`, { id: Messager.conversationCid, memberId: Messager.memberId }).then((res) => {
                          setMessagerCallBack({ ...Messager, status: 'member' })

                        })
                      }
                    }}>
                      <Image unoptimized width={100} height={100} src={"/muteButton.svg"} alt="Ban Button" className="w-3 mr-1" />
                      <p className=" text-white font-medium text-xs leading-4">
                        {
                          Messager.status == 'member' ? 'MUTE' : Messager.status == 'muted' ? 'UNMUTE' : 'MUTE'
                        }
                      </p>
                    </div>
                    <TimerMute show={timerShow} ChatId={Messager.conversationCid} memberId={Messager.memberId} Messager={Messager} setMessagerCallBack={setMessagerCallBack} />
                    {
                      <button className={`select-none  bg-[#48475A] rounded-2xl bg-opacity-95 items-center justify-center flex cursor-pointer px-[.5rem] py-1 ${Messager.status == 'member' || Messager.status == 'muted' ? 'hover:opacity-80' : ' opacity-20 cursor-not-allowed'}`} onClick={() => {
                        if (Messager.status == 'member' || Messager.status == 'baned') {
                          axios.defaults.withCredentials = true;
                          axios.get(`${Localhost()}/conversation/kick/${Messager.conversationCid}/${Messager.memberId}`).then((res) => {
                            setMessagerCallBack({ ...Messager, status: undefined })
                            ClientQuery.invalidateQueries('GetConversationId');
                          })
                        }
                      }}>
                        <Image unoptimized width={100} height={100} src={"/kickButton.svg"} alt="Ban Button" className="w-3 mr-1" />
                        <p className=" text-white font-medium text-xs leading-4">KICK</p>
                      </button>
                    }
                  </div>
                </div> : null
            }
          </div>
        </div>
        <div className="flex flex-col py-[12.5px] items-center select-none hover:opacity-80 cursor-pointer" onClick={() => { }}>
          <Link href={`/user/${Messager.id}`} className=" text-white font-normal text-[.65rem] leading-5">VIEW PROFILE</Link>
          <Image unoptimized width={100} height={100} src={"/arrowButton.svg"} alt="Down Flesh" className="w-[.8rem] animate-bounce" />
        </div>
      </div>
    </div>
  )
};

export default Menu;