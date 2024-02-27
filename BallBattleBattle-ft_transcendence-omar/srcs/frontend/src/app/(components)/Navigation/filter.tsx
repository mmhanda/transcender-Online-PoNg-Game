'use client'
import Error from "@/app/tools/error";
import { Localhost } from "@/app/tools/global";
import { default_img } from "@/app/tools/global";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";

interface USERS {
    id: number;
    name: string;
    email: string;
    avatar: string;
    fullname: string;
}

const Filter = () => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [searchResults, setSearchResults] = useState<USERS[]>([]);
    const [UsersAll, setUsersAll] = useState<USERS[]>([] as USERS[]);

    async function allUsers(username: string) {
        axios.defaults.withCredentials = true;
        try {
            const response = await axios.get(`${Localhost()}/users/user/${username}`);
            return response.data.data;
        } catch (error) {
        }
    }

    const { data, isLoading, error, status, refetch } = useQuery({
        queryKey: ['userAll'],
        queryFn: async () => await allUsers(searchTerm)
    });

    useEffect(() => {
        if (searchTerm == '') {
            setUsersAll([]);
            setSearchResults([]);
            return;
        }
        refetch();
    }, [searchTerm, refetch])

    useEffect(() => {
        if (data && data.length > 0 && searchTerm != '')
            setUsersAll(data);
    }, [data, searchTerm])

    const handleSearch = (e: any) => {
        setSearchTerm(e.target.value);
        if (searchTerm == '') {
            setSearchResults([]);
            setUsersAll([]);
            return;
        }
        if (searchTerm != '' && UsersAll.length != 0 && data) {
            if (searchTerm == '') {
                setSearchResults([]);
                setUsersAll([]);
                return;
            }

            else if (searchTerm != '' && UsersAll.length > 0 && data) {
                const filteredResults:any = UsersAll.filter(item =>
                    item.fullname.toLowerCase().includes(searchTerm.toLowerCase())
                );
                setSearchResults(filteredResults);
                return;
            }
        }
    };
    return (
        <div className="relative items-center flex">
            <Image unoptimized 
                src="/search.svg?v1"
                alt="Picture of the author"
                priority={true}
                quality={100}
                width={100}
                height={100}
                className='cursor-pointer opacity-90 w-[1rem] h-[1rem] absolute left-[12px]' />
            <Image unoptimized  src="/cros.svg"
                alt="Picture of the author"
                priority={true}
                quality={75}
                width={150}
                height={150}
                onClick={() => {
                    setSearchTerm('');
                    setUsersAll([]);
                    setSearchResults([]);
                }}
                className={searchTerm != '' ? 'cursor-pointer w-[1.5rem] h-[1.5rem] absolute right-[10px] hover:bg-white hover:bg-opacity-[.15] rounded-full p-1 ' : 'hidden'} />
            <input type="text" placeholder="FIND NEW FRIENDS"
                onChange={handleSearch}
                value={searchTerm}
                className=" hidden sm:flex focus:border-[#a970e3] border-transparent border-2 placeholder-[#ffffff] placeholder-opacity-[.9] min-w-[180px] rounded-full w-full py-[.6rem] bg-white bg-opacity-[.1] text-[10px] pl-[32px]" />
            <div className={(searchTerm.length != 0 && UsersAll.length != 0) ? 'absolute w-[calc(100%+40px)] self-center left-[-20px] top-[40px] flex flex-col  ' : 'hidden'}>
                {UsersAll.map((item, index) => (
                    <div key={index}
                        className="bg-[#333249] hover:bg-[#5f4da0] px-2 py-2"
                        onClick={() => {
                            setSearchTerm('');
                            setUsersAll([]);
                            setSearchResults([]);
                        }}>
                        <Link className="flex w-full items-center gap-2" href={`/user/${item.id}`}>
                            <Image unoptimized  src={default_img(item?.avatar, item.fullname)} alt="Picture of the author" width={50} height={50} className="w-8 h-8 rounded-full" />
                            <span className="line-clamp-1 text-[13px] w-full">{item?.fullname}</span>
                        </Link>
                    </div>
                ))}

            </div>
        </div>
    )
}

export default Filter;