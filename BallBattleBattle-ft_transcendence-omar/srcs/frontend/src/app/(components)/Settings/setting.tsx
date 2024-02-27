'use client';
import Image from 'next/image';
import { FC, useEffect, useState } from 'react';

import { Localhost } from '@/app/tools/global';
import Update from './update';
import TwoFaAuth from './2Fa';
import axios from 'axios';
import { useQuery, useQueryClient } from 'react-query';

interface ModalProps {
    handlshow: () => void;
}

const Settings: FC<ModalProps> = ({ handlshow }) => {
    const client = useQueryClient();
    const [show, setShow] = useState(true);
    const [showLshowAuth, setShowAuth] = useState(true);

    const TwoFa = () => {
        setShowAuth(true);
    };
    const Setting = () => {
        setShowAuth(false);
    };
    const Disable2FA = () => {
        axios.post(`${Localhost()}/auth/disable-2fa`).then(res => {
            client.invalidateQueries('the-login');
        }).catch(err => {

        })
    }
    // if (!isOpen) return null;
    const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
    };
    const close = () => {
        setShow(false)
        axios.patch(`${Localhost()}/users`, {}, {})
        document.body.classList.remove('overflow-hidden');
    }

    const { data, isLoading, error, status } = useQuery({
        queryKey: ['the-login'],
        queryFn: async () => {
            axios.defaults.withCredentials = true;
            try {
                const response = await axios.get(`${Localhost()}/users/me`);
                return response.data.data;
            } catch (error) {

            }
        }
    });
    
    if (show == false) return null;
    return (

        <div className='w-full z-[999999999999999999999] select-none'>
            <div
                onClick={() => {
                    close();
                    handlshow();
                }}
                className=" fixed z-[999999999999999999999] inset-0 flex items-center justify-center w-full bg-opacity-60 bg-black">
                <div
                    onClick={handleOverlayClick}
                    className=' absolute w-[25rem] rounded-3xl flex flex-col items-center overflow-x-hidden overflow-y-hidden border-2 border-t-0 border-[#ffffff22] backdrop-blur-[10px] bg-[#932cc3] bg-opacity-[.15]'>
                    <div className='w-full px-3 text-white flex col-auto overflow-hidden h-[56px] justify-between items-center bg-[#ffffff] bg-opacity-[.15]'>
                        <div className='font-bold text-[13px]'>SETTINGS</div>
                        <div
                            onClick={() => {
                                close();
                                handlshow();
                            }}
                            className='w-9 h-9 flex justify-center items-center rounded-full cursor-pointer bg-[#ffffff0c] hover:bg-[#ffffff18]'
                        >
                            <Image unoptimized 
                                src='/cros.svg'
                                width={90}
                                height={90}
                                alt='close'
                                className='w-[40%]'
                            />
                        </div>
                    </div>
                    <div className={`w-full ${showLshowAuth ? "h-[34.5rem]" : "h-[29rem]"} transform duration-500 ease-in-out flex flex-row relative mb-3`}>
                        <div className={(!showLshowAuth ? `absolute w-full` : ``) + ` w-full transition-transform duration-300 transform ${showLshowAuth ? 'translate-x-0' : '-translate-x-full'}`}>
                            <div className='relative flex h-max flex-col items-center justify-center gap-3  px-2 pt-2 w-4/5 mx-auto mt-2 z-50 '>
                                <Update close={handlshow} data={data} />
                                
                                {
                                    data?.twoFactorEnabled ? 
                                        <div onClick={Disable2FA} className="before:content-['2FA'] before:absolute before:text-[3rem] before:opacity-10 flex justify-center items-center relative  cursor-pointer w-full text-white text-sm font-bold text-center bg-[#f919196b] hover:bg-[#f919198c] py-3">
                                            DISABLE 2FA
                                        </div>
                                    :   
                                        <div onClick={Setting} className="before:content-['2FA'] before:absolute before:text-[3rem] before:opacity-10 cursor-pointer w-full text-white text-sm font-bold text-center bg-[#ffffff19] hover:bg-[#ffffff2d] py-3">
                                            ENABLE 2FA
                                        </div>
                                }
                            </div>
                        </div>
                        <div className={(showLshowAuth ? `absolute h-full` : ``) + ` w-full transition-transform duration-300 transform ${showLshowAuth ? 'translate-x-full' : 'translate-x-0'}`}>
                            <TwoFaAuth Cancel={TwoFa} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
