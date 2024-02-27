'use client';
import Link from 'next/link';
import './Navigation.css'

import { FC, useEffect, useState } from 'react';
import Settings from '../Settings/setting';
import axios from 'axios';
import { useQueryClient } from 'react-query';
import { Localhost } from '@/app/tools/global';
import { Loading } from '../Loading/Loading';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
interface NavigationProps {
    show: () => void;
    seter?: any;
}


const Navigation: FC<NavigationProps> = ({ show, seter }) => {
    const [loading, setLoading] = useState(false);
    const QueryClient = useQueryClient();
    const router = useRouter();

    const pathname = usePathname();

    if (loading) return <Loading show={loading} />;
    return (
        <div className="hidden md:flex fixed flex-col w-[75px] min-w-[75px] max-w-[75px] dashboard bg-nav justify-between items-center">
            <div className="flex flex-auto flex-col w-full items-center justify-center">
                <Link
                    href='/'
                    className={`relative nav-tabs w-12 h-12 flex justify-center items-center my-3 rounded-full  ${pathname == "/" && 'nav-active'}`}>
                    <Image unoptimized  width={100} height={100} src="/Home.svg" alt="" className='w-[1.4rem]' />
                </Link>
                <Link
                    href='/chat'
                    className={`relative nav-tabs w-12 h-12 flex justify-center items-center my-3 rounded-full ${pathname.startsWith('/chat') ? 'nav-active' : ''}`}>
                    <Image unoptimized  width={100} height={100} src="/chat.svg" alt="" className='w-[1.2rem]' />
                </Link>
                <Link href="/game" className={`relative nav-tabs w-12 h-12 flex justify-center items-center my-3 rounded-full ${pathname.startsWith('/game') ? 'nav-active' : ''}`}>
                    <Image unoptimized  width={100} height={100} src="/Game.svg" alt="" className='w-[1.6rem]' />
                </Link>
                <Link href="/profile" className={`relative nav-tabs w-12 h-12 flex justify-center items-center my-3 rounded-full ${(pathname == '/profile' || pathname.startsWith('/user')) ? 'nav-active' : ''}`}>
                    <Image unoptimized  width={100} height={100} src="/Profile.svg" alt="" className='w-[1.1rem]' />
                </Link>
            </div>
            <div className='flex flex-col w-full items-center'>
                <div
                    onClick={() => {
                        // axios.get(`${Localhost()}/auth/logout`, { withCredentials: true })
                        //     .then(res => {
                        //         QueryClient.invalidateQueries('main-login');
                        //         router.replace('/');
                        //     })
                        const logout = document.getElementById('force-logout');
                        logout?.click();

                    }}
                    className={`relative nav-tabs w-12 h-12 flex justify-center items-center my-2 rounded-full ${pathname == '/exit' ? 'nav-active' : ''}`}>
                    <Image unoptimized  width={100} height={100} src="/logout.svg" alt="logout icobn" className='w-[1.3rem]' />
                </div>
                <div
                    onClick={() => {
                        show();
                    }
                    }
                    className={`relative nav-tabs w-12 h-12 flex justify-center items-center my-2 rounded-full`}>
                    <Image unoptimized  width={100} height={100} src="/setting.svg" alt="setting icon" className='w-[1.3rem]' />
                </div>
            </div>
        </div>
    );
}

export default Navigation;