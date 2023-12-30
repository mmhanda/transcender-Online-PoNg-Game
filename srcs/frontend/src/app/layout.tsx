'use client'
import './globals.css'
import { QueryClient, QueryClientProvider } from 'react-query'
import MyApp from './app';
import React, { useEffect, useState } from 'react';
import AlertPage from './tools/alerts/AlertPage';
import { socket } from './tools/socket/socket';
import { usePathname } from 'next/navigation';
import Body from './Body';

interface DataNotifications {
  id?: number;
  senderId?: number;
  avatar: string;
  content: string;
  type: string;
  conversationId?: number;
  fullname?: string;
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const [me, setMe] = useState<any>(null)
  const Pathname = usePathname()
  const [queryClient] = React.useState(() => new QueryClient())
  const [notifications, setNotifications] = React.useState<Array<DataNotifications>>([])

  useEffect(() => {
    socket.connect()
    socket.on('inviteFriend', (data) => {
      const notification = {
        id: data.id,
        avatar: data.avatar,
        content: data.content,
        type: data.type,
        senderId: data.senderId,
        fullname : data.fullname
      }
      setNotifications([...notifications, notification])
    })
    socket.on('acceptFriend', (data) => {
      const notification = {
        id: data.id,
        avatar: data.avatar,
        content: data.content,
        type: data.type,
        senderId: data.senderId,
        fullname : data.fullname
      }
      setNotifications([...notifications, notification])
    })
    socket.on('challengeFriend', (data) => {
      const notification = {
        id: data.id,
        avatar: data.avatar,
        content: data.content,
        type: data.type,
        senderId: data.senderId,
        fullname : data.fullname
      }
      setNotifications([...notifications, notification])
    })
    socket.on('Global_message', (data) => {
      const notification = {
        avatar: data.avatar,
        content: data.content,
        type: data.type,
        conversationId: data.conversationId,
        fullname : data.fullname
        
      }
      setNotifications([...notifications, notification])
    })
    return () => {
      socket.off('challengeFriend')
      socket.off('acceptFriend')
      socket.off('inviteFriend')
      socket.off('Global_message')
      // socket.disconnect()
    }
  }, [notifications, setNotifications, Pathname, me])

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title >BallBattle!</title>
      </head>
      <body className='relative w-full h-full'>
        {
          notifications.length > 0 ?
            <div className=' fixed z-50 right-0 top-[78px]'>
              <div className="flex flex-col h-[240px] gap-2 overflow-auto">
                {
                  notifications.map((notification, index) => {
                    return (
                      <div key={index + "-" + notification?.id}>
                        <AlertPage title={notification.type} message={notification.content} type={notification?.type} senderId={notification?.senderId} convId={notification?.conversationId} avatar={notification?.avatar} fullname={notification?.fullname} />
                      </div>

                    )
                  })
                }
              </div>
            </div> : null
        }
        <QueryClientProvider client={queryClient}>
          <Body Pathname={Pathname} setter={setMe}>
            {children}
          </Body>
        </QueryClientProvider>
      </body>
    </html>
  )
}

