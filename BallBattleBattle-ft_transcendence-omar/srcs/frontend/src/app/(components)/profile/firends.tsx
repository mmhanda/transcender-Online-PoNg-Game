import { Localhost, default_img } from '@/app/tools/global';
import Image from 'next/image'
import React, { FC, use, useEffect, useState } from 'react'
import Btn from './btn';
import axios from 'axios';
import { useQuery } from 'react-query';
import Link from 'next/link';
import { sendSocketData } from '@/app/tools/socket/socket';
import { useRouter } from "next/navigation";

interface FriendBoxProps {
    index: number;
    user: User;

}

interface User {
    id: number;
    fullname: string;
    email?: string;
    avatar: string | undefined;
    lvl?: number;
    isMe?: boolean;
    status?: string;
}

const FriendBox = ({ user, index }: FriendBoxProps) => {
    const router = useRouter();
    return (
        <div key={index + '_' + user?.id} className="py-1 overflow-hidden bg-white bg-opacity-[0.15] flex  items-center before:content-[''] before:w-[6px] before:h-[50px] before:bg-[#FDB971] before:rounded-r-[3px] rounded-lg">

            <div className="w-full py-1 text-sm flex">
                <div className="flex flex-1 first-letter:items-center ml-3 gap-3">
                    <div className='w-[2.1rem] h-[2.1rem] md:w-[3.5rem] md:h-[3.5rem] p-[.2rem] md:p-[.2rem] rounded-full border-[1.5px] border-[#FDB971]'>
                        <Image unoptimized
                            src={default_img(user?.avatar, user?.fullname)}
                            alt="valorant"
                            className='rounded-full w-full h-full'
                            width={100}
                            height={100}
                        />
                    </div>
                    <div className=' ml-2 flex flex-col justify-center  gap-1'>
                        <Link href={`/user/${user.id}`} className='flex flex-col justify-center'>
                            <div className="text-white font-bold text-[.8rem] leading-[.75rem]">{user.fullname}</div>
                        </Link>
                        <div className=' flex gap-2 items-center'>
                            <div className={` rounded-full w-2 h-2 ${user?.status == 'online' && 'bg-green-500'} ${user?.status == 'offline' && 'bg-red-500'} ${user?.status == 'inGame' && 'bg-blue-600 '}  `}></div>
                            {user.status}
                        </div>
                    </div>
                </div>
                {
                    user.isMe == false &&
                    <div className="flex flex-1 items-center justify-end mr-3 gap-2">
                        {/* <Btn iconStyles=" w-[50%] m-auto " className="hover:opacity-80 w-[2.1rem] h-[2.1rem] !rounded-[.6rem] bg-[#1983BE]" icon='/chat.svg' onClick={() => {
                            
                        }} /> */}
                        <Btn iconStyles=" w-[50%] m-auto " className="hover:opacity-80 w-[2.1rem] h-[2.1rem] !rounded-[.6rem] bg-[#83828F]" icon='/Game.svg' onClick={() => {
                            sendSocketData({ challengeFriend: user.id }, 'Global_challengeFriend');
                            router.push(`/game/gameCustom?CreateOrJoin=${'create'}&userId=${user.id}`);
                        }} />
                    </div>
                }
            </div>
        </div>
    )
}

interface FriendsProps {
    ID?: number;
}

const Friends: FC<FriendsProps> = ({ ID }) => {
    const [Friends, setFriends] = useState([] as User[]);
    const { data, isLoading, error, status } = useQuery({
        queryKey: ['getFriends'],
        queryFn: async () => {
            axios.defaults.withCredentials = true;
            try {
                let res;
                if (!ID)
                    res = await axios.get(`${Localhost()}/friends/user/0`); // get my friends list
                else
                    res = await axios.get(`${Localhost()}/friends/user/${ID}`); //get user friends list
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

    if (isLoading)
        return <div className='flex m-auto w-max' >loading...</div>
    return (
        Friends.map((user, index) => {
            return <FriendBox key={index} user={user} index={index} />
        })
    )
}

export default Friends
