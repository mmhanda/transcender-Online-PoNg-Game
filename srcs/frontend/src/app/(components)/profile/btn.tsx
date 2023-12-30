import Image from 'next/image'
import React, { Children } from 'react'

interface BtnProps {
    //className as tailwindcss

    className?: string;
    icon?: string;
    text?: string;
    onClick?: () => void;
    iconStyles?: string;
    children?: React.ReactNode;
}

const Btn = ({children, iconStyles = 'w-5', className = '', icon = '', text = '', onClick}:BtnProps) => {
    return (
        <div onClick={onClick} className={className + ' items-center h-7 flex rounded-lg py-1' }>
            {icon == '' || <Image unoptimized  className={iconStyles} src={icon} alt={text} width={100} height={100} />}
            <span className='uppercase text-xs'>{text}</span>
            {children}
        </div>
    );
}

export default Btn;