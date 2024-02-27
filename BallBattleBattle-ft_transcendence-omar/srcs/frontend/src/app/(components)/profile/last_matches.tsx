import { Localhost, default_img } from '@/app/tools/global'
import axios from 'axios';
import Image from 'next/image'
import {useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import {Loading} from '../Loading/Loading';
import Link from 'next/link';

interface User {
    id?: number;
    fullname: string;
    email: string;
    avatar: string;
    lvl: number;
}

interface MatchBoxProps {
    index: number;
    user: User;
    tier: any;
    match: any;
}

const MatchBox = ({ index, match, user, tier }: MatchBoxProps) => {
    return (
        <Link href={`/user/${user.id}`} key={"match" + '_' + index + '' + Date.now()} className="py-1 overflow-hidden relative bg-white bg-opacity-[0.15] flex  items-center before:content-[''] before:w-[6px] before:h-[50px] before:bg-[#FDB971] before:rounded-r-[3px] rounded-lg">
            <div className="w-full py-1 text-sm flex">
                <div className="flex flex-1 first-letter:items-center ml-3">
                    <div className='w-[2.1rem] h-[2.1rem] md:w-[3.5rem] md:h-[3.5rem] p-[.2rem] md:p-[.2rem] rounded-full border-[1.5px] border-[#FDB971]'>
                        <Image unoptimized 
                            src={default_img(user?.avatar, user?.fullname)}
                            alt="valorant"
                            className='rounded-full w-full h-full'
                            width={100}
                            height={100}
                        />
                    </div>
                    <div className='ml-1 flex flex-col justify-center'>
                        <div className="ml-2 text-white font-bold text-[.8rem] leading-[.75rem] mb-[.15rem]">{user.fullname}</div>
                        <div className="ml-2 text-[#FDB971] font-semibold text-[.7rem] leading-[.75rem] hidden md:block">{tier.name} - LVL {user.lvl}</div>
                    </div>
                </div>
                <div className="flex flex-1 items-center justify-end mr-3">
                    <Image unoptimized 
                        alt={tier.name}
                        src={Localhost() + "/" + tier.image}
                        width={200}
                        height={200}
                        className="h-9 w-auto mr-1"
                    />
                    <div className='-mt-1'>
                        <div style={{color: tier.color }} className={` font-bold text-[.9rem] mb-[2px] uppercase w-[75px]`}>{ tier.name }</div>
                        <p className="text-white font-bold text-[.65rem] -mt-[0.15rem] leading-[8px]">{(match.rankbefore + match.earnpoint)} <span style={{color: tier.color }}>({match.earnpoint > 0 ? "+" + match.earnpoint : match.earnpoint})</span></p>
                    </div>
                </div>
            </div>
            <div className="absolute w-full h-full align-middle flex justify-center items-center">
                <div>
                    {
                        match && 'match_Winer' in match && match.match_Winer == user.id ?
                            <div className="text-xl md:text-2xl font-black text-[#FD7171] text-center">LOSE</div>
                        :
                            <div className="text-xl md:text-2xl font-black text-[#FDB971] text-center">WIN</div>
                    }
                    <div className="text-lg md:text-md font-semibold text-[#fff] text-center flex">
                        <span className='font-black text-[#ffffff] '>
                            {match.match_Winer == user.id ? match.winer_result : match.loser_result}
                        </span>
                        <div className='text-[5px] before:content-["■"] relative w-[40px] before:text-center'></div>
                        <span className='font-black text-[#b981f2]'>
                            {match.match_Winer == user.id ? match.loser_result : match.winer_result}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    )
}

interface LastMatchProps {
    type?: number | undefined;
    id?: number;
}


const LastMatch = ({ type = 0, id }: LastMatchProps) => {
    const [matches, SetMatches] = useState([] as any);
    const [tiers, SetTiers] = useState([] as any);
    const { data, isLoading, error, status } = useQuery({
        queryKey: ['getLastMatches'],
        queryFn: async () => {
            axios.defaults.withCredentials = true;
            try {
                if (id == undefined) id = 0;
                const res = await axios.get(`${Localhost()}/matches/${id}`)
                return res.data;
            } catch (error) { }
        }
    });

    useEffect(() => {
        if (data)
        {
            'matches' in data && SetMatches(data.matches)
            'tiers' in data && SetTiers(data.tiers)
        }
    }, [data, SetMatches])

    if (isLoading)
        return <div><Loading show={true}/></div>
    return (
        <div className={(!type ? " hidden lg:flex flex-2 " : '') + "w-full  flex-col h-min"}>
            <div className="mt-4 mb-8">
                <span className=" text-white uppercase font-black text-sx ">LAST 30 MATCHES:</span>
            </div>
            {
                matches.length == 0 &&
                <div className="w-full flex flex-col justify-center items-center">
                    <div className="text-white text-opacity-70 font-bold text-[.9rem]">No matches found</div>
                </div>
            }
            <div className="flex flex-col gap-2 justify-center">
                {
                    matches.map((match:any, index:number) => {
                        let tier = {}
                        tiers.map((t:any) => {
                            if (match.rankbefore + match.earnpoint >= t.minRank && match.rankbefore + match.earnpoint <= t.maxRank)
                            {
                                tier = t;
                                return;
                            }
                        })
                        return (
                            <div key={index}>
                                <MatchBox match={match} index={index} user={{ id: match.userId, lvl: match.user_xp == 0?1:parseInt(Math.log2(match.user_xp).toFixed()), email: '', avatar: default_img(match.user_avatar, match.user_name), fullname: match.user_name }} tier={tier} />
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default LastMatch