import React, { useEffect, useRef, useState } from 'react';
import Input from '../../tools/input';
import Image from 'next/image';
import axios from 'axios';
import Socialiate from './Socialiate';
import { Localhost } from '../../tools/global';

const Login = ({ setLogin,  showLogin, hideModal }: any) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [load, setLoad] = useState(false);


    
    const Auth = async () => {

        axios.defaults.withCredentials = true;
        await axios.post(`${Localhost()}/auth/local/login`, { email: email, password: password },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': `${Localhost()}`,
                    'Access-Control-Allow-Credentials': 'true',
                },
            }).then((res) => {
                if (res.status == 230)
                {
                    setError(res.data.message);
                    return;
                }
                if (res?.data?.require2fa === true)
                {
                    document.body.classList.remove('overflow-hidden');
                    hideModal(false);
                    return;
                }
                setLoad(true);
                setTimeout(() => {
                    setLogin(true);
                    setLoad(false); //not sure
                    document.body.classList.remove('overflow-hidden');
                }, 1000);
            }
            ).catch(() => {
                
            });
    }
    
    return (
        <div className='px-10  my-5'>
            <form className='flex flex-col w-full items-center'>
                <div className='  w-[100%] my-1'>
                    <h1 className='w-full text-center text-xl py-1'>WELCOME BACK</h1>
                </div>
                <div className='  w-[100%] m-3'>
                    <Input defaultValue={email} disabled={showLogin} tabIndex={1} type="text" id="EMAIL" placeholder="EMAIL" seter={setEmail} />
                </div>
                <div className='  w-[100%] m-3'>
                    <Input defaultValue={password} disabled={showLogin} tabIndex={2} type="password" id="PASSWORD" placeholder="PASSWORD" seter={setPassword} />
                </div>
                {error && <div className=' text-red-500 h-6'>{error}</div>}
            </form>
            <button
                disabled={showLogin}
                tabIndex={3}
                onClick={() => {
                    if (!email || !password)
                        setError('email or password is empty');
                    else
                        Auth();
                }}
                className=' cursor-pointer my-3  flex items-center  w-[100%] justify-center bg-white py-3'>
                <div

                    className='text-black font-bold text-sm px-2 py-1 flex gap-2'>
                    <span>LOGIN</span>
                    {
                        load ?
                            <div className=' animate-spin duration-75'>
                                <Image unoptimized  width={20} height={20} alt='arrow' src='/load.svg' />
                            </div>
                            :
                            <div></div>
                    }
                </div>
            </button>
            <Socialiate tabIndex={4}/>
        </div>
    );
};

export default Login;
