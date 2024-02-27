'use client';
import { use, useEffect, useState } from "react";
import SentInput from "./sentInput";
import {Loading} from "../Loading/Loading";
import Image from "next/image";
import axios from "axios";
import Messages from "./messages";
import { Localhost } from "@/app/tools/global";
import { default_img } from "@/app/tools/global";
import { socket, sendSocketData } from "@/app/tools/socket/socket";
import './chatStyle.css';
import Details from "./Details";
import Link from "next/link";
import { usePathname, useRouter } from 'next/navigation';
import { useQueryClient, useQuery } from "react-query";
import PretectedRoom from "./ProtectedRoom";

interface DataMessages {
	setIdConv: any;
	// setUsers?: any;
	idConv?: string;
	seter?: any;
	user?: User;
	infos: any;
}
interface Message {
	id: number;
	content: string;
	status: string;
	senderId: number;
	createdAt: string;
	sender: {
		id: number;
		avatar: string;
		fullname: string;
		memberId?: string;
		status?: string;
	}
	me: boolean;
}

export interface User {
	id: number;
	fullname: string;
	avatar?: string;
}


const ChatMain: React.FC<DataMessages> = ({ setIdConv, idConv, seter, user, infos }) => {
	const [messages, setmessages] = useState(Array<Message>);
	const [showDetails, setShowDetails] = useState<boolean>(false);
	const [details, setDetails] = useState({} as any);
	const [inputValue, setInputValue] = useState<string | undefined>("");
	const client = useQueryClient();
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const router = useRouter();
	const path = usePathname();

	const { data, isLoading, error, status, refetch } = useQuery({
		queryKey: ['GetConversationId', idConv],
		queryFn: async () => {
			axios.defaults.withCredentials = true;
			if (idConv == '0') return;
			const res = await axios.get(`${Localhost()}/conversation/${idConv}`);
			return res.data.data;
		}
	});
	useEffect(() => {
		if (status == "success" && data) {
			setDetails(data);
			if (data.messages)
				setmessages(data.messages);
		}

	}, [data, status]);

	useEffect(() => {
		if (details != undefined) {
			if (details.UserStatus == 'requested') {
				setShowPassword(true);
			}
		}
	}, [details]);

	useEffect(() => {
		socket.on('message', (data) => {
			if (data.id == idConv) {

				const message: Message = {
					id: data.id,
					content: data.content,
					status: data.status,
					senderId: data.senderId,
					createdAt: data.createdAt,
					sender: {
						id: data.senderId,
						avatar: data.avatar,
						fullname: data.fullname
					},
					me: false
				}
				setmessages(prevState => [...prevState, message]);
			}
		})
		return () => {
			socket.off('message');
			setShowDetails(false)
		}

	}, [idConv, messages]);
	const sentMsg = (msg: (string | undefined)) => {
		if (msg == undefined || msg === '' || msg.replace(/\s/g, '').length === 0) return;
		else {
			setmessages(
				prevState => [...prevState, {
					id: Date.now(),
					content: msg,
					status: "sent",
					senderId: 0,
					createdAt: new Date().toISOString(),
					sender: {
						id: 0,
						avatar: "",
						fullname: ""
					},
					me: true
				}]
			)
		}
		try {
			sendSocketData({ content: msg, receiverId: 0, conversationId: idConv }, 'Chat_message');
			sendSocketData({ content: msg, receiverId: user?.id, conversationId: idConv }, 'Global_Message');
		} catch (error) {
		}
		setInputValue('');
	}



	
	if (isLoading) return <Loading show={true} />
	// if (isLoading) return <Loading show={true} />
	if (details.UserStatus == 'baned') return <div className=" flex justify-center items-center w-full text-red-500"> You don{"'"}t have right acces to this chat</div>

	if (details.UserStatus == 'requested' && idConv != '0')
		return <PretectedRoom channelStatus={details.status} id={idConv} show={showPassword} setShow={setShowPassword} />
	else
		return (
			<div className="relative flex flex-col w-full h-full">
				<Details show={showDetails} setShow={setShowDetails} details={details} />
				{
					idConv != '0' ?
						<div className=" min-h-[4.3rem] h-[4.3rem] relative w-full mb-1 bg-white bg-opacity-[.075] flex px-2 select-none">
							<div className="flex items-center relative h-full justify-center">
								<div
								onClick={() => {
									setIdConv('0');
									seter(0);
									if (path != "/chat") router.push("/chat");
								}}
								className="cursor-pointer mr-2 w-[32px] h-[32px] bg-white bg-opacity-0 hover:bg-opacity-10 rounded-full flex justify-center">
									<svg width="16" fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M7.4 273.4C2.7 268.8 0 262.6 0 256s2.7-12.8 7.4-17.4l176-168c9.6-9.2 24.8-8.8 33.9 .8s8.8 24.8-.8 33.9L83.9 232 424 232c13.3 0 24 10.7 24 24s-10.7 24-24 24L83.9 280 216.6 406.6c9.6 9.2 9.9 24.3 .8 33.9s-24.3 9.9-33.9 .8l-176-168z" /></svg>
								</div>
								{
									infos.type == "direct" ?
										<Image unoptimized src={default_img(infos?.users?.avatar, user?.fullname)} alt="Picture of the author" priority={true} quality={100} width={100} height={100} className="w-[42px] rounded-full mr-3" />
										:
										<Image unoptimized src={default_img(infos?.avatar, "%2B" + infos?.count, "A970E3", "fff")} alt="Picture of the author" priority={true} quality={100} width={100} height={100} className="w-[42px] rounded-full mr-3" />
								}
								<div className="w-[180px] sm:w-[240px] md:w-[280px] lg:w-[300px]">
									{
										infos.type == "direct" ?
											<div className="text-white text-md font-semibold">{infos.users.fullname}</div>
											:
											<div className="text-white text-md font-semibold">{infos.name}</div>
									}
									<div className="text-white text-xs flex items-center gap-1 overflow-hidden whitespace-nowrap text-ellipsis">
										{
											infos.type == "direct" ?
												<>
													<span className={` ${infos.users.status == 'online' ? 'bg-green-500':infos.users.status== 'offline' ? ' bg-red-500' : ' bg-yellow-500'} rounded-full w-2 h-2`}></span>
													<span className="text-xs text-white opacity-60">
														{
															infos.users.status
														}
													</span>
												</>
												:
												<span className="text-xs text-white opacity-60 truncate">{infos.description}</span>
										}
									</div>
								</div>
							</div>
							<div className="flex flex-1 justify-end items-center pr-2">
								{
									(infos.type == "group") &&
									<div onClick={() => setShowDetails(true)} className="flex items-center cursor-pointer details-btn z-[1]">
										{
											details?.members?.length > 0 &&
											details?.members.slice(0, 4).map((member: any, index: number) => {
												return (
													<Image unoptimized  src={default_img(member.user.avatar, member.user.fullname)} alt="Picture of the author" priority={true} quality={100} width={100} height={100} className={`w-[34px] h-[34px] min-w-[34px] min-h-[34px] rounded-full -ml-2 border-[1px] border-[#e0c3fc] pointer-events-none `} style={{ zIndex: details?.members.length - index }} key={details?.members?.id + "_" + index} />
												)
											})

										}
										<Image unoptimized  src={default_img(undefined, "%2B", "fff", "aa70e3", "0.8")} alt="Picture of the author" priority={true} quality={100} width={100} height={100} className={`w-[30px] h-[30px] min-w-[30px] min-h-[30px] rounded-full -ml-2 pointer-events-none `} style={{ zIndex: -1 }} key={details?.members?.length + 1 + "_"} />
									</div>
								}
							</div>
						</div>
						: null
				}
				{
					// (details.status != "banned" && details.isMe != 'true') ?
					<Messages details={details} type={infos.type} msgs={messages} />
					// : <div>You Banned</div>
				}
				{
					idConv != '0' && details.UserStatus != 'baned' && details.UserStatus != 'muted' &&
					// (details.status != "banned" && details.isMe != 'true') &&
					<div className=" absolute flex items-center justify-center w-full self-center px-2 py-2 bottom-0">
						<SentInput setValue={setInputValue} value={inputValue} sentMsg={sentMsg} />
						<label htmlFor="send-message" className="flex justify-center items-center absolute right-[20px]" onClick={() => { sentMsg(inputValue) }} >
							<Image unoptimized  src="/Send.svg" alt="Picture of the author" priority={true} quality={75} width={100} height={100} className=" h-[1rem] w-[1rem] cursor-pointer" />
						</label>
					</div>
				}
			</div>
		)

}

export default ChatMain