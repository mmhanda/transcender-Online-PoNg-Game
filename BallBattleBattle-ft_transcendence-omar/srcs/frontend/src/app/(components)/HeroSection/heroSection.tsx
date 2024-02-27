import { useQuery } from 'react-query'
import './heroSection.css'
import axios from 'axios';
import { Localhost } from '@/app/tools/global';
import { useEffect, useState } from 'react';
interface Props {
    playersCount?: number;
    matchesCount?: number;
    conversations?: number;
}
const HeroSecton = () => {
    const [details, setDetails] = useState<Props>();
    const { data, isLoading, error, status } = useQuery({
        queryKey: ['HeroSection'],
        queryFn: async () => {
            axios.defaults.withCredentials = true;
            const res = axios.get(`${Localhost()}/global`)
            return (await res).data;
        }
    });
    useEffect(() => {
        if (data) {
            setDetails(data);
        }
    }, [data])
    return (
        <div className="flex justify-between  mx-auto my-7">
            <div className="w-full">
                <p className="text-white font-light text-opacity-50 mt-7">
                    Welcome to <b className='text-[#ffffffdd]'>Ball</b>Battle
                </p>
                <p className={"2xl:text-[6rem] 2xl:leading-[7rem] " + "xl:text-[5rem] xl:leading-[5.5rem] " + " text-[4.5rem] leading-[5rem] text-gradient font-bold mt-2 mb-7 "}>
                    <span>Unleash the Paddle Power!</span>
                </p>
                <p className={"2xl:text-[1.5rem] 2xl:leading-[2rem]" + " my-11 xl:text-[1.25rem] text-[1.rem] leading-[1.75rem] text-[#B8B6BE] font-extralight"}>
                    At <span className='text-white'>Ball</span>Battle, we{"'"}re more than just a game – we{"'"}re a community of passionate ping pong enthusiasts, tech aficionados, and creative minds. Our journey began with a simple idea: to bring the joy of ping pong to the digital realm, enabling players from across the globe to connect, compete, and have a blast.
                </p>
                <div className='items-center my-10'>
                    <button
                        onClick={() => {
                            const login = document.getElementById('loginFirstBtn')
                            login?.click();
                        }}

                        className=' text-[#130C26] bgr-gradient rounded-3xl py-3 px-9 font-bold ' >
                        PLAY NOW
                    </button>
                </div>
                <div className='flex'>
                    <div className='mr-12'>
                        <p className='text-3xl md:text-6xl font-extralight'>{details?.playersCount}+</p>
                        <span className='text-[1.25rem] font-light '>Players</span>
                    </div>
                    <div className='mr-12'>
                        <p className='text-3xl md:text-6xl font-extralight'>{details?.matchesCount}+</p>
                        <span className='text-[1.25rem] font-light '>Live gameplays</span>
                    </div>
                    <div className='mr-12'>
                        <p className='text-3xl md:text-6xl font-extralight'>{details?.conversations}+</p>
                        <span className='text-[1.25rem] font-light '>Hot Rooms</span>
                    </div>
                </div>
            </div>
            <div className="hidden md:w-[70%] lg:flex items-center justify-end relative">
                <svg className="backdrop-blur-md rotate-3 2xl:h-[75%] h-[90%] mr-10 w-[75%]" id="eaD98P4bqXT1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 228.75 412.499988" shapeRendering="geometricPrecision" textRendering="geometricPrecision" width="228.75" height="412.499988">
                    <style dangerouslySetInnerHTML={{ __html: "\n        #eaD98P4bqXT104_to {\n            animation: eaD98P4bqXT104_to__to 10000ms linear infinite normal forwards\n        }\n\n        @keyframes eaD98P4bqXT104_to__to {\n            0% {\n                transform: translate(163.001717px, 374.175675px)\n            }\n\n            25% {\n                transform: translate(11.257814px, 74.227372px)\n            }\n\n            28% {\n                transform: translate(45.482421px, 37.842593px)\n            }\n\n            44% {\n                transform: translate(217.492189px, 186.664504px)\n            }\n\n            55% {\n                transform: translate(107.628663px, 374.247342px)\n            }\n\n            71% {\n                transform: translate(36.140624px, 38.203181px)\n            }\n\n            93% {\n                transform: translate(217.492189px, 266px)\n            }\n\n            100% {\n                transform: translate(163.001713px, 374.175675px)\n            }\n        }\n\n        #eaD98P4bqXT113_to {\n            animation: eaD98P4bqXT113_to__to 10000ms linear infinite normal forwards\n        }\n\n        @keyframes eaD98P4bqXT113_to__to {\n            0% {\n                transform: translate(157.001714px, 385.827684px)\n            }\n\n            5% {\n                transform: translate(201.001714px, 385.827684px)\n            }\n\n            15% {\n                transform: translate(35.123665px, 385.827684px)\n            }\n\n            30% {\n                transform: translate(200.202933px, 385.827684px)\n            }\n\n            45% {\n                transform: translate(29.282202px, 385.827684px)\n            }\n\n            55% {\n                transform: translate(102.001714px, 385.827684px)\n            }\n\n            65% {\n                transform: translate(203.223936px, 385.827684px)\n            }\n\n            80% {\n                transform: translate(29.414412px, 385.827684px)\n            }\n\n            93% {\n                transform: translate(201.346158px, 385.827684px)\n            }\n\n            100% {\n                transform: translate(157.001714px, 385.827684px)\n            }\n        }\n\n        #eaD98P4bqXT114_to {\n            animation: eaD98P4bqXT114_to__to 10000ms linear infinite normal forwards\n        }\n\n        @keyframes eaD98P4bqXT114_to__to {\n            0% {\n                transform: translate(44.974593px, 24.621122px)\n            }\n\n            15% {\n                transform: translate(197.974593px, 24.621122px)\n            }\n\n            28% {\n                transform: translate(44.974593px, 24.621122px)\n            }\n\n            31% {\n                transform: translate(31.974593px, 24.621122px)\n            }\n\n            48% {\n                transform: translate(201.974593px, 24.621122px)\n            }\n\n            70% {\n                transform: translate(27.974593px, 24.621122px)\n            }\n\n            87% {\n                transform: translate(194.974593px, 24.621122px)\n            }\n\n            100% {\n                transform: translate(44.974593px, 24.621122px)\n            }\n        }\n\n        #eaD98P4bqXT115 {\n            animation: eaD98P4bqXT115_c_o 10000ms linear infinite normal forwards\n        }\n\n        @keyframes eaD98P4bqXT115_c_o {\n            0% {\n                opacity: 1\n            }\n\n            3% {\n                opacity: 0.2\n            }\n\n            5% {\n                opacity: 1\n            }\n\n            8% {\n                opacity: 0.2\n            }\n\n            11% {\n                opacity: 1\n            }\n\n            14% {\n                opacity: 0.2\n            }\n\n            16% {\n                opacity: 1\n            }\n\n            19% {\n                opacity: 1\n            }\n\n            22% {\n                opacity: 0.2\n            }\n\n            24% {\n                opacity: 1\n            }\n\n            27% {\n                opacity: 1\n            }\n\n            30% {\n                opacity: 0.2\n            }\n\n            32% {\n                opacity: 1\n            }\n\n            35% {\n                opacity: 1\n            }\n\n            38% {\n                opacity: 0.2\n            }\n\n            40% {\n                opacity: 1\n            }\n\n            43% {\n                opacity: 0.2\n            }\n\n            46% {\n                opacity: 1\n            }\n\n            49% {\n                opacity: 0.2\n            }\n\n            51% {\n                opacity: 1\n            }\n\n            54% {\n                opacity: 1\n            }\n\n            57% {\n                opacity: 0.2\n            }\n\n            59% {\n                opacity: 1\n            }\n\n            62% {\n                opacity: 1\n            }\n\n            65% {\n                opacity: 0.2\n            }\n\n            67% {\n                opacity: 1\n            }\n\n            70% {\n                opacity: 1\n            }\n\n            73% {\n                opacity: 0.2\n            }\n\n            75% {\n                opacity: 1\n            }\n\n            78% {\n                opacity: 0.2\n            }\n\n            81% {\n                opacity: 1\n            }\n\n            84% {\n                opacity: 0.2\n            }\n\n            86% {\n                opacity: 1\n            }\n\n            89% {\n                opacity: 1\n            }\n\n            92% {\n                opacity: 0.2\n            }\n\n            94% {\n                opacity: 1\n            }\n\n            97% {\n                opacity: 1\n            }\n\n            99.5% {\n                opacity: 0.45\n            }\n\n            100% {\n                opacity: 0.2\n            }\n        }\n    " }} />
                    <defs>
                        <linearGradient id="gradient" x1="100%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="rgba(255, 255, 255, 1)" />
                            <stop offset="40%" stopColor="rgba(255, 255, 255, 0)" />
                            <stop offset="60%" stopColor="rgba(255, 255, 255, 0)" />
                            <stop offset="100%" stopColor="rgba(255, 255, 255, 1)" />
                        </linearGradient>
                    </defs>
                    <g clipPath="url(#eaD98P4bqXT5)">
                        <g>
                            <path d="M0.011719,0h228.726562v412.21875h-228.726562Zm0,0" className='opacity-[.15] fill-[url(#gradient)]' />
                        </g>
                        <clipPath id="eaD98P4bqXT5">
                            <path d="M0.011719,0h228.476562v412h-228.476562Zm0,0" />
                        </clipPath>
                    </g>
                    <g transform="translate(.000001 0.000001)">
                        <g transform="translate(.000001 0)">
                            <g clipPath="url(#eaD98P4bqXT16)">
                                <g transform="translate(0 0.000001)">
                                    <g clipPath="url(#eaD98P4bqXT14)">
                                        <g transform="translate(0 0.000001)">
                                            <path d="M224.988281,-2.25h3.75v198.609375h-3.75Zm0,0" transform="translate(0 0.000001)" fill="#fff" />
                                        </g>
                                        <clipPath id="eaD98P4bqXT14" transform="translate(0 0.000001)">
                                            <path d="M226.863281,-2.25c1.035157,0,1.875.839844,1.875,1.875v194.863281c0,1.035157-.839843,1.871094-1.875,1.871094-1.039062,0-1.875-.835937-1.875-1.871094v-194.863281c0-1.035156.835938-1.875,1.875-1.875" transform="translate(0 0.000001)" />
                                        </clipPath>
                                    </g>
                                </g>
                                <clipPath id="eaD98P4bqXT16" transform="translate(0 0.000001)">
                                    <path d="M224.988281,0h3.5v196.359375h-3.5Zm0,0" transform="translate(0 0.000001)" />
                                </clipPath>
                            </g>
                            <g clipPath="url(#eaD98P4bqXT25)">
                                <g transform="translate(0 0.000001)">
                                    <g clipPath="url(#eaD98P4bqXT23)">
                                        <g transform="translate(0 0.000001)">
                                            <path d="M0.011719,-2.25h3.75v198.609375h-3.75Zm0,0" transform="translate(0 0.000001)" fill="#fff" />
                                        </g>
                                        <clipPath id="eaD98P4bqXT23" transform="translate(0 0.000001)">
                                            <path d="M1.886719,-2.25c1.035156,0,1.875.839844,1.875,1.875v194.863281c0,1.035157-.839844,1.871094-1.875,1.871094s-1.875-.835937-1.875-1.871094v-194.863281c0-1.035156.839843-1.875,1.875-1.875" transform="translate(0 0.000001)" />
                                        </clipPath>
                                    </g>
                                </g>
                                <clipPath id="eaD98P4bqXT25" transform="translate(0 0.000001)">
                                    <path d="M0.011719,0h3.75v196.359375h-3.75Zm0,0" transform="translate(0 0.000001)" />
                                </clipPath>
                            </g>
                            <g clipPath="url(#eaD98P4bqXT34)">
                                <g>
                                    <g clipPath="url(#eaD98P4bqXT32)">
                                        <g>
                                            <path d="M0.015625,3.75v-3.75h228.5v3.75Zm0,0" fill="#fff" />
                                        </g>
                                        <clipPath id="eaD98P4bqXT32">
                                            <path d="M0.015625,1.875c0-1.035156.835937-1.875,1.871094-1.875h224.753906c1.035156,0,1.875.839844,1.875,1.875s-.839844,1.875-1.875,1.875h-224.753906c-1.035157,0-1.871094-.839844-1.871094-1.875" />
                                        </clipPath>
                                    </g>
                                </g>
                                <clipPath id="eaD98P4bqXT34">
                                    <path d="M0.015625,0h228.472656v3.75h-228.472656Zm0,0" />
                                </clipPath>
                            </g>
                        </g>
                        <g transform="translate(.000001 0.000001)">
                            <g clipPath="url(#eaD98P4bqXT44)">
                                <g>
                                    <g clipPath="url(#eaD98P4bqXT42)">
                                        <g>
                                            <path d="M3.761719,414.699219h-3.75v-198.613281h3.75Zm0,0" fill="#fff" />
                                        </g>
                                        <clipPath id="eaD98P4bqXT42">
                                            <path d="M1.886719,414.699219c-1.035157,0-1.875-.839844-1.875-1.875v-194.863281c0-1.035157.839843-1.875,1.875-1.875s1.875.839843,1.875,1.875v194.863281c0,1.035156-.839844,1.875-1.875,1.875" />
                                        </clipPath>
                                    </g>
                                </g>
                                <clipPath id="eaD98P4bqXT44">
                                    <path d="M0.011719,216.085938h3.75v195.914062h-3.75Zm0,0" />
                                </clipPath>
                            </g>
                            <g clipPath="url(#eaD98P4bqXT53)">
                                <g>
                                    <g clipPath="url(#eaD98P4bqXT51)">
                                        <g>
                                            <path d="M228.738281,414.699219h-3.75v-198.613281h3.75Zm0,0" fill="#fff" />
                                        </g>
                                        <clipPath id="eaD98P4bqXT51">
                                            <path d="M226.863281,414.699219c-1.039062,0-1.875-.839844-1.875-1.875v-194.863281c0-1.035157.835938-1.875,1.875-1.875c1.035157,0,1.875.839843,1.875,1.875v194.863281c0,1.035156-.839843,1.875-1.875,1.875" />
                                        </clipPath>
                                    </g>
                                </g>
                                <clipPath id="eaD98P4bqXT53">
                                    <path d="M224.988281,216.085938h3.5v195.914062h-3.5Zm0,0" />
                                </clipPath>
                            </g>
                            <g clipPath="url(#eaD98P4bqXT62)">
                                <g>
                                    <g clipPath="url(#eaD98P4bqXT60)">
                                        <g>
                                            <path d="M228.734375,408.699219v3.75h-228.5v-3.75Zm0,0" fill="#fff" />
                                        </g>
                                        <clipPath id="eaD98P4bqXT60">
                                            <path d="M228.734375,410.574219c0,1.035156-.835937,1.875-1.875,1.875h-224.75c-1.035156,0-1.875-.839844-1.875-1.875s.839844-1.875,1.875-1.875h224.75c1.039063,0,1.875.839843,1.875,1.875" />
                                        </clipPath>
                                    </g>
                                </g>
                                <clipPath id="eaD98P4bqXT62">
                                    <path d="M0.234375,408.699219h228.253906v3.300781h-228.253906Zm0,0" />
                                </clipPath>
                            </g>
                        </g>
                    </g>
                    <g clipPath="url(#eaD98P4bqXT71)">
                        <g>
                            <g clipPath="url(#eaD98P4bqXT69)">
                                <g>
                                    <path d="M-9.292969,207.984375v-3.75h246.058594v3.75Zm0,0" fill="#fff" />
                                </g>
                                <clipPath id="eaD98P4bqXT69">
                                    <path d="M-9.292969,206.109375c0-1.035156.839844-1.875,1.875-1.875h242.308594c1.035156,0,1.875.839844,1.875,1.875s-.839844,1.875-1.875,1.875h-242.308594c-1.035156,0-1.875-.839844-1.875-1.875" />
                                </clipPath>
                            </g>
                        </g>
                        <clipPath id="eaD98P4bqXT71">
                            <path d="M0.011719,204.234375h228.476562v3.75h-228.476562Zm0,0" />
                        </clipPath>
                    </g>
                    <g transform="translate(.000001 0.000001)">
                        <g mask="url(#eaD98P4bqXT86)">
                            <g>
                                <g transform="translate(111 8)">
                                    <g clipPath="url(#eaD98P4bqXT84)">
                                        <g>
                                            <g clipPath="url(#eaD98P4bqXT82)">
                                                <g>
                                                    <path d="M-0.000187,1.001132L242.91422,0.998824" transform="matrix(.000457-.7502 0.74991 0.000457 2.51096 186.16)" fill="none" stroke="#fff" strokeWidth={2} />
                                                </g>
                                                <clipPath id="eaD98P4bqXT82">
                                                    <path d="M0.238281,0.628906h6.234375v188.652344h-6.234375Zm0,0" />
                                                </clipPath>
                                            </g>
                                        </g>
                                        <clipPath id="eaD98P4bqXT84">
                                            <rect width={7} height={190} rx={0} ry={0} />
                                        </clipPath>
                                    </g>
                                </g>
                            </g>
                            <mask id="eaD98P4bqXT86" mask-type="luminance" x="-150%" y="-150%" height="400%" width="400%">
                                <g>
                                    <rect width="274.5" height={495} rx={0} ry={0} transform="translate(-22.875-41.25)" fill="#fff" fillOpacity="0.6" />
                                </g>
                            </mask>
                        </g>
                        <g mask="url(#eaD98P4bqXT101)">
                            <g>
                                <g transform="translate(111 215)">
                                    <g clipPath="url(#eaD98P4bqXT99)">
                                        <g>
                                            <g clipPath="url(#eaD98P4bqXT97)">
                                                <g>
                                                    <path d="M0.000518,1.001131l242.914408-.002307" transform="matrix(.000457-.7502 0.74991 0.000457 2.51096 186.109)" fill="none" stroke="#fff" strokeWidth={2} />
                                                </g>
                                                <clipPath id="eaD98P4bqXT97">
                                                    <path d="M0.238281,0.738281h6.234375v188.410157h-6.234375Zm0,0" />
                                                </clipPath>
                                            </g>
                                        </g>
                                        <clipPath id="eaD98P4bqXT99">
                                            <rect width={7} height={190} rx={0} ry={0} />
                                        </clipPath>
                                    </g>
                                </g>
                            </g>
                            <mask id="eaD98P4bqXT101" mask-type="luminance" x="-150%" y="-150%" height="400%" width="400%">
                                <g>
                                    <rect width="274.5" height={495} rx={0} ry={0} transform="translate(-22.875-41.25)" fill="#fff" fillOpacity="0.6" />
                                </g>
                            </mask>
                        </g>
                    </g>
                    <g id="eaD98P4bqXT104_to" transform="translate(163.001717,374.175675)">
                        <g transform="translate(-65.519531,-141.878906)" clipPath="url(#eaD98P4bqXT111)">
                            <g>
                                <g clipPath="url(#eaD98P4bqXT109)">
                                    <g>
                                        <path d="M58.023438,134.382812h14.992187v14.992188h-14.992187Zm0,0" fill="#a970e3" />
                                    </g>
                                    <clipPath id="eaD98P4bqXT109">
                                        <path d="M65.519531,134.382812c-4.140625,0-7.496093,3.355469-7.496093,7.496094s3.355468,7.496094,7.496093,7.496094s7.496094-3.355469,7.496094-7.496094-3.355469-7.496094-7.496094-7.496094" />
                                    </clipPath>
                                </g>
                            </g>
                            <clipPath id="eaD98P4bqXT111">
                                <path d="M58.023438,134.382812h14.992187v14.992188h-14.992187Zm0,0" />
                            </clipPath>
                        </g>
                    </g>
                    <g id="eaD98P4bqXT113_to" transform="translate(157.001714,385.827684)">
                        <path d="M4.999394,4.998838h44.90027" transform="scale(0.751405,0.749911) translate(-27.449512,-4.998838)" fill="none" stroke="#fff" strokeWidth={10} strokeLinecap="round" />
                    </g>
                    <g id="eaD98P4bqXT114_to" transform="translate(44.974593,24.621122)">
                        <path d="M4.9991,4.999023h44.90027" transform="scale(0.751405,0.749911) translate(-27.449227,-4.999024)" fill="none" stroke="#fff" strokeWidth={10} strokeLinecap="round" />
                    </g>
                    <g id="eaD98P4bqXT115">
                        <g clipPath="url(#eaD98P4bqXT119)">
                            <g>
                                <path d="M45.453125,256.367188c0-2.738282-1.855469-5.675782-6.003906-6.054688-3.097657-.28125-5.40625.421875-6.851563,2.101562-.109375.125-.160156.261719-.160156.425782v7.054687c0,.167969.050781.304688.160156.429688c1.445313,1.675781,3.753906,2.382812,6.851563,2.097656c4.148437-.378906,6.003906-3.3125,6.003906-6.054687Zm-13.53125,3.527343v-7.054687c0-.285156.097656-.539063.285156-.757813c1.5625-1.808593,4.015625-2.574219,7.289063-2.273437l-.023438.253906.023438-.253906c2.003906.183594,3.679687.96875,4.847656,2.269531c1.046875,1.167969,1.621094,2.691406,1.621094,4.289063c0,1.601562-.574219,3.125-1.621094,4.292968-1.167969,1.300782-2.84375,2.085938-4.847656,2.269532-3.273438.300781-5.726563-.464844-7.289063-2.277344-.1875-.214844-.285156-.472656-.285156-.757813Zm0,0" fill="#ffbd59" fillRule="evenodd" />
                            </g>
                            <clipPath id="eaD98P4bqXT119">
                                <path d="M31,249h14.972656v14L31,263Zm0,0" />
                            </clipPath>
                        </g>
                        <path d="M28.128906,255c0-.121094.089844-.226562.214844-.25c1.429688-.230469,2.71875-.964844,3.636719-2.070312.089843-.109376.253906-.125.363281-.035157s.125.25.035156.355469c-.996094,1.199219-2.398437,2-3.949218,2.253906-.140626.019532-.273438-.074218-.296876-.210937c0-.015625-.003906-.027344-.003906-.042969Zm0,0" fill="#ffbd59" fillRule="evenodd" />
                        <path d="M28.128906,257.734375c0-.011719.003906-.027344.003906-.039063.023438-.140624.15625-.234374.296876-.210937c1.550781.253906,2.953124,1.050781,3.949218,2.25.089844.109375.074219.269531-.035156.359375-.109375.085938-.273438.070312-.363281-.035156-.917969-1.105469-2.207031-1.839844-3.636719-2.074219-.125-.019531-.214844-.128906-.214844-.25Zm0,0" fill="#ffbd59" fillRule="evenodd" />
                        <g clipPath="url(#eaD98P4bqXT126)">
                            <g>
                                <path d="M28.128906,255.242188l-4.554687-.273438c-.015625-.003906-.054688.023438-.101563.097656-.320312.523438-.320312,2.082032,0,2.601563.046875.078125.085938.101562.101563.101562l4.554687-.273437Zm-5.410156,1.125c0-.609376.105469-1.21875.316406-1.5625.195313-.316407.441406-.351563.570313-.34375l4.796875.289062c.136718.007812.242187.117188.242187.253906v2.730469c0,.136719-.105469.246094-.242187.253906l-4.796875.289063c-.128907.007812-.375-.027344-.570313-.347656-.210937-.339844-.316406-.953126-.316406-1.5625Zm0,0" fill="#ffbd59" fillRule="evenodd" />
                            </g>
                            <clipPath id="eaD98P4bqXT126">
                                <path d="M22.726562,254L29,254v5h-6.273438Zm0,0" />
                            </clipPath>
                        </g>
                        <g clipPath="url(#eaD98P4bqXT131)">
                            <g>
                                <path d="M30.113281,246.296875c0-.074219.007813-.144531.019531-.21875.4375-2.339844,2.171876-4.210937,5.164063-5.570313c1.746094-.792968,3.523437-.960937,5.140625-.488281c1.445312.425781,2.714844,1.359375,3.566406,2.632813.847656,1.265625,1.230469,2.769531,1.082032,4.238281-.167969,1.621094-.960938,3.113281-2.292969,4.308594-.105469.09375-.269531.085937-.363281-.015625-.097657-.105469-.089844-.265625.015624-.359375c2.769532-2.484375,2.5625-5.753907,1.128907-7.890625-1.332031-1.988282-4.242188-3.695313-8.0625-1.964844-2.832031,1.285156-4.46875,3.035156-4.871094,5.199219-.03125.164062-.007813.308593.078125.449219l2.75,4.699218c.070312.121094.027344.277344-.097656.347656-.121094.070313-.277344.027344-.347656-.09375l-2.75-4.699218c-.109376-.179688-.160157-.375-.160157-.574219Zm0,0" fill="#ffbd59" fillRule="evenodd" />
                            </g>
                            <clipPath id="eaD98P4bqXT131">
                                <path d="M30,239.230469h15.972656v12.769531L30,252Zm0,0" />
                            </clipPath>
                        </g>
                        <path d="M28.046875,250.488281c0-.074219.03125-.144531.09375-.195312c1.121094-.90625,1.863281-2.179688,2.101563-3.589844.023437-.136719.15625-.230469.292968-.207031.140625.023437.234375.152344.214844.289062-.257812,1.53125-1.066406,2.914063-2.28125,3.898438-.109375.089844-.273438.074218-.363281-.035156-.039063-.046876-.058594-.101563-.058594-.160157Zm0,0" fill="#ffbd59" fillRule="evenodd" />
                        <path d="M29.433594,252.855469c0-.101563.0625-.199219.167968-.238281.855469-.316407,1.753907-.453126,2.671876-.398438.140624.011719.246093.128906.238281.269531s-.128907.246094-.269531.238281c-.84375-.050781-1.671876.074219-2.460938.367188-.132812.046875-.28125-.019531-.332031-.148438-.011719-.03125-.015625-.058593-.015625-.089843Zm0,0" fill="#ffbd59" fillRule="evenodd" />
                        <path d="M23.570312,252.976562c0-.078124.007813-.148437.023438-.214843.054688-.222657.191406-.332031.292969-.382813l4.304687-2.117187c.121094-.0625.269532-.015625.335938.097656l1.386718,2.371094c.066407.113281.03125.261719-.082031.335937l-3.125,2.039063c-.117187.078125-.277343.042969-.355469-.074219s-.046874-.273438.074219-.351562l2.921875-1.90625-1.144531-1.953126-4.085937,2.011719c-.011719.007813-.019532.039063-.023438.050781-.070312.28125.199219,1.046876.710938,1.742188.082031.113281.058593.273438-.054688.355469-.117188.082031-.277344.058593-.359375-.058594-.433594-.585937-.820313-1.398437-.820313-1.945313Zm0,0" fill="#ffbd59" fillRule="evenodd" />
                        <g clipPath="url(#eaD98P4bqXT139)">
                            <g>
                                <path d="M25.804688,248.363281c0-.699219-.574219-1.269531-1.285157-1.269531-.707031,0-1.285156.570312-1.285156,1.269531s.578125,1.269531,1.285156,1.269531c.710938,0,1.285157-.570312,1.285157-1.269531Zm-3.085938,0c0-.980469.808594-1.777343,1.800781-1.777343s1.800781.796874,1.800781,1.777343-.808593,1.773438-1.800781,1.773438c-.992187.003906-1.800781-.792969-1.800781-1.773438Zm0,0" fill="#ffbd59" fillRule="evenodd" />
                            </g>
                            <clipPath id="eaD98P4bqXT139">
                                <path d="M22.726562,246L27,246v5h-4.273438Zm0,0" />
                            </clipPath>
                        </g>
                    </g>
                    <g>
                        <g transform="translate(.000001 0.000001)">
                            <g>
                                <g transform="translate(8.83695 218.045)">
                                    <g>
                                        <path d="M12.125,1.5625v4.25c0,1.195312-.25,2.082031-.75,2.65625-.5.582031-1.277344.875-2.328125.875-.742187,0-1.335937-.140625-1.78125-.421875-.4375-.273437-.773437-.683594-1-1.234375-.242187.707031-.605469,1.234375-1.09375,1.578125-.480469.34375-1.132813.515625-1.953125.515625-1.125,0-1.945312-.3125-2.453125-.9375C0.253906,8.226562,0,7.316406,0,6.109375L0,1.5625ZM6.59375,5.953125c0,.84375.195312,1.46875.59375,1.875.40625.40625,1.015625.609375,1.828125.609375.820313,0,1.410156-.210938,1.765625-.625.363281-.417969.546875-1.089844.546875-2.015625v-3.359375h-4.734375Zm-5.796875.125c0,.90625.195313,1.597656.59375,2.078125.394531.488281,1.019531.734375,1.875.734375.945313,0,1.601563-.273437,1.96875-.8125.375-.53125.5625-1.242187.5625-2.125v-3.515625h-5Zm0,0" fill="#fff" />
                                    </g>
                                </g>
                            </g>
                            <g>
                                <g transform="translate(8.83695 228.822)">
                                    <g>
                                        <path d="M-0.15625,3.140625c0-.773437.21875-1.359375.65625-1.765625.445312-.398438,1.070312-.59375,1.875-.59375.789062,0,1.390625.195312,1.796875.59375.414063.394531.675781,1.023438.78125,1.890625l.328125,3.125h.828125c.675781,0,1.171875-.148437,1.484375-.4375.320312-.28125.484375-.671875.484375-1.171875c0-.511719-.023437-.984375-.0625-1.421875-.03125-.4375-.101563-1.132813-.203125-2.078125l.71875-.046875c.21875,1.25.328125,2.363281.328125,3.34375c0,.914063-.226563,1.585937-.671875,2.015625-.4375.425781-1.132812.640625-2.078125.640625h-4.828125c-.179688.019531-.335938.132813-.46875.34375-.125.207031-.210938.492187-.25.859375l-.71875-.03125c0-.417969.0625-.792969.1875-1.125.125-.335938.304688-.589844.546875-.765625-.492187-1.09375-.734375-2.21875-.734375-3.375Zm.75.0625c0,.90625.160156,1.8125.484375,2.71875l.15625.46875h3.328125L4.265625,3.375C4.210938,2.769531,4.039062,2.335938,3.75,2.078125C3.46875,1.816406,3.039062,1.6875,2.46875,1.6875c-1.25,0-1.875.503906-1.875,1.515625Zm0,0" fill="#fff" />
                                    </g>
                                </g>
                            </g>
                            <g>
                                <g transform="translate(8.83695 237.476)">
                                    <g transform="translate(.000001 0)">
                                        <path d="M12.640625,1.421875v.875L0,2.296875v-.875Zm0,0" transform="translate(.000001 0)" fill="#fff" />
                                    </g>
                                </g>
                            </g>
                            <g>
                                <g transform="translate(8.83695 241.202)">
                                    <g transform="translate(.000001 0)">
                                        <path d="M12.640625,1.421875v.875L0,2.296875v-.875Zm0,0" transform="translate(.000001 0)" fill="#fff" />
                                    </g>
                                </g>
                            </g>
                        </g>
                        <g clipPath="url(#eaD98P4bqXT195)">
                            <g>
                                <g mask="url(#eaD98P4bqXT192)">
                                    <g>
                                        <g transform="translate(0 245)">
                                            <g clipPath="url(#eaD98P4bqXT190)">
                                                <g>
                                                    <g>
                                                        <g transform="translate(8.12841 0.449042)">
                                                            <g transform="translate(0 0.000001)">
                                                                <path d="M11.34375,1.46875v3.96875c0,1.113281-.242188,1.941406-.71875,2.484375-.46875.539063-1.195312.8125-2.171875.8125-.6875,0-1.242187-.132813-1.65625-.390625-.40625-.261719-.71875-.648438-.9375-1.15625-.230469.664062-.574219,1.15625-1.03125,1.46875-.449219.320312-1.054687.484375-1.8125.484375-1.054687,0-1.820313-.292969-2.296875-.875C0.238281,7.691406,0,6.835938,0,5.703125L0,1.46875ZM6.171875,5.5625c0,.789062.179687,1.375.546875,1.75.375.382812.941406.578125,1.703125.578125.769531,0,1.320313-.199219,1.65625-.59375.34375-.386719.515625-1.011719.515625-1.875v-3.140625h-4.421875ZM0.75,5.671875c0,.851563.179688,1.503906.546875,1.953125.375.457031.960937.6875,1.765625.6875.875,0,1.484375-.257812,1.828125-.765625.351563-.5.53125-1.164063.53125-1.984375v-3.28125h-4.671875Zm0,0" transform="translate(0 0.000001)" fill="#fff" />
                                                            </g>
                                                        </g>
                                                    </g>
                                                    <g>
                                                        <g transform="translate(8.12841 10.5163)">
                                                            <g transform="translate(.000001 0)">
                                                                <path d="M-0.140625,2.921875c0-.710937.203125-1.25.609375-1.625.414062-.375,1-.5625,1.75-.5625.738281,0,1.300781.179687,1.6875.546875.382812.375.628906.96875.734375,1.78125l.28125,2.90625h.78125c.632813,0,1.097656-.136719,1.390625-.40625.300781-.261719.453125-.625.453125-1.09375c0-.480469-.015625-.929688-.046875-1.34375-.03125-.40625-.101562-1.046875-.203125-1.921875L7.96875,1.15625c.207031,1.164062.3125,2.207031.3125,3.125c0,.851562-.210938,1.476562-.625,1.875-.40625.40625-1.058594.609375-1.953125.609375h-4.5c-.179687.007813-.328125.113281-.453125.3125-.117188.195313-.195312.46875-.234375.8125l-.65625-.03125c0-.398437.058594-.75.171875-1.0625.125-.304687.289062-.542969.5-.71875-.449219-1.023437-.671875-2.074219-.671875-3.15625ZM0.546875,3c0,.84375.15625,1.6875.46875,2.53125l.140625.4375h3.109375l-.28125-2.8125c-.042969-.5625-.199219-.96875-.46875-1.21875-.273437-.242188-.671875-.359375-1.203125-.359375-1.179688,0-1.765625.472656-1.765625,1.421875Zm0,0" transform="translate(.000001 0)" fill="#fff" />
                                                            </g>
                                                        </g>
                                                    </g>
                                                    <g>
                                                        <g transform="translate(8.12841 18.5993)">
                                                            <g transform="translate(0 0.000001)">
                                                                <path d="M-0.171875,3.75c0-.511719.085938-.917969.25-1.21875.175781-.292969.472656-.507812.890625-.640625.414062-.125,1.007812-.1875,1.78125-.1875h4.671875v-1.234375h.71875v1.234375h2.578125v.78125h-2.578125v2.84375h-.71875v-2.84375h-4.125c-.75,0-1.308594.023437-1.671875.078125-.355469.0625-.625.1875-.8125.375s-.28125.5-.28125.9375l.140625,1.546875-.6875.0625c-.101563-.761719-.15625-1.339844-.15625-1.734375Zm0,0" transform="translate(0 0.000001)" fill="#fff" />
                                                            </g>
                                                        </g>
                                                    </g>
                                                    <g>
                                                        <g transform="translate(8.12841 24.2103)">
                                                            <g transform="translate(0 0.000001)">
                                                                <path d="M-0.171875,3.75c0-.511719.085938-.917969.25-1.21875.175781-.292969.472656-.507812.890625-.640625.414062-.125,1.007812-.1875,1.78125-.1875h4.671875v-1.234375h.71875v1.234375h2.578125v.78125h-2.578125v2.84375h-.71875v-2.84375h-4.125c-.75,0-1.308594.023437-1.671875.078125-.355469.0625-.625.1875-.8125.375s-.28125.5-.28125.9375l.140625,1.546875-.6875.0625c-.101563-.761719-.15625-1.339844-.15625-1.734375Zm0,0" transform="translate(0 0.000001)" fill="#fff" />
                                                            </g>
                                                        </g>
                                                    </g>
                                                    <g>
                                                        <g transform="translate(8.12841 29.8213)">
                                                            <g>
                                                                <path d="M11.8125,1.328125v.8125h-11.8125v-.8125Zm0,0" fill="#fff" />
                                                            </g>
                                                        </g>
                                                    </g>
                                                    <g>
                                                        <g transform="translate(8.12841 33.3017)">
                                                            <g transform="translate(.000001 0)">
                                                                <path d="M-0.140625,4.21875c0-1.21875.316406-2.078125.953125-2.578125.632812-.492187,1.648438-.734375,3.046875-.734375c1.5,0,2.609375.265625,3.328125.796875C7.914062,2.242188,8.28125,3.09375,8.28125,4.25c0,1.0625-.3125,1.847656-.9375,2.359375-.625.507813-1.601562.765625-2.921875.765625l-.6875-.015625v-5.640625c-.78125-.011719-1.402344.066406-1.859375.234375-.460938.164063-.796875.445313-1.015625.84375-.210937.394531-.3125.941406-.3125,1.640625c0,.289062.007813.632812.03125,1.03125.019531.394531.046875.765625.078125,1.109375l.046875.484375-.671875.03125c-.113281-1.125-.171875-2.085938-.171875-2.875Zm4.5625,2.34375c1.125,0,1.929687-.1875,2.421875-.5625.5-.367188.75-.949219.75-1.75c0-.835938-.261719-1.464844-.78125-1.890625-.511719-.429687-1.308594-.648437-2.390625-.65625Zm0,0" transform="translate(.000001 0)" fill="#fff" />
                                                            </g>
                                                        </g>
                                                    </g>
                                                </g>
                                                <clipPath id="eaD98P4bqXT190">
                                                    <rect width={29} height={42} rx={0} ry={0} />
                                                </clipPath>
                                            </g>
                                        </g>
                                    </g>
                                    <mask id="eaD98P4bqXT192" mask-type="luminance" x="-150%" y="-150%" height="400%" width="400%">
                                        <g>
                                            <rect width="274.5" height={495} rx={0} ry={0} transform="translate(-22.875-41.25)" fill="#fff" fillOpacity="0.6667" />
                                        </g>
                                    </mask>
                                </g>
                            </g>
                            <clipPath id="eaD98P4bqXT195">
                                <path d="M0.011719,245L29,245v42h-28.988281Zm0,0" fill="#fff" />
                            </clipPath>
                        </g>
                    </g>
                </svg>
            </div>
        </div>
    )
}

export default HeroSecton;
