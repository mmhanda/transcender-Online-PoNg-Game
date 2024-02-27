import { FC } from "react"
import CharRadar from "./chart"
import LastMatch from "./last_matches"
import { User } from "./ProfileComp"
import { rankString } from "@/app/tools/global"

interface InfoProps {
    _key: string,
    value: string
}

const Info = ({_key, value}:InfoProps) => {
    return (
        <div className="flex gap-2">
            <span className=" text-[#FFB260] font-bold">{_key}:</span>
            <span className=" text-[#fff] text-opacity-85 font-semibold">{value}</span>
        </div>
    )
}

interface BasicInfoProps {
    idUser?: number
    user : User;
}

const BasicInfo:FC<BasicInfoProps> = ({idUser, user}) => {
    return (
        <div className="flex w-full">
            <div className=" text-white w-full flex flex-1 flex-col my-4 mx-5">
                <div>
                    <span className=" uppercase font-black text-sx ">PLayer State:</span>
                </div>
                <div className="grid grid-cols-2 gap-2 my-8">
                    <Info _key="Games win" value={`${user?.playerStats?.wins}`}/>
                    <Info _key="Win rate" value={`${user?.playerStats?.winRate?user?.playerStats?.winRate:0}%`}/>
                    <Info _key="Tier" value={`${user?.tier?.name}`}/>
                    <Info _key="Rank" value={`${rankString(user?.classment)}`}/>
                    <Info _key="Played time" value={Math.round(user?.playerStats?.playeTime/1000/60) + 'min'}/>
                </div>
                <div className="">
                    <span className=" uppercase font-black text-sx ">OVERVIEW:</span>
                </div>
                <div className="flex w-full justify-center lg:justify-normal overflow-hidden max-w-">
                    <CharRadar user={user} />
                </div>
            </div>
            <LastMatch id={idUser} />
        </div>
    )
}

export default BasicInfo