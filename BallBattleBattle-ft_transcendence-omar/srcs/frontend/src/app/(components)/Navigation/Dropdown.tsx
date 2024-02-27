'use client'

import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import React, { useRef, useEffect, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { Localhost } from '@/app/tools/global';
import { socket } from '@/app/tools/socket/socket';

interface me {
    id: number;
    fullname: string;
    email: string;
    avatar: string;
    status: string;
    map_color?: number;
}

interface Props {
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isOpen: boolean;
    forwardedRef: React.RefObject<HTMLDivElement>;
    setLogin: any;
    login: boolean;
    // user: me;
    setLoading: any;
    show: () => void;
}

const Dropdown = ({ setLoading, setIsOpen, isOpen, forwardedRef, setLogin, login, show }: Props) => {
    const client = useQueryClient();
    const ref = useRef<HTMLDivElement>(null);
    const [User, setUser] = useState({} as me);
    const [load, setLoad] = useState(false);

    async function me() {
        axios.defaults.withCredentials = true;
        const response = await axios.get(`${Localhost()}/users/me`)
            .then(res => {
                return res.data.data
            }).catch(error => {
                setLoad(true);
                setTimeout(() => {
                    if (login != false) {
                        setLogin(false);
                        document.body.classList.remove('overflow-hidden');
                    }
                }, 1000);
                return null
            });
        return response;
    }
    const { data, isLoading, error, status } = useQuery({
        queryKey: ['DropdownData'],
        queryFn: async () => await me()
    });

    useEffect(() => {
        if (login == true && User != data && data && 'id' in data)
            setUser(data);
    }, [data, login, User])

    const signOut = async () => {
        axios.get(`${Localhost()}/auth/logout`, {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': `${Localhost()}`,
                'Access-Control-Allow-Credentials': 'true',
            },
        }).then(async () => { await me(); client.invalidateQueries('leaderBoard'); client.invalidateQueries('main-login') }).catch(error => {/*  no behavior  */ });
        socket.disconnect();
    }
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                if (forwardedRef.current?.contains(event.target as Node))
                    return;
                else
                    setIsOpen(false)
            }
        }
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [forwardedRef, setIsOpen]);
    if (load && setLoading(true)) return;
    return (
        <div
            ref={ref}
            className={`z-50  ${isOpen ? '' : 'hidden'} absolute right-[15px] top-[64px] list-none divide-y divide-[#ffffff2e] rounded-lg text-white bg-[#2b2040]  text-base `}
            id="user-dropdown"
        >
            <div className="px-4 py-3">
                <Link
                    onClick={() => { setIsOpen(false); }}
                    href='/profile'
                    className="w-full h-full"
                >
                    <span className="block text-sm text-white">{User?.fullname}</span>
                    <span className="block truncate text-[12px] text-white text-opacity-40">{User?.email}</span>
                </Link>
            </div>
            <div className=" bg-[#3e2b62] " aria-labelledby="user-menu-button">
                <div onClick={() => { setIsOpen(false); show(); }} className='flex items-center py-2 px-3 gap-2 hover:bg-[#2e2149] text-white'>
                    <Image unoptimized  src='/setting.svg' alt='profile' width={16} height={16} />
                    <span className="block text-sm">Settings</span>
                </div>
                <div
                id='force-logout'
                    onClick={() => { signOut(); }}
                    className='flex items-center py-2 px-3 gap-2 hover:bg-[#2e2149] text-white'>
                    <Image unoptimized  src='/logout.svg' alt='logout' width={16} height={16} />
                    <span className="block text-sm">
                        Logout
                    </span>
                    {
                        load ? <div className='w-4 h-4 animate-spin text-white'>
                            <Image unoptimized  src='/load.svg' alt='loading' width={16} height={16} />
                        </div> : ''
                    }
                </div>
            </div>
        </div>
    );
};

export default Dropdown;
