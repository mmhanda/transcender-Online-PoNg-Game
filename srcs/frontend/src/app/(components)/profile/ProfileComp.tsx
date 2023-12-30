'use client'
import axios from 'axios';
import Image from 'next/image';
import React, { useRef, useState, useEffect, use, FC } from 'react';
import { useQuery } from 'react-query';
import { TabsDefault } from './tabs';
import { Loading } from '../Loading/Loading';
import NoOne from './noOne';
import Box from './box';
import { default_img, copyToClipboard, Localhost, simpleDate } from '@/app/tools/global';
import Btn from './btn';
import { sendSocketData, socket } from '@/app/tools/socket/socket';
import { useRouter } from "next/navigation";

export interface User {
  id: string;
  fullname: string;
  email: string;
  avatar: string;
  status: string;
  lvl: number;
  createdAt?: string;
  playerStats: {
    xp: number;
    wins: number;
    losses: number;
    draws: number;
    winRate: number;
    rank: number;
    rankTierId: number;
    playeTime: number;
    games: number;
  },
  classment?: number,
  friendCount?: number,
  tier: {
    id: 1,
    name: string,
    image: string,
    minRank: number,
    maxRank: number,
    color: string,
    degree: number,
    createdAt: string
  }
}

interface Props {
  userId: number;
}

const ProfileComp: FC<Props> = ({ userId }) => {
  const [isFriend, setIsFriend] = useState<boolean | string>(false)
  const [isBlocked, setIsBlocked] = useState<boolean | string>(false) //stupid but it works
  const [isLogged, setIsLogged] = useState(false)
  const [user, setUser] = useState({} as User)
  const [hide, setHide] = useState(false)
  const [load, setLoad] = useState(false)
  const [isMe, setIsMe] = useState(false)
  const router = useRouter();

  const { data, isLoading, error, status, refetch } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      axios.defaults.withCredentials = true;
      try {
        if (userId) {
          const response = await axios.get(`${Localhost()}/users/${userId}?time=${new Date().getTime()}`);
          console.log("Profile called")
          if (response.data.status == 300 && response?.data?.message == "User not retrieved")
            refetch()
          if (response.data.data == null) {
            return null;
          }
          return response.data.data;
        }
        else {
          const res = await axios.get(`${Localhost()}/users/0`);
          return res.data.data;
        }
      } catch (error) {
      }
    }
  });

  useEffect(() => {
    if (status == "success" && data) {
      if (data?.id) {
        setUser(data)
        if ('Friendstatus' in data)
          setIsFriend(data.Friendstatus)
        if ('Blockstatus' in data) {
          setIsBlocked(data.Blockstatus)
        }
        if ('Isyou' in data)
          setIsMe(data.Isyou)
        if (!isLogged) {
          setIsLogged(true)
        }
      }
    }
  }, [data, userId, status, isLogged])

  useEffect(() => {
    setLoad(true)
    setTimeout(() => {
      setLoad(false)
    }, 1500);
  }, []);

 const lvl = (xp:number) => {
    if(xp == 0)
      return '1'
    return Math.log2(xp).toFixed()
  }
  
  useEffect(() => {
    socket.on('inviteFriend', () => {
      setIsFriend('request')
    })
    socket.on('acceptFriend', () => {
      setIsFriend('accepted')
    })
    socket.on('challengeFriend', () => {
      // setIsFriend('accepted')
    })
    return () => {
      socket.off('inviteFriend')
      socket.off('acceptFriend')
      socket.off('challengeFriend')
    }
  }, [])


  const handelGameEvent = () => {
    if (userId) {
      sendSocketData({ challengeFriend: userId }, 'Global_challengeFriend');
      router.push(`/game/gameCustom?CreateOrJoin=${'create'}&userId=${userId}`);
    }
  }
  const handleCopyClick = (id: string) => {
    copyToClipboard(id)
  }
  if (load || isLoading)
    return <Loading show={true} />;
  if (error || data == null || isBlocked == 'block')
    return <NoOne />;
  return (
    <div className='w-full flex flex-col justify-center items-center'>
      <div className='w-full px-[3rem]'>
        <div className='flex w-full sm:justify-between justify-center pt-[0.5rem]'>
          <div className='w-full flex flex-col justify-center'>
            <div className=' items-center gap-0 sm:gap-2 flex flex-col sm:flex-row'>
              <div className='relative py-2 flex items-center justify-center mb-1 sm:mb-0'>
                <Image unoptimized  src={default_img(user?.avatar, user?.fullname)} className=' rounded-[.6rem] m-1 w-[100px] h-[100px] min-w-[100px] min-h-[100px]' alt="Picture of the author" width={100} height={100} />
                <div className=' text-white bottom-[-3px] absolute sm:hidden flex gap-2'>
                  <div className='relative flex justify-center items-center'>
                    <Image unoptimized  src='/level.svg' alt="Branze" width={25} height={25} />
                    <span className='text-[.9rem] absolute'>{user && 'playerStats' in user && 'xp' in user.playerStats ? lvl(user?.playerStats?.xp) : '?'}</span>
                  </div>
                  <div className='relative flex justify-center items-center'>
                    <Image unoptimized  quality={100} src={`${(user && user?.tier && user?.tier.image) ? Localhost() + user?.tier?.image : default_img(user?.tier?.image, user?.tier?.name)}`} alt={'name of icone : ' + user?.tier?.name} width={32} height={32} />
                  </div>
                </div>
              </div>
              <div className='flex-col'>
                <div className='flex-row sm:flex items-center'>
                  <span className='text-[1.1rem] font-bold'>{user?.fullname}</span>
                  <span className="text-[.8rem] mx-[0.3rem] font-bold hidden sm:flex"> • </span>
                  <div className='flex justify-center cursor-pointer hover:opacity-80 -mt-1 sm:mt-0 mb-2 sm:mb-0'>
                    <span className="text-[.8rem] mt-0 sm:mt-[2px] font-light opacity-60" onClick={() => { handleCopyClick(user?.id) }}>
                      ID: {user?.id}
                    </span>
                    <Image unoptimized  className='w-[.65rem] ml-1 mt-[2px]' src='/copy.svg' alt="copy icon" width={15} height={15} />
                  </div>
                </div>
                <span className='text-sm opacity-60 font-light hidden sm:flex'>
                  <div className='flex items-center justify-center gap-2'>
                    {
                      (userId == 0 && user?.status == 'offline') ? <><div className='w-2 h-2 rounded-full mt-[3px] bg-green-500'></div> online</>
                      :
                      <>
                        <div className={`w-2 h-2 rounded-full mt-[3px] ${user?.status == 'online' && 'bg-green-500'} ${user?.status == 'offline' && 'bg-red-500'} ${user?.status == 'inGame' && 'bg-blue-600 '}`}></div>
                        {user?.status}
                      </>
                    }
                  </div>
                </span>
              </div>
            </div>

          </div>
          <div className='hidden sm:flex items-center'>
            <Box _key='REGISTRED' icon='/date.svg' value={simpleDate(user?.createdAt)} styles="hidden lg:flex" iconStyle="mb-2 w-7" />
            <Box _key='COUNTRY' icon='/location.svg' value='MORROCO' styles="hidden xl:flex" iconStyle=" mb-2 w-6" />
            <Box _key='RATING' icon='/rank.svg' value={`${user?.playerStats?.rank}/${user?.tier?.maxRank == 10000 ? user?.tier?.minRank + 201 : user?.tier?.maxRank + 1}`} progress={100 - (((user?.tier?.maxRank + 1) - user?.playerStats?.rank) / 2)} iconStyle="mt-1 mb-2 w-[36px]" />
            <div className='w-[8rem] ml-2 hidden xl:flex xl:flex-col items-center h-[6.5rem] justify-center'>
              <Image unoptimized  quality={100} src={`${(user && user?.tier && user?.tier.image) ? Localhost() + user?.tier?.image : default_img(user?.tier?.image, user?.tier?.name)}`} alt={'name of icone : ' + user?.tier?.name} width={192} height={192} />
              <span
              style={{ color: 'tier' in user ? user?.tier?.color : "white" }}
              className={`text-lg font-black -mt-2`}>{user?.tier?.name}</span>
            </div>
          </div>
        </div>
        
        {
          (userId && !isMe) ?
            !isBlocked ? <div className=' flex flex-wrap items-center gap-2 relative select-none mb-[2.5rem] sm:justify-start justify-center'>
              <div className='w-[6.1rem] mr-3 justify-center items-center hidden sm:flex'>
                <Image unoptimized  src='/level.svg' alt="Branze" width={30} height={30} />
                <span className='text-white absolute'>
                  {
                    user && 'playerStats' in user && 'xp' in user?.playerStats ? lvl(user?.playerStats?.xp) : '?'
                  }
                </span>
              </div>
              {isFriend == false && <Btn iconStyles="mr-1 ml-[.2rem] w-5 " className="hover:opacity-80 pl-[.45rem] pr-[.6rem] text-white bg-[#BE195D]" icon='/add.svg' text='Add Friend' onClick={() => { sendSocketData({ inviteFriend: userId }, 'Global_inviteFriend'); setIsFriend('pending'); }} />}
              {isFriend == 'accepted' && <Btn iconStyles="mr-1 ml-[.2rem] w-5 " className="hover:opacity-80 pl-[.45rem] pr-[.4rem] text-[#BE195D] bg-[#ffe6f1]" icon='/unfriend.svg' onClick={() => {
                axios.delete(`${Localhost()}/friends/${userId}`,).then(res => { res.status == 200 && setIsFriend(false); })
              }} />}
              {isFriend == 'pending' && <Btn iconStyles="mr-2 ml-[.2rem] w-5 " className="hover:opacity-80 pl-[.45rem] pr-[.4rem] text-[#BE195D] bg-[#ffe6f1]" icon='/cancel.svg' text='pending' onClick={() => {
                axios.delete(`${Localhost()}/friends/${userId}`,).then(res => { res.status == 200 && setIsFriend(false); })
              }} />}
              {isFriend == 'accepted' && <Btn iconStyles="w-[1.2rem] ml-[.2rem] mr-1" className="hover:opacity-80 pl-[.3rem] pr-[.6rem] bg-white bg-opacity-[.2] text-white" icon='/Game.svg' text='Challenge' onClick={() => handelGameEvent()} />}
              {isFriend == 'accepted' && <Btn className="hover:opacity-80 pl-[.3rem] pr-[.6rem] text-opacity-70 hidden md:flex text-white" text='Block' onClick={() => axios.post(`${Localhost()}/block`, { blockerId: userId }).then(res => { res.status == 200 && setIsFriend(false); setIsBlocked(true) })} />}
              {isFriend == 'request' && <Btn iconStyles="mr-1 ml-[.2rem] w-5 " className="hover:opacity-80 pl-[.45rem] pr-[.4rem] text-[#BE195D] bg-[#ffe6f1]" icon='/accept.svg' text='Accept' onClick={() => { setIsFriend('accepted'); sendSocketData({ acceptFriend: userId }, 'Global_acceptFriend') }} />}
              <Btn className='relative md:hidden flex -m-[.4rem]' iconStyles="rotate-90 w-4 opacity-60 hover:opacity-40" icon='/Dots.svg' onClick={() => setHide(!hide)}>
                <div className={hide ? 'before:content-[""] before:top-[-.32rem] items-center before:absolute before:rotate-[45deg] before:rounded-[3px] before:w-3 before:h-3 before:bg-[#47475b] absolute top-9 w-[6rem] right-[-2.5rem] flex flex-col bg-[#47475b] py-1 px-1 md:hidden z-10 select-none' : 'hidden '}>
                  <Btn className="hover:opacity-80 pl-[.3rem] pr-[.6rem] text-opacity-70 flex rounded-none" text='Block' onClick={() => { axios.post(`${Localhost()}/block`, { blockerId: userId }).then(res => { res.status == 200 && setIsFriend(false); setIsBlocked(true) }) }} />
                </div>
              </Btn>
            </div> : <div className=' flex flex-wrap items-center gap-2 relative select-none mb-[2.5rem] sm:justify-start justify-center'>
              <div className='w-[6.1rem] mr-3 justify-center items-center hidden sm:flex'>
                <Image unoptimized  src='/level.svg' alt="Branze" width={30} height={30} />
                <span className='text-white absolute'>
                  {
                    user && 'playerStats' in user && 'xp' in user?.playerStats ? lvl(user?.playerStats?.xp) : '?'
                  }
                </span>
              </div>
              <Btn className="hover:opacity-80 pl-[.3rem] pr-[.6rem] text-opacity-70 hidden md:flex text-white" text='Unblock' onClick={() => { axios.delete(`${Localhost()}/block/${userId}`,).then(res => { res.status == 200 && setIsBlocked(false); }) }} />
            </div>
            : <div className='mt-[2.5rem]'  ></div>
        }
      </div>
      <div className=' w-full h-full flex m-auto'  >
        <TabsDefault userId={userId} user={user} />
      </div>

    </div>
  );
}



export { ProfileComp };