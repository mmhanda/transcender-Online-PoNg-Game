'use client'
import Navigation from './(components)/Navigation/Navigate'
import Head from './(components)/Navigation/head'
import { useEffect, useState } from 'react'
import Nav from './(components)/Default/Nav'
import HeroSecton from './(components)/HeroSection/heroSection'
import {Loading} from './(components)/Loading/Loading'
import axios from 'axios'
import { User } from './tools/fetch/api'
import { useQuery, useQueryClient } from 'react-query'
import Error from './tools/error'
import { Localhost } from './tools/global'
import Background from './(components)/Default/Background';
import { useRouter } from 'next/navigation';
import Settings from './(components)/Settings/setting'
import Modal2Fa from './(components)/modalAuth/Active2Fa'

const MyApp = ({ children, Pathname, setter }: { children: React.ReactNode, Pathname: string, setter:any }) =>
{
    const [show, setShow] = useState(false)
    const [show2FA, setShow2FA] = useState(false)
    const client = useQueryClient();
    const [isLogged, setIsLogged] = useState(false)
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(false)
    const router = useRouter();
    
    const { data, isLoading, error, status } = useQuery({
        queryKey: ['main-login'],
        queryFn: async () => {
            axios.defaults.withCredentials = true;
            try {
                return await axios.get(`${Localhost()}/users/me`).then(res => {
                    console.log("Me called")
                    if ('status' in res && res.status == 230)
                    {
                        setter(null)
                        setIsLogged(false)
                        if (Pathname != '/')
                            router.push('/');
                    }
                    return res.data.data
                });
            } catch (error){}
        }
    });
    

    useEffect(() => {
        client.invalidateQueries('leaderBoard')
        client.invalidateQueries('main-login')
    }, [isLogged, client])

    useEffect(() => {
        if (data && 'require2fa' in data)
            setShow2FA(true)
        if (user != data && data && 'id' in data) {
            setter(data)
            setUser(data)
            if (data?.updatedAt == null)
            {
                setShow(true)
            }
            if (!isLogged)
                setIsLogged(true)
        }
        else if (isLoading == false && !data && (Pathname != '/' || Pathname.length == 0)) {
            setter(null)
            setIsLogged(false)
            if (Pathname != '/')
                router.push('/');
        }
       
    }, [data, isLogged, user, Pathname, isLoading, setter, router])

    if (isLoading) {
        return (
            <div className=' absolute top-0 bottom-0 right-0 left-0 flex w-full h-screen justify-center items-center'>
                <Loading show={true} />
            </div>
        );
    }
    const handleShow = () => {
        setShow(!show)
    }

    if (error) return <Error />;

    return (
        <div>
            <Background isLogged={isLogged} />
            {(isLogged && show) && <Settings handlshow={handleShow} />}
            <div className={`relative w-full h-full ${show && 'z-[-1]'}`}>
                <Modal2Fa isOpen={show2FA} setIs2FaModalOpen={setShow2FA} />
                <div className="flex w-full ">
                    <div className="flex flex-col w-full h-full">
                        {
                            isLogged ? <Head show={handleShow} login={isLogged} user={user} setLogin={setIsLogged} setLoading={setLoading} /> : <Nav setLogin={setIsLogged} />
                        }
                        {
                            !isLogged && <div className=' container md:m-auto px-4'><HeroSecton /></div>
                        }
                        <div className={!isLogged ? 'container md:m-auto px-4 flex  w-screen mx-auto' : 'flex dashboard relative mt-[70px] '}>
                            {
                                isLogged ? <Navigation show={handleShow} /> : null
                            }
                            <main className={!isLogged ? 'flex flex-col relative' : 'flex flex-col flex-grow md:ml-[75px] relative ' + ' my-0'}>
                                {children}
                            </main>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MyApp;