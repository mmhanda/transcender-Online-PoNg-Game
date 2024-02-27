import React, { useState, useEffect, useRef, use } from "react";
import Avtr from "@/app/tools/avatar";
import { default_img } from "@/app/tools/global";
// import io from 'socket.io-client';
// import { sendSocketData } from "@/app/tools/socket/socket";
import Image from "next/image";
import { useQuery } from "react-query";
import axios from "axios";
import { Localhost } from "@/app/tools/global";
import { socket } from "@/app/tools/socket/socket";
import Link from "next/link";
interface Notification {
  id?: number;
  senderId?: number;
  avatar: string;
  content: string;
  type: string;
  conversationId?: number;
  fullname?: string;
}

interface NotificationMenuProps {
  notifications: Notification[];
  setNewNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
}

const NotificationMenu: React.FC<NotificationMenuProps> = ({ notifications, setNewNotifications }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  //fetch using me()
  const [count, setCount] = useState<number>(0);
  const { data, refetch } = useQuery('count', async () => {
    const response = await fetch(`${Localhost()}/users/me`, {
      method: 'GET',
      credentials: 'include',
    });
    const data = await response.json();
    return data.data;
  });
  
  useEffect(() => {
    if (data && "unreadNotification" in data) {
      setCount(data.unreadNotification)
    }
  }, [data, count])



  const toggleMenu = () => {
    setIsOpen(!isOpen);
    axios.patch(`${Localhost()}/users/unreadNotification`, {}, { withCredentials: true }).then(res => { refetch(); });
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  //click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (listRef.current && !listRef.current.contains(event.target as Node)) {
        if (ref.current?.contains(event.target as Node))
          return;
        else
          closeMenu();
      }
    }

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);


  useEffect(() => {
    socket.on('inviteFriend', (data) => {
      const notification = {
        id: data.id,
        senderId: data.senderId,
        avatar: data.avatar,
        content: data.content,
        type: data.type,
        fullname: data.fullname
      }
      setNewNotifications([...notifications, notification])
      setCount(count + 1)
    })
    socket.on('acceptFriend', (data) => {
      const notification = {
        id: data.id,
        avatar: data.avatar,
        content: data.content,
        type: data.type,
        senderId: data.senderId
      }
      setNewNotifications([...notifications, notification])
      setCount(count + 1)
    })
    socket.on('challengeFriend', (data) => {
      const notification = {
        id: data.id,
        senderId: data.senderId,
        avatar: data.avatar,
        content: data.content,
        type: data.type
      }
      setNewNotifications([...notifications, notification])
      setCount(count + 1)
    })
    socket.on('GlobalMessage', (data) => {
      const notification = {
        avatar: data.avatar,
        content: data.content,
        senderId: data.senderId,
        type: data.type,
        conversationId: data.conversationId
      }
      setNewNotifications([...notifications, notification])
      setCount(count + 1)
    })
  }, [notifications, count, setNewNotifications])

  return (
    <div title="Notification" className="relative inline-block text-left">
      <div onClick={toggleMenu} ref={ref} className="cursor-pointer relative hover:bg-opacity-[20%] bg-opacity-[10%] bg-white w-10 h-10 flex justify-center items-center mx-2 rounded-full">
        <Image unoptimized  src="/notification.svg" alt="Picture of the author" priority={true} quality={100} width={100} height={100} className="w-[40%] " />
        {count > 0 && <span className="absolute right-2 bottom-2 bg-red-600 px-1 py-1/2 text-xs rounded-full">{count}</span>}
      </div>
      {isOpen && (
        <div ref={listRef} className="absolute right-0 mt-2 w-72 h-[350px] overflow-auto rounded-md ">
          <div className="absolute z-[-1] w-full h-full bg-[#2a222e] blur-[40px]"></div>
          <div className="py-2 h-full">
            <div className="w-full border-b border-b-white border-opacity-25 flex">
              <span className=" font-bold text-white text-opacity-75 py-2 px-4">
                Notifications
              </span>
            </div>
            {notifications.length === 0 ?
              (
                <div className="px-4 text-sm relative top-[8rem] text-white text-opacity-50 text-center">
                  No new notifications
                </div>
              )
              :
              (
                notifications.map((notification, index) => (
                  <div key={index} className="hover:bg-white hover:bg-opacity-10 py-2 flex flex-col cursor-pointer">
                    <Link
                      key={index}
                      href={notification.type == 'message' ? `/chat/${notification.conversationId}` : `/user/${notification.senderId}`}
                      onClick={() => closeMenu()}
                      className="flex px-4  text-sm text-white text-opacity-60 items-center  justify-between gap-2"
                    >
                      <Avtr src={default_img(notification?.avatar, notification.fullname)} />
                      <p className="line-clamp-3">{notification.content}</p>
                    </Link>
                    <p className="antialiased text-end mx-2 font-sans font-light gap-1 text-xs text-white">
                      {/* {notification.time} ay9adha Omar hh  */}
                      {/* 2m ago */}
                    </p>
                  </div>

                ))
              )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationMenu;