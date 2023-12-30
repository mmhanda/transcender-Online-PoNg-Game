'use client';
import Link from 'next/link';
import './Navigation.css'

import { FC, useState } from 'react';
import axios from 'axios';
import { Localhost } from '@/app/tools/global';
import { Loading } from '../Loading/Loading';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

interface NavigationProps {
  show: () => void;
  seter: any;
}


const Navigation: FC<NavigationProps> = ({ show, seter }) => {
  const [loading, setLoading] = useState(false);


  const pathname = usePathname();



  if (loading) return <Loading show={loading} />;
  return (
    <div className="hidden md:flex fixed flex-col w-[75px] min-w-[75px] max-w-[75px] dashboard bg-nav justify-between items-center">
      <div className="flex flex-auto flex-col w-full items-center justify-center">
        <Link
          href='/'
          className={`relative nav-tabs w-12 h-12 flex justify-center items-center my-3 rounded-full  ${pathname === '/' ? 'nav-active' : ''}`}>
          <Image unoptimized  width={100} height={100} src="/Home.svg" alt="" className='w-[1.4rem]' />
        </Link>
        <Link
          href='/chat'
          className={`relative nav-tabs w-12 h-12 flex justify-center items-center my-3 rounded-full ${pathname === '/chat' ? 'nav-active' : ''}`}>
          <Image unoptimized  width={100} height={100} src="/chat.svg" alt="" className='w-[1.2rem]' />
        </Link>
        <Link href="/game" className={`relative nav-tabs w-12 h-12 flex justify-center items-center my-3 rounded-full ${pathname === '/game' ? 'nav-active' : ''}`}>
          <Image unoptimized  width={100} height={100} src="/Game.svg" alt="" className='w-[1.6rem]' />
        </Link>
        <Link href="/profile" className={`relative nav-tabs w-12 h-12 flex justify-center items-center my-3 rounded-full ${pathname === '/profile' ? 'nav-active' : ''}`}>
          <Image unoptimized  width={100} height={100} src="/Profile.svg" alt="" className='w-[1.1rem]' />
        </Link>
      </div>
      <div className='flex flex-col w-full items-center'>
        <Link
          onClick={() => {
            axios.get(`${Localhost()}/auth/logout`, { withCredentials: true })
              .then(res => {
                seter(false);
                setLoading(true);
                setTimeout(() => {
                  setLoading(false);
                }, 1000);
              })
              .catch(err => { })
          }}
          href='/' className="relative nav-tabs w-12 h-12 flex justify-center items-center my-2 rounded-full">
          <Image unoptimized  width={100} height={100} src="/logout.svg" alt="logout icobn" className='w-[1.3rem]' />
        </Link>
        <Link onClick={show} href='#' className="relative nav-tabs w-12 h-12 flex justify-center items-center my-2 rounded-full">
          <Image unoptimized  width={100} height={100} src="/setting.svg" alt="setting icon" className='w-[1.3rem]' />
        </Link>
      </div>
    </div>
  );
}

export default Navigation;