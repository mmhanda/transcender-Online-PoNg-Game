

import React, { useState } from 'react';
import "./modal.css"
import Input from '../../tools/input';
import axios from 'axios';
import { Localhost } from '@/app/tools/global';
import { useQueryClient } from 'react-query';
import Image from 'next/image';


interface ModalProps {
  isOpen: boolean;
  setIs2FaModalOpen: any;
}

const Modal2Fa = ({ isOpen, setIs2FaModalOpen }: ModalProps) => {
  const [verify, setVerify] = useState<string | undefined>('');
  const [err, setErr] = useState<string | undefined>(undefined);
  const [load, setLoad] = useState(false);
  const client = useQueryClient();

  const handleSubmitButtonClick = () => {
    setLoad(true);
    axios.post(`${Localhost()}/auth/verify-2fa`, { 
        "token": verify,
    }).then(res => {
        if(res.data?.success == true)
        {
          setIs2FaModalOpen(false)
          client.invalidateQueries('main-login');
        }
        else
            setErr("Verification code is not valid");
    }).catch(err => {
      
    }).finally(() => {
        setVerify("");
        setLoad(false);
    })
  }
  if (!isOpen) return null;
  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };
  return (
    <div className='w-full'>
      <div className=" fixed z-10 inset-0 flex items-center justify-center w-full bg-[#130C26] bg-opacity-60 blr ">
        <div onClick={handleOverlayClick} className=' absolute w-[calc(100%-40px)] sm:w-[26rem] bg-modal rounded-3xl flex flex-col items-center overflow-x-hidden overflow-y-hidden'>
          <div className='w-full px-3 text-white flex col-auto overflow-hidden h-[56px] justify-between items-center bg-[#ffffff] bg-opacity-[.15]'>
            <div className='font-bold text-[13px]'>SUBMIT 2FA CODE</div>
          </div>
          <div className='w-full flex flex-col items-center justify-center gap-2 px-8 py-4 '>
            <Input error={err != undefined} className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" type="number" defaultValue={verify} seter={setVerify} tabIndex={1} id="2fa" placeholder="VERIFICATION CODE" />

            <div
                onClick={handleSubmitButtonClick}
                className='text-black cursor-pointer font-bold text-sm flex gap-2 bg-white w-full items-center justify-center py-3 uppercase'>
                Verify
                {
                    load &&
                    <div className=' animate-spin duration-75'>
                        <Image unoptimized  width={20} height={20} alt='arrow' src='/load.svg' />
                    </div>

                }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal2Fa;