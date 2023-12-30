'use client';
import { sendSocketData } from '@/app/tools/socket/socket';

const WebSocketComponent = () => {
    return (
        <div className=' m-auto w-max flex gap-3'>
            <button onClick={() => {
                sendSocketData({ inviteFriend: 5 }, 'Global_inviteFriend')
            }} className=' w-max h-max px-3 py2 bg-red-500 text-white rounded-2xl'>
                invet
            </button>

            <button className=' w-max h-max px-3 py2 bg-red-500 text-white rounded-2xl'>
                message
            </button>

            <button className=' w-max h-max px-3 py2 bg-red-500 text-white rounded-2xl' onClick={() => { sendSocketData({ challengeFriend: 17 }, 'Global_challengeFriend') }}>
                challenge
            </button>
        </div>
    );
};

export default WebSocketComponent;
