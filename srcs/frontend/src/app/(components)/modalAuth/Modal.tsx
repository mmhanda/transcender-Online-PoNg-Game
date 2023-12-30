import React, { useState } from 'react';
import "./modal.css"
import SignUp from './signup';
import Login from './Login';


interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  setLogin: any;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, setLogin }) => {
  const [showLogin, setShowLogin] = useState(true);
  const login = () => {
    setShowLogin(true);
  };
  const signup = () => {
    setShowLogin(false);
  };
  if (!isOpen) return null;
  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };
  return (
    <div className='w-full'>
      <div onClick={onClose} className=" fixed z-10 inset-0 flex items-center justify-center w-full bg-[#130C26] bg-opacity-60 blr ">
        <div onClick={handleOverlayClick} className=' absolute w-[calc(100%-40px)] sm:w-[26rem] bg-modal rounded-3xl flex flex-col items-center overflow-x-hidden overflow-y-hidden'> 
          <div className='w-full font-bold text-white flex col-auto overflow-hidden h-[70px] justify-center items-center'>

            <div onClick={login} className={`flex transform rotate-[7deg] cursor-pointer text-center ${showLogin ? 'active-tab' : ''} oauth-tabs w-1/2  rounded-tl-3xl select-none`}>
              <div className='transform rotate-[-7deg] flex justify-center items-center'>
                Login
              </div>
            </div>
            <div onClick={signup} className={`flex transform rotate-[7deg] cursor-pointer text-center ${!showLogin ? 'active-tab' : ''} oauth-tabs w-1/2 p-5 rounded-tr-3xl select-none`}>
              <div className='transform rotate-[-7deg] flex justify-center items-center'>
                REGISTER
              </div>
            </div>
          </div>
          <div className='w-full flex flex-row'>
            <div className={ (!showLogin ? `absolute` : ``) + ` w-full transition-transform duration-300 transform ${showLogin ? 'translate-x-0' : '-translate-x-full'}`}>
              <Login setLogin={setLogin} showLogin={!showLogin} hideModal={onClose}/>
            </div>
            <div className={ (showLogin ? `absolute` : ``) + ` w-full transition-transform duration-300 transform ${showLogin ? 'translate-x-full' : 'translate-x-0'}`}>
              <SignUp setLogin={setLogin} showLogin={showLogin} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
