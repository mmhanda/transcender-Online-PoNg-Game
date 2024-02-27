import { Localhost, default_img, rankString } from '@/app/tools/global'
import axios from 'axios';
import moment from 'moment';
import Image from 'next/image'
import Link from 'next/link';
import { useEffect, useState } from 'react'

interface InfosProps {
    basicInfo: any;
}

interface InfoProps {
    _key: string,
    value: string
}

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
        <Link href={`/user/${user.id}`} key={"match" + '_' + index + '' + Date.now()} className="py-1 overflow-hidden relative bg-white bg-opacity-[0.15] flex  items-center before:content-[''] before:w-[4px] before:h-[40px] before:bg-[#FDB971] before:rounded-r-[3px] rounded-lg">
            <div className="w-full py-1 text-sm flex">
                <div className='ml-2 flex justify-center items-center'>
                    {
                        match && 'match_Winer' in match && match.match_Winer == user.id ?
                            <div className="text-xl md:text-lg font-black text-[#FD7171] text-center">LOSE</div>
                        :
                            <div className="text-xl md:text-lg font-black text-[#FDB971] text-center">WIN</div>
                    }
                </div>
                <div className="flex flex-1 items-center justify-end mr-3">
                    <Image unoptimized 
                        alt={tier.name}
                        src={Localhost() + "/" + tier.image}
                        width={200}
                        height={200}
                        className="h-9 w-auto"
                    />
                    <div className='-mt-1'>
                        <div style={{color: tier.color }} className={` font-bold text-right text-[.9rem] mb-[2px] uppercase w-[75px]`}>{ tier.name }</div>
                        <p className="text-white font-bold text-[.65rem] -mt-[0.15rem] text-right leading-[8px]">{(match.rankbefore + match.earnpoint)} <span style={{color: tier.color }}>({match.earnpoint > 0 ? "+" + match.earnpoint : match.earnpoint})</span></p>
                    </div>
                </div>
            </div>
            <div className="absolute w-full h-full align-middle flex justify-center items-center">
                <div>
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


const Info = ({_key, value}:InfoProps) => {
    return (
        <div className="flex gap-2 items-center">
            <span className=" text-[#FFB260] font-bold text-[14px]">{_key}:</span>
            <span className={` text-[#fff] text-opacity-85 text-[14px] ${_key== "UNIQUE ID" && "!text-[12px] text-opacity-70"} font-semibold`}>{value}</span>
        </div>
    )
}

