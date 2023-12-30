
'use client';
import Input from '@/app/tools/input';
import axios from 'axios';
import Image from 'next/image';
import { FC, useEffect, useRef, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { Localhost, default_img } from '@/app/tools/global';
import { User } from '@/app/tools/fetch/api';
interface UpdateProps {
    close: () => void;
    data?: User;
}

interface MapsProps {
    className: string;
    check?: boolean;
    onClick?: () => void;
}

const Maps = ({ className, check = false, onClick }: MapsProps) => {
    return (
        <div className='h-full w-full px-4 relative flex justify-center items-center'>
            <div className={' after:rounded-b-[5px] after:absolute after:border-[2px] after:border-t-[0px] after:bottom-0 after:border-white after:w-full after:h-[calc(50%-8px)] ' + ' before:absolute before:border-[2px] before:border-b-[0px] before:top-0 before:border-white before:w-full before:h-[calc(50%-8px)] before:rounded-t-[5px] ' + ` overflow-hidden relative w-full h-full flex flex-col items-center justify-center gap-1 cursor-pointer backdrop-blur-md hover:via-transparent from-0% bg-gradient-to-br via-[#ff000000] ` + className} onClick={onClick}>
                <div className='h-[2px] w-full bg-white bg-opacity-50'></div>
            </div>
            <div className={`absolute rounded-full "w-2 h-2 bg-[#A970E3] flex justify-center items-center pointer-events-none`} />
            {
                check &&
                <div className={`absolute rounded-full w-5 h-5 bg-[#4499c7] flex justify-center items-center pointer-events-none right-6 top-2`}>
                    <Image unoptimized src={"/check.svg"} width={20} height={20} alt="check" className='w-3 h-3' />
                </div>
            }
        </div>
    );
}

const Update: FC<UpdateProps> = ({ close, data }) => {
    const [map, setMap] = useState<string>('0');
    const client = useQueryClient();
    const [load, setLoad] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [userImage, setUserImage] = useState<string>(default_img(null, null));
    const [fullName, setFullName] = useState('');
    const [oldpassword, setOldpassword] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [user, setUser] = useState<User | null>();
    const [errormsg, setErrorMsg] = useState<string>();

    const handleFileChange = () => {
        const selectedFile = fileInputRef.current?.files?.[0];
        if (selectedFile) {
            setUserImage(URL.createObjectURL(selectedFile));
        }
    };

    const handleFileUpload = async () => {
        const formData = new FormData();
        if (fullName)
            formData.append("fullname", fullName);
        if (oldpassword)
            formData.append("oldPassword", oldpassword);
        if (password && confirm && password === confirm) {
            formData.append("password", password);
            formData.append("confirmPassword", confirm);
        }
        formData.append("table_style", map);
        if (fileInputRef.current?.files?.length) {
            const file = fileInputRef.current.files[0];
            formData.append('file', file);
        }
        try {
            await axios.patch(`${Localhost()}/users`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "x-rapidapi-host": "file-upload8.p.rapidapi.com",
                    "x-rapidapi-key": "your-rapidapi-key-here",
                },
            }).then((res) => {
                if (res.data.status != 200)
                    return setErrorMsg(res.data.message)
                if (res.data.status == 300)
                    return setErrorMsg(res.data.message)
                client.invalidateQueries('main-login');
                client.invalidateQueries('DropdownData');
                close();
            }
            )
        } catch (error) {

        }
        
    };

    const handleSubmitButtonClick = () => {
        if (user?.password) {
            if (oldpassword && (confirm !== password))
                return setErrorMsg('Password and confirm password does not match');

        }
        else if (!user?.password && (confirm !== password))
            return setErrorMsg('Password and confirm password does not match');
        setLoad(true);
        setTimeout(() => {
            setLoad(false);
        }, 1000);
        handleFileUpload();
    };

    useEffect(() => {
        if (data && 'id' in data) {
            setUserImage(default_img(data.avatar, data.fullname));
            setFullName(data.fullname);
            setUser(data);
            setMap(data?.table_style || '0')
        }
    }, [data])

    useEffect(() => {
        setErrorMsg('');
    }, [oldpassword, password, confirm, fullName])

    return (
        <>
            <div className='cursor-pointer flex justify-center items-center gap-3 relative w-28 h-28  group p-[0.25rem] border-[2px] border-[#ffffff] border-opacity-[.3] rounded-full'>
                <Image unoptimized
                    src={userImage}
                    width={100}
                    height={100}
                    alt='avatar'
                    className='rounded-full w-full h-full'
                    onClick={() => {
                        if (fileInputRef.current) {
                            fileInputRef.current.click();
                        }
                    }}
                />
                <input onChange={() => {
                    handleFileChange();
                }} ref={fileInputRef} className='w-5 h-5 rounded-full opacity-20 z-50 hidden' placeholder='+' type="file" accept="image/*" />

                <div
                    onClick={() => {
                        if (fileInputRef.current) {
                            fileInputRef.current.click();
                        }
                    }}
                    className=' absolute top-0 w-full h-full flex-col justify-center items-center rounded-full bg-[#241852] bg-opacity-50 hidden group-hover:flex'
                >
                    <Image unoptimized
                        src='/img.svg'
                        width={20}
                        height={20}
                        alt='img icon for change avatar'
                        className='w-4 h-4'
                    />
                    <span className='font-bold text-[12px] mt-2'>CHANGE</span>
                </div>
            </div>
            <div className='flex flex-col gap-2 w-full h-max my-1'>
                <Input defaultValue={fullName} tabIndex={1} type="text" id="fullname" placeholder="FULL NAME" seter={setFullName} />
                {
                    user?.password &&
                    <Input defaultValue={oldpassword} tabIndex={2} type="password" id="old" placeholder="OLD PASSWORD" seter={setOldpassword} />
                }
                <div className='flex gap-1'>
                    <Input defaultValue={password} tabIndex={3} type="password" id="password" placeholder="PASSWORD" seter={setPassword} />
                    <Input defaultValue={confirm} tabIndex={4} type="password" id="confirm" placeholder="CONFIRM PASSWORD" seter={setConfirm} />
                </div>
            </div>

            <div className='w-full relative text-center font-semibold mt-0 mb-1 text-[12px] text-white opacity-50 after:absolute after:top-[9px] after:right-2 after:border-white after:border-opacity-40 before:border-opacity-40 after:w-[80px] after:border-b-[1px] before:absolute before:top-[9px] before:left-2 before:border-white before:w-[80px] before:border-b-[1px] '>
                CHANGE MAP
            </div>
            <div className='grid grid-cols-3 w-full relative h-[5.5rem]'>

                <Maps onClick={() => setMap('0')} check={(map == '0')} className="hover:from-[#ffffffa1] hover:to-[#ffffffa1] from-[#ffffff74]  to-[#ffffff74]" />
                <Maps onClick={() => setMap('1')} check={(map == '1')} className="hover:from-[#fcffa7b6] hover:to-[#fcffa7b6] from-[#fcffa796]  to-[#fcffa796]" />
                <Maps onClick={() => setMap('2')} check={(map == '2')} className="hover:from-[#ff5a5abb] hover:to-[#ff5a5abb] from-[#ff5a5a98]  to-[#ff5a5a98]" />
            </div>

            {errormsg &&
                <div className='w-full text-red-600 flex items-center justify-center h-1 my-1'>
                    {errormsg}
                </div>
            }

            <div
                onClick={handleSubmitButtonClick}
                className='text-black cursor-pointer font-bold text-sm flex bg-white w-full items-center justify-center py-3'>
                UPDATE
                {
                    load &&
                    <div className=' animate-spin duration-75'>
                        <Image unoptimized width={20} height={20} alt='arrow' src='/load.svg' />
                    </div>

                }
            </div>
        </>
    )
}
export default Update;