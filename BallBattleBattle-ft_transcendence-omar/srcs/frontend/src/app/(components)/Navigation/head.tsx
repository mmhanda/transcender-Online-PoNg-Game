'use client'
import React, { useState, useRef, useEffect } from "react";
import Dropdown from "./Dropdown";
import './Navigation.css'
import NotificationMenu from "./notificationsMenu";
import Link from "next/link";
import SideBar from "./sideBar";
import Filter from "./filter";
import Image from "next/image";
import { Localhost, default_img } from "@/app/tools/global";
import { useQuery } from "react-query";
import axios from "axios";
import { usePathname } from "next/navigation";

interface props {
    setLogin: any;
    login: any;
    user: any;
    setLoading: any;
    show: () => void;
}

interface Notification {
    id?: number;
    senderId?: number;
    avatar: string;
    content: string;
    type: string;
    conversationId?: number;
    fullname?: string;
  }

const Head = ({ setLogin, login, user, setLoading, show }: props) => {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const [notifications, setNotifications] = useState<Notification[]>([] as Notification[])

    const { data, isLoading, error, status } = useQuery({
        queryKey: ['getNotifications'],
        queryFn: async () => {
            axios.defaults.withCredentials = true;
            try {
                const res = await axios.get(`${Localhost()}/notification/user`); //get user friends list
                return res.data.notifications;
            } catch (error) {
            }
        }
    });
    useEffect(() => {
        if (data)
            setNotifications(data);
    }, [data])

    function pageTitle(rooter: string) {
        if (rooter == '/') return ('DASHBOARD');
        if (rooter == '/chat') return ('MESSANGER');
        if (rooter == '/game') return ('GAME');
        if (rooter == '/profile') return ('PROFILE');
    }

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };
    return (
        <div className="fixed w-full z-50 flex h-[70px] ">
            <div className="flex justify-between">
                <Link href='/'
                    className=' flex bg-[#32274d] justify-center items-center w-[75px] w-max-[75px] w-min-[75px] h-full'>
                    <Image unoptimized 
                        src="/BattleBall-logo.svg"
                        alt="Picture of the author"
                        priority={true}
                        quality={75}
                        width={100}
                        height={100}
                        className='md:w-[3rem] w-[2.5rem] md:h-[3rem] h-[2.5rem] rounded-full bg-[#A970E3]'
                    />
                </Link>
            </div>
            <div className="flex flex-1 backdrop-blur-md bg-[#32274d] bg-opacity-[.20] justify-end items-center relative ">
                <div className="items-center flex-1 text-[12px] font-bold ml-4 hidden md:flex">
                    {
                        pageTitle(pathname)
                    }
                </div>
                <div className=" block self-auto left-0 mr-auto items-center md:hidden">
                    <SideBar show={show} />
                </div>
                <Link title="Find a Friend" href='/Search' className=" sm:hidden cursor-pointer relative hover:bg-opacity-[20%] bg-opacity-[10%] bg-white w-10 h-10 flex justify-center items-center mx-2 rounded-full">
                    <Image unoptimized  src="/search.svg?v1" alt="Picture of the author" priority={true} quality={75} width={100} height={100} className="w-[42%]" />
                 </Link>
                <Filter />
                <div>
                    <NotificationMenu setNewNotifications={setNotifications} notifications={notifications} />
                </div>
                <div onClick={toggleDropdown} ref={dropdownRef} className='cursor-pointer flex justify-center items-center w-[75px] w-max-[75px] w-min-[75px] h-full righ-0 top-0'>
                    <Image unoptimized 
                        src={default_img(user?.avatar, user?.fullname)}
                        alt="Picture of the author"
                        width={100}
                        height={100}
                        className='md:w-[3rem] w-[2.3rem] md:h-[3rem] h-[2.3rem] rounded-full bg-[#A970E3]' />
                </div>
                <Dropdown show={show} setLoading={setLoading} login={login} setLogin={setLogin} setIsOpen={setIsOpen} isOpen={isOpen} forwardedRef={dropdownRef} />
            </div>
        </div>
    )
}

export default Head;