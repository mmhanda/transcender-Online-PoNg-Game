import { FC, useEffect, useState } from 'react';
import Link from "next/link";
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import axios from 'axios';
import { Localhost } from '@/app/tools/global';
import { useQueryClient } from 'react-query';

interface NavigationProps {
    show: () => void;
}

const SideBar: FC<NavigationProps> = ({ show }) => {
    const [open, setOpen] = useState(false);
    const QueryClient = useQueryClient();
    const router = useRouter();
    const closeMenu = () => {
        setOpen(false);
    };

    const pathname = usePathname();

    useEffect(() => {
        closeMenu();
    }, [pathname]);

    return (
        <div>
            <div className="flex">
                <button
                    className="cursor-pointer text-white hover:opacity-20 focus:outline-none ml-1"
                    onClick={() => setOpen(!open)}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="w-6 h-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4 6h16M4 12h16M4 18h16"
                        />
                    </svg>
                </button>
            </div>
            <div
                className={`${open ? "flex left-[-75px] h-screen" : "hidden"} md:flex fixed flex-col w-[75px] min-w-[75px] max-w-[75px] dashboard bg-nav justify-between items-center top-[70px] left-0 bottom-0 ease-out transition-all duration-300  `}
            >
                <div className="flex flex-auto flex-col w-full items-center justify-center">
                    <Link
                        href='/'
                        className={`relative nav-tabs w-12 h-12 flex justify-center items-center my-3 rounded-full ${pathname == "/" && 'nav-active'}`}>
                        <Image unoptimized  width={100} height={100} src="/Home.svg" alt="" className='w-[1.4rem]' />
                    </Link>
                    <Link
                        href='/chat'
                        className={`relative nav-tabs w-12 h-12 flex justify-center items-center my-3 rounded-full ${pathname.startsWith('/chat') ? 'nav-active' : ''}`}>
                        <Image unoptimized  width={100} height={100} src="/chat.svg" alt="" className='w-[1.2rem]' />
                    </Link>
                    <Link
                        href="/game"
                        className={`relative nav-tabs w-12 h-12 flex justify-center items-center my-3 rounded-full ${pathname.startsWith('/game')  ? 'nav-active' : ''}`}>
                        <Image unoptimized  width={100} height={100} src="/Game.svg" alt="" className='w-[1.6rem]' />
                    </Link>
                    <Link
                        href="/profile"
                        className={`relative nav-tabs w-12 h-12 flex justify-center items-center my-3 rounded-full ${(pathname == '/profile' || pathname.startsWith('/user')) ? 'nav-active' : ''}`}>
                        <Image unoptimized  width={100} height={100} src="/Profile.svg" alt="" className='w-[1.1rem]' />
                    </Link>
                </div>
                <div className='flex flex-col w-full items-center'>
                    <Link href="/"
                        onClick={() => {
                            closeMenu();
                            axios.get(`${Localhost()}/auth/logout`, { withCredentials: true })
                                .then(res => {
                                    QueryClient.invalidateQueries('main-login');
                                })

                        }}
                        className={`relative nav-tabs w-12 h-12 flex justify-center items-center my-2 rounded-full ${pathname == '/exit' ? 'nav-active' : ''}`}>
                        <Image unoptimized  width={100} height={100} src="/logout.svg" alt="logout icobn" className='w-[1.3rem]' />
                    </Link>
                    <div
                        onClick={() => {
                            closeMenu();
                            show();
                        }
                        }
                        className={`relative nav-tabs w-12 h-12 flex justify-center items-center my-2 rounded-full`}>
                        <Image unoptimized  width={100} height={100} src="/setting.svg" alt="setting icon" className='w-[1.3rem]' />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SideBar;