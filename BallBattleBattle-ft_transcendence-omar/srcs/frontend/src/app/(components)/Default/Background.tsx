import React from 'react';
import "./Background.css"
import Image from 'next/image';

export default function Background({isLogged = false}) {
    return (
        <div>
            <div className="ghost-animation w-[12.5rem] h-[2.5rem] bg-[#4d3588] absolute z-[-1] rounded-[200%] blur-md  top-[32.5%] right-[6rem]"></div>
            <div className={`${isLogged ? 'left-[1em] top-[-2em]  md:top-[-3em]' : 'left-[-3em] top-[-4em]  md:top-[-5em]'} absolute z-[-1]`}>
                <div className="w-[12em] h-[12em] md:w-[20em] md:h-[20em] opacity-80 bg-[#412c76] rounded-[25%] custom-spin"></div>
            </div>
            <div className="overflow-hidden absolute w-screen h-screen z-[-2] item-end bg-black opacity-50">
                <Image unoptimized  priority={true} src="/bg.jpeg" alt="Picture of the author" quality={100} width={1000} height={1000} className="w-[85%] ml-[150px] md:w-[55%] md:max-w-[1000px] mr-0 2xl:mr-[80px] md:ml-auto opacity-50" />
            </div>
            <div className="absolute w-screen h-screen z-[-5] bg-[#21153e]"></div>
        </div>
    );
}