import { Localhost } from "@/app/tools/global";
import Input from "@/app/tools/input";
import axios from "axios";
import Image from "next/image";
import { FC, useEffect, useState } from "react";
import { useQueryClient } from "react-query";
interface Props {
    Cancel?: () => void;
}

interface Data {
    Qrcode?: string;
    secret?: any;
    userId?: number;
}

const TwoFaAuth: FC<Props> = ({ Cancel }) => {
    const client = useQueryClient();
    const [load, setLoad] = useState(false);
    const [verificationCode, setVerificationCode] = useState<string | number | readonly string[] | undefined>(undefined);
    const [data, setData] = useState<Data>({} as Data);
    const [err, setErr] = useState<string | undefined>(undefined);

    const handleSubmitButtonClick = () => {
        setLoad(true);
        axios.post(`${Localhost()}/auth/enable-2fa`, {
            "token": verificationCode,
            "secret": data?.secret?.base32,
        }).then(res => {
            if (res.data?.success == true) {
                (Cancel) && Cancel();
                client.invalidateQueries('the-login');
            }
            else
                setErr("Verification code is not valid");
        }).catch(err => {

        }).finally(() => {
            setVerificationCode("");
            setLoad(false);
        })


    }

    const get2FAQR = () => {
        axios.get(`${Localhost()}/auth/get-2fa`).then(res => {
            setData(res.data);
        }).catch(err => {

        })
    }

    useEffect(() => {
        get2FAQR();
    }, []);


    return (
        <div className="w-full flex flex-col justify-center gap-2 px-8 py-4">
            <div className="my-2 overflow-hidden">
                <div className={'flex  w-full before:left-[80%] before:pt-[9px] before:text-center before:text-[2rem] before:font-bold relative pr-[20%] before:block before:w-[80%] before:rotate-[270deg] before:tracking-[3px] before:text-white before:content-["2FA_AUTH"] before:absolute before:h-full items-center '}>
                    {
                        data?.Qrcode &&
                        <Image unoptimized 
                        src={data.Qrcode}
                        width={100}
                        height={100}
                        quality={100}
                        alt='2FA QR'
                        className="flex-1"/>
                    }
                </div>

            </div>
            <div>
                <Input className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" type={"number"} defaultValue={verificationCode} error={err != undefined} seter={setVerificationCode} tabIndex={1} id="2fa" placeholder="VERIFICATION CODE" />
            </div>
            <div
                onClick={handleSubmitButtonClick}
                className='text-black cursor-pointer font-bold text-sm flex gap-2 bg-white w-full items-center justify-center py-3 uppercase'>
                Verify
                {
                    load &&
                    <div className=' animate-spin duration-75'>
                        <Image unoptimized  width={20} height={20} alt='arrow' src='/load.svg' />
                    </div>

                }
            </div>
            <div onClick={Cancel} className="font-bold cursor-pointer w-full text-white text-sm text-center bg-[#ffffff19] hover:bg-[#ffffff2d] py-3">
                CANCEL
            </div>
        </div>
    );
}

export default TwoFaAuth;
