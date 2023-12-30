import React, { useRef, useState } from 'react';
import Input from '../../tools/input';
import axios from "axios";
import Image from 'next/image';
import Socialiate from './Socialiate';
import { Localhost } from '@/app/tools/global';

const SignUp = ({ setLogin, showLogin }: any) => {
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confpassword, setconfPassword] = useState('');
    const [error, setError] = useState('');
    const [load, setLoad] = useState(false);
    const signup = async () => {
        axios.defaults.withCredentials = true;
        await axios.post(`${Localhost()}/users`, { email: email, password: password, confirmPassword: confpassword, fullname: userName },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': `${Localhost()}`,
                    'Access-Control-Allow-Credentials': 'true',
                },
            }).then((res) => {
                if (res.status != 201)
                    return setError(res.data.message)
                if (res.data.status == 300)
                    return setError(res.data.message)
                setLoad(true);
                setTimeout(() => {
                    setLogin(true);
                    document.body.classList.remove('overflow-hidden');
                }, 1000);
            }).catch((err) => {
                Array.isArray(err.response.data.message) ? err.response.data.message.length && setError(err.response.data.message[0]) : setError(err.response.data.message)
            });
    }

    
    return (
        
        <div className='my-5 px-10'>
            <form className='flex flex-col w-full items-center '>
                <div className='w-[85%] lg:w-1/2 '>
                    <h1 className='w-full text-center text-xl py-1'>TIME TO JOIN US</h1>
                </div>

                <div className='w-[100%] m-3'>
                    <Input defaultValue={userName} disabled={showLogin} tabIndex={6} type="text" id="NAME_signup" placeholder="NAME" seter={setUserName} />
                </div>
                <div className='w-[100%] m-3'>
                    <Input defaultValue={email} disabled={showLogin} tabIndex={7} type="text" id="EMAIL_signup" placeholder="EMAIL" seter={setEmail} />
                </div>
                <div className='w-[100%] m-3 flex gap-2'>
                    <Input defaultValue={password} disabled={showLogin} tabIndex={8} type="password" id="PASSWORD_signup" placeholder="PASSWORD" seter={setPassword} />
                    <Input defaultValue={confpassword} disabled={showLogin} tabIndex={9} type="password" id="PASSWORD_signup2" placeholder="CONF PASSWORD" seter={setconfPassword} />
                </div>
                {error && <div className=' text-red-500 h-6'>{error}</div>}
            </form>
            <button
                disabled={showLogin}
                tabIndex={10}
                onClick={() => {
                    if (!email || !password)
                        setError('email or password is empty');
                    // else if (password !== confpassword)
                    //     setError('password and conf password are not the same');
                    else
                        signup();
                }}
                className=' cursor-pointer my-3  flex items-center  w-[100%] justify-center bg-white py-3'>
                <div className='text-black font-bold text-sm px-2 py-1 flex gap-2'>
                    REGISTER
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
            <Socialiate disabled={showLogin} tabIndex={11}/>
        </div>
    );
};

export default SignUp;