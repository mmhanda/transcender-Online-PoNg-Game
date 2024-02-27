import Link from 'next/link';
import './leaderboard.css'
import React, { useEffect } from 'react';
import Image from 'next/image';
import { default_img } from '../../tools/global'
import { useRouter } from 'next/navigation';

interface peer {
    id: number;
    avatar: string;
    fullname: string;
    createdAt: string;
}

interface row {
    rank: number;
    user: peer;
}

interface Props {
    data: row[];
    limit: number | 10;
    logged: boolean | false;
}

export default function LeaderBoard({ leader, limit, logged }: any) {
    const router = useRouter();

    useEffect(() => {
        function enableSliderBehavior(slider: HTMLElement) {
            let isDown = false;
            let startX: number;
            let scrollLeft: number;

            const handleMouseDown = (e: MouseEvent) => {
                isDown = true;
                slider.classList.add('active');
                startX = e.pageX - (slider.offsetLeft || 0);
                scrollLeft = slider.scrollLeft || 0;
            };
            const handleMouseLeave = () => {
                isDown = false;
                slider.classList.remove('active');
            };

            const handleMouseUp = () => {
                isDown = false;
                slider.classList.remove('active');
            };

            const handleMouseMove = (e: MouseEvent) => {
                if (!isDown) return;
                e.preventDefault();
                const x = e.pageX - (slider.offsetLeft || 0);
                const walk = (x - startX);
                slider.scrollLeft = (scrollLeft || 0) - walk;
            };

            slider.addEventListener('mousedown', handleMouseDown);
            slider.addEventListener('mouseleave', handleMouseLeave);
            slider.addEventListener('mouseup', handleMouseUp);
            slider.addEventListener('mousemove', handleMouseMove);

            return () => {
                slider.removeEventListener('mousedown', handleMouseDown);
                slider.removeEventListener('mouseleave', handleMouseLeave);
                slider.removeEventListener('mouseup', handleMouseUp);
                slider.removeEventListener('mousemove', handleMouseMove);
            };
        }
        const sliders = document.querySelectorAll('.our-scroll');
        sliders.forEach((slider) => {
            enableSliderBehavior(slider as HTMLElement);
        });
    }, []);


    return (
        <div className='w-full mb-4 mt-6' id='leaderboard'>
            <div className={'flex justify-between items-center py-2 ' + ((logged) ? ' px-[2rem] bg-[#fff] bg-opacity-[.08] border-[#ffffff] border-opacity-[.20] border-b-[.1px]' : ' px-4 ')}>
                <div className='flex items-center gap-3'>
                    <div className=' border-[2px] border-[#8E88DF] w-14 h-14 rounded-full bg-[#4238CA] flex justify-center'>
                        <Image unoptimized  width={100} height={100} className=' w-7  self-center ' src='/leaderBoard.svg' alt='leaderboard' />
                    </div>
                    <div className=' '>
                        <div className=' text-white text-[1.3rem] font-light leading-[20px] '>Leaderboard</div>
                        <div className='text-[#8E88DF] text-xs leading-[15px] mt-1'>Top 10 players for this season</div>
                    </div>
                </div>
                <div>
                    <div
                        onClick={() => {
                            if (logged)
                                router.push('/MoreLeaderBoard')
                            else {
                                const login = document.getElementById('loginFirstBtn')
                                login?.click();
                            }
                        }}

                        className='text-[1rem] font-light text-[#8E88DF] cursor-pointer' >see more
                        <Image unoptimized  className='inline-block w-3 ml-1' src='/seeMore.svg' alt='arrow' width={100} height={100} />
                    </div>
                </div>
            </div>
            <div className={'relative pb-3 w-full grid ' + ((logged) ? " px-[1.2rem] bg-[#fff] bg-opacity-[.05]" : "")}>
                <div className='flex flex-row our-scroll overflow-y-hidden'>
                    {leader.map((row: row, index: number) => (
                        <Link href={`/user/${row.user.id}`} className='relative cursor-pointer px-3 py-2 mt-4 rounded-full select-none' key={'leaderBoared' + index}>
                            <div className='  mx-0.5'>
                                <div className={"relative w-[6rem] h-[6rem] rounded-full bg-[#423D51] user-score items-end rotate-[-60deg]"}>
                                    <Image unoptimized  width={100} height={100}
                                        key={index + "ROW" + row.user.id}
                                        src={default_img(row.user?.avatar, row.user?.fullname)}
                                        alt={`Image ${index + 1}`}
                                        className="w-full h-full rotate-[60deg] rounded-full border-[3px] border-[#423D51]"
                                    />
                                    <div className='absolute w-full h-full bg-red-500 rotate-[60deg] left-0 top-0 rounded-full opacity-0'></div>
                                    <div className="text-center text-[12px] relative bottom-[4px]">{row.rank}</div>
                                </div>
                                <div className='mt-2 text-center max-h-6 overflow-hidden overflow-ellipsis whitespace-nowrap w-[6rem]'>
                                    {row.user?.fullname}
                                </div>
                            </div>
                            <div className=" absolute top-[-15px] right-[-5px] flex justify-center items-center">
                                {index === 0 && <Image unoptimized  width={100} height={100} src="/GoldCrown.svg" alt="" className="w-16 rotate-[10deg]" />}
                                {index === 1 && <Image unoptimized  width={100} height={100} src="/PlomoPlata.svg" alt="" className="w-16 rotate-[10deg]" />}
                                {index === 2 && <Image unoptimized  width={100} height={100} src="/Cu.svg" alt="" className="w-16 rotate-[10deg]" />}
                                {
                                    index >= 3 ? null : <span className={`${index == 0 ? "!text-[#b68900]" : index == 1 ? "text-[#7d7d7d]" : "text-[#763805]"} font-black absolute z-1 text-[13px] mt-2 mr-2 rotate-[45deg]`}>{index + 1}</span>
                                }
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

