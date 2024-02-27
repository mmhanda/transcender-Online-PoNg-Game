import Image from "next/image";
import { User } from "./Chat";
import exp from "constants";
import { default_img } from "@/app/tools/global";
import { useRef, useState } from "react";
interface UplaodProps {
    avatar: string;
    name    ?: string;
    setFile : (file: File) => void;
}
const Uplaod = ({ avatar, name , setFile }: UplaodProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [channelImage, setChannelImage] = useState<string>(avatar);
    const handleFileChange = () => {
        const selectedFile = fileInputRef.current?.files?.[0];
        if (selectedFile) {
            setChannelImage(URL.createObjectURL(selectedFile));
            setFile(selectedFile);
        }
    };
    return (
        <div className='cursor-pointer  flex justify-center items-center gap-3 relative w-28 h-28  group p-[0.25rem] border-[2px] border-[#ffffff] border-opacity-[.3] rounded-full'>
                <Image unoptimized 
                    src={default_img(channelImage, name, 'A970E3')}
                    width={100}
                    height={100}
                    alt='avatar'
                    className='rounded-full w-full h-full'
                    onClick={() => {
                        if (fileInputRef.current) {
                            fileInputRef.current.click();
                        }
                    }}
                />
                <input onChange={() => {
                    handleFileChange();
                }} ref={fileInputRef} className='w-5 h-5 rounded-full opacity-20  hidden' placeholder='+' type="file" accept="image/*"/>

                <div
                    onClick={() => {
                        if (fileInputRef.current) {
                            fileInputRef.current.click();
                            
                        }
                    }}
                    className=' z-[99] absolute top-0 w-full h-full flex-col justify-center items-center rounded-full bg-[#241852] bg-opacity-50 hidden group-hover:flex'
                >
                    <Image unoptimized 
                        src='/img.svg'
                        width={20}
                        height={20}
                        alt='img icon for change avatar'
                        className='w-4 h-4'
                    />
                    <span className='font-bold text-[12px] mt-2'>CHANGE</span>
                </div>
            </div>
    );
};
export default Uplaod;