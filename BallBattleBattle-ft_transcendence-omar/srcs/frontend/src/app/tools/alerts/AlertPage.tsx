'use client';
import Image from "next/image";
import Link from "next/link";
import React, { FC, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { default_img } from "../global";

interface AlertProps {
	convId?: number;
	senderId?: number;
	type: string;
	message: string;
	title: string;
	avatar?: string;
	fullname?: string;
}

const AlertPage: FC<AlertProps> = ({ type, message, title, convId, senderId, avatar, fullname }) => 
{
	const [show, setShow] = React.useState(true);
	const router = useRouter();

	useEffect(() => {
		const timeout = setTimeout(() => {
			setShow(false);
		}, 10000);
		return () => clearTimeout(timeout);
	}, []);


	const handelGameEvents = (type: string) => {
		if (type == 'accept') {
			router.push(`/game/gameCustom?CreateOrJoin=${'join'}&userId=${senderId}`);
		}
	};

	return (
		show ? <div className="max-w-xs z-[50000] right-2 rounded-xl shadow-lg bg-gray-800 border-gray-700 select-none relative" role="alert">
			<div className="flex p-4">
				<div className="flex-shrink-0">
					<Image unoptimized  width={100} height={100} className="inline-block h-8 w-8 rounded-full" src={default_img(avatar, fullname)} alt="Image Description" />
					<button type="button" onClick={() => setShow(false)} className="absolute top-3 right-0 end-3 inline-flex flex-shrink-0 justify-center items-center h-5 w-5 rounded-lg opacity-50 hover:opacity-100 focus:outline-none focus:opacity-100 text-white">
						<span className="sr-only">Close</span>
						<svg className="flex-shrink-0 w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
					</button>
				</div>
				<div className="ms-4 me-5">
					<h3 className="font-medium text-sm text-white">
						<span className="font-semibold">{title}</span> {type}
					</h3>
					<div className="mt-1 text-sm text-gray-400">
						{message}
					</div>
					<div className="mt-3 flex gap-2">
						{type != "challenge" ? < Link
							href={type == 'message' ? `/chat/${convId}` : `/user/${senderId}`}
							onClick={() => setShow(false)} className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent hover:text-blue-800 disabled:opacity-50 disabled:pointer-events-none focus:outline-none  text-blue-500 focus:text-blue-400">
							Relpy !
						</Link> :
							type == 'challenge' &&
							<button onClick={() => { setShow(false), handelGameEvents('accept') }} className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent hover:text-blue-800 disabled:opacity-50 disabled:pointer-events-none focus:outline-none  text-blue-500 focus:text-blue-400">
								accpet
							</button>
						}
					</div>
				</div>
			</div>
		</div > : null
	);
}
export default AlertPage;