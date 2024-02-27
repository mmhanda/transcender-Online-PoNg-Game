import Image from 'next/image'
import React from 'react'

interface BoxProps {
    icon: string;
    _key: string;
    iconStyle?: string;
    value: string | undefined;
    progress?: number;
    styles?: string;
}

const Box = ({icon, _key, value, iconStyle = '', progress = -1, styles = ''} : BoxProps) => {
    return (
        <div className={styles + ' rounded-md h-[6.5rem] w-[11rem] bg-white bg-opacity-20 text-white flex flex-col items-center justify-center mx-2 relative overflow-hidden'}>
            <span className={iconStyle}>
              <Image unoptimized  src={icon} alt="Branze" width={100} height={100} />
            </span>
            <span className=' uppercase text-[.7rem] text-[#fff] text-opacity-60'>{_key}</span>
            <span className=' uppercase '>{value}</span>
            {   progress == -1 ? null :
                <div className='w-full h-[0.3rem] bg-[#fff] bg-opacity-20 rounded-lg absolute bottom-0'>
                    <div className='h-full bg-[#fff] bg-opacity-100 rounded-lg' style={{width: progress + '%'}}></div>
                </div>
            }
        </div>
    );
}

export default Box;