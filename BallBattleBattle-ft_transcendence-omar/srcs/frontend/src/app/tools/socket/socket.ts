import io from 'socket.io-client';
import { Localhost } from '../global';


const socket = io(`${Localhost()}/global`, {
  withCredentials: true
})

socket.on('connect', () => {
})


socket.on('disconnect', () => {
  socket.disconnect();
})


const sendSocketData = (data: any, type: string) => {
  (socket) && socket.emit(type, data);
};

export {
  socket,
  sendSocketData,
};