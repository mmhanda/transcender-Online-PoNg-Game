'use client'
import Error from "@/app/tools/error";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import InputSearch from "./input";
import { Localhost, default_img } from "@/app/tools/global";

interface USERS {
    id: number;
    name: string;
    email: string;
    avatar: string;
    fullname: string;
}

const Search = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [UsersAll, setUsersAll] = useState([] as USERS[]);
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
            setSearchResults([]);
            setUsersAll(new Array() as USERS[]);
            return;
        }
        refetch();
    }, [searchTerm, refetch])

    useEffect(() => {
        if (data && data.length > 0 && searchTerm != '')
            setUsersAll(data);
    }, [data, searchTerm])

    return (
        <div className="relative items-center flex">
            <div className="flex flex-col w-full h-full gap-2">
                <div className=" flex justify-between items-center bg-white bg-opacity-20 py-3 px-2">
                    <h1>Search Page</h1>
                    <div className="w-max flex items-center relative">
                        <Image unoptimized 
                            src="/search.svg?v1"
                            alt="Picture of the author"
                            priority={true}
                            quality={75}
                            width={100}
                            height={100}
                            // onClick={handleSearch}
                            className='cursor-pointer w-[1rem] h-[1rem] absolute left-[10px]' />

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
                            className={searchTerm != '' ? 'cursor-pointer w-[1.5rem] h-[1.5rem] absolute right-[10px] hover:bg-white hover:bg-opacity-20 rounded-full p-1 ' : 'hidden'} />
                        <InputSearch value={searchTerm} setSearchTerm={setSearchTerm}/>
                    </div>
                </div>
                <div className={ 'w-full bg-black text-white flex flex-col gap-1 bg-[#1f0140c5]  '}>
                    {UsersAll.map((item, index) => (
                        <div key={index} className=" flex px-3 py-2  bg-[#1f0140c5]  hover:bg-[#5f3f82d1] w-full">
                            <Link
                                onClick={() => {
                                    setSearchTerm('');
                                    setUsersAll([]);
                                    setSearchResults([]);
                                }}
                                className="flex w-full items-center gap-2" href={`/user/${item.id}`}>
                                <Image unoptimized  src={default_img(item?.avatar, item?.fullname)} alt="Picture of the author" width={50} height={50} className="rounded-full w-[50px] h-[50px] min-w-[50px] min-h-[50px]" />
                                <span>{item?.fullname}</span>
                            </Link>
                        </div>
                    ))}

                </div>
            </div>
        </div>
    )
}

export default Search;
