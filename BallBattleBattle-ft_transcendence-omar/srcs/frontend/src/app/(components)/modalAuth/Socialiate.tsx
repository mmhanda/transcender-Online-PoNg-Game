import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Localhost } from '@/app/tools/global';




const Socialiate = ({tabIndex, disabled}:any) => {
  return (
    <div className='  flex flex-col justify-end items-center my-2 w-full'>
        <div className='w-1/2 mx-3 text-center'>
            <span className=' text-slate-50 text-xl'>OR</span>
        </div>
        <div className='flex m-auto justify-center rounded-full items-center gap-4 mt-3'>
            <button
                disabled={disabled}
                tabIndex={tabIndex}
                onClick={() => window.location.href = `${Localhost()}/auth/google`}
                className='bg-white w-12 h-12 rounded-full flex items-center justify-center'
                >
                <div className='w-[1.7rem] h-[1.7rem]'>
                    <Image unoptimized 
                    width={80}
                    height={80}
                    alt='google'
                    src='/Google.svg'
                    />
                </div>
            </button>

            <button
                disabled={disabled}
                onClick={() => window.location.href = `${Localhost()}/auth/intra`}
                tabIndex={tabIndex + 1}
                className='bg-white w-12 h-12 rounded-full flex items-center justify-center'>
                <div className=' w-8 h-8 mr-[1px] mt-[2.5px]'>
                    <Image unoptimized 
                        width={80}
                        height={80}
                        alt='42'
                        src='/42.svg' />
                </div>
            </button>
        </div>
    </div>
  );
};

export default Socialiate;