const Infos: React.FC<InfosProps> = ({ basicInfo }) => {
    const [data, setData] = useState<any>(null);
    const fetchMatches = async (id:number | undefined | null) => {
        axios.defaults.withCredentials = true;
            try {
                if (id == undefined) return;
                const res = await axios.get(`${Localhost()}/matches/${id}`)
                setData(res.data);
            } catch (error) { }
    }

    useEffect(() => {
        if (basicInfo?.item?.user?.id)
            fetchMatches(basicInfo.item.user.id);
    }, [basicInfo])

 

    return (
        <div className="hidden ml-3 mr-1 lg:flex lg:flex-col w-[36rem]">
            <div className="flex flex-col items-center mb-3">
                {
                    (basicInfo && 'item' in basicInfo && 'tiers' in basicInfo.item && basicInfo.item.tiers.image.length > 0) ?
                        <Image unoptimized  width={512} height={512} src={default_img(basicInfo.item.tiers.image, "")} alt="master" className="w-1/2 m-auto " />
                    :
                    <Image unoptimized  width={100} height={100} src={default_img("/tiers/Bronze.webp", "")} alt="master" className="invisible w-1/2 m-auto " />
                }
                <h1 style={{color: (basicInfo && 'item' in basicInfo && 'tiers' in basicInfo.item && basicInfo.item.tiers.color.length > 0) ? basicInfo.item.tiers.color : ""}} className=" font-black text-2xl  uppercase">{(basicInfo && 'item' in basicInfo && 'tiers' in basicInfo.item && basicInfo.item.tiers.name.length > 0) ? basicInfo.item.tiers.name : ""}</h1>
            </div>
            <div className="bg-white bg-opacity-10 rounded-xl px-2">
                <div className="flex justify-between items-center mt-2 mx-2">
                    <div className="flex items-center mt-2">
                        <div className="mr-2">
                            <Link href={(basicInfo?.item?.user?.id) ? "/user/" + basicInfo?.item?.user?.id : ""}>
                                <Image unoptimized  width={100} height={100} alt="" className="w-12 border-2 border-white border-opacity-[0.2] rounded-full" src={default_img((basicInfo && 'item' in basicInfo && 'user' in basicInfo.item && basicInfo.item.user.avatar) ? basicInfo.item.user.avatar : null,(basicInfo && 'item' in basicInfo && 'user' in basicInfo.item && basicInfo.item.user.fullname) ? basicInfo.item.user.fullname : "")} />
                            </Link>
                        </div>
                        <div className="flex flex-col">
                            <Link href={(basicInfo?.item?.user?.id) ? "/user/" + basicInfo?.item?.user?.id : ""}>
                                <span className="font-bold">{(basicInfo && 'item' in basicInfo && 'user' in basicInfo.item) ? basicInfo.item.user?.fullname : ""}</span>
                            </Link>
                            <div className="flex gap-1">
                                <span className="antialiased text-start font-sans text-xs text-white opacity-50">
                                    Join {(basicInfo && 'item' in basicInfo && 'user' in basicInfo.item && 'createdAt' in basicInfo.item.user && basicInfo.item.user.createdAt.length > 0) ? moment(basicInfo.item.user?.createdAt).fromNow() : ""}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mx-3 my-4">
                    <Info _key="UNIQUE ID" value={(basicInfo && 'item' in basicInfo && 'user' in basicInfo.item && 'id' in basicInfo.item.user) && basicInfo.item.user.id}/>
                    <Info _key="Rank" value={basicInfo && rankString(basicInfo.rank)}/>

                    <Info _key="Games win" value={(basicInfo && 'item' in basicInfo && 'matchCount' in basicInfo.item) && basicInfo.item.wins + " of " +  basicInfo.item.matchCount}/>
                    
                    <Info _key="Rank tier" value={(basicInfo && 'item' in basicInfo && 'tiers' in basicInfo.item && basicInfo.item.tiers.name.length > 0) ? basicInfo.item.tiers.name : ""}/>
                    <Info _key="Win rate" value={(basicInfo && 'item' in basicInfo && 'winRate' in basicInfo.item) && basicInfo.item.winRate + "%"}/>
                    <Info _key="Played time" value={(basicInfo && 'item' in basicInfo && 'playeTime' in basicInfo.item) && basicInfo.item.playeTime + "hrs"}/>
                </div>
                <div className="pt-2">
                    <h1 className=" uppercase text-md font-bold text-[14px] text-center mt-2"> LATEST 10  MATCHES </h1>
                    <div className="mx-4 overflow-x-auto px-4 py-2 sm:-mx-8 sm:px-8">
                        <div className="inline-block min-w-full overflow-hidden shadow">
                            {
                                data?.matches?.length == 0 ?
                                <div className="w-full flex flex-col justify-center items-center my-8">
                                    <div className="text-white text-opacity-50 uppercase font-semibold text-[.7rem]">No matches found</div>
                                </div>
                                :
                                <div className="flex flex-col gap-2 justify-center">
                                {
                                    data?.matches?.map((match:any, index:number) => {
                                        let tier = {}
                                        data?.tiers?.map((t:any) => {
                                            if (match.rankbefore + match.earnpoint >= t.minRank && match.rankbefore + match.earnpoint <= t.maxRank)
                                            {
                                                tier = t;
                                                return;
                                            }
                                        })
                                        return (
                                            <div key={index}>
                                                <MatchBox match={match} index={index} user={{ id: match.userId, lvl: 18, email: '', avatar: default_img(match.user_avatar, match.user_name), fullname: match.user_name }} tier={tier} />
                                            </div>
                                        )
                                    })
                                }
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Infos