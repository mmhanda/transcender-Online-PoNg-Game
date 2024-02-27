'use client'
import { Link } from 'react-scroll';
import React, { useState } from 'react';
import Modal from '../../modalAuth/Modal';

interface LoginBtnProps {
  setIsLogged: React.Dispatch<React.SetStateAction<boolean>>; //for setLogged in layout.tsx
}

const LoginBtn = ({ setLogin }: any) => {
  const [isModalOpen, setIsModalOpen] = useState(false); //should be false for default

  const OverFlow = () => {
    if (isModalOpen) document.body.classList.remove('overflow-hidden');
    else
      document.body.classList.add('overflow-hidden');
  };
  const openModal = () => {
    setIsModalOpen(true);
    OverFlow();
  };
  const closeModal = () => {
    setIsModalOpen(false);
    OverFlow();
  };

  return (
    <div className="text-white text-opacity-80 hover:text-opacity-100 items-center ml-auto self-end">
      <div
      id='loginFirstBtn'
        onClick={openModal} className="  cursor-pointer border-r-[.7px] border-white rounded-3xl py-[0.3em] px-7 gradientBackground">
        Login
      </div>
      <Modal isOpen={isModalOpen} onClose={closeModal} setLogin={setLogin}/>
    </div>
  )
}

export default LoginBtn;