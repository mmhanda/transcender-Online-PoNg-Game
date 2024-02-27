'use client'
import LeaderBoard from '@/app/(components)/LeaderBoard/leaderBoard';
import Matches from '@/app/(components)/matches/matches';
import Rooms from '@/app/(components)/Rooms/Rooms';
import Footer from '@/app/(components)/Default/footer';
import { useQuery } from 'react-query';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Localhost } from './tools/global';
interface peer {
  id: number;
  avatar: string;
  fullname: string;
  createdAt: string;
}

interface leader {
  rank: number;
  user: peer;
}

export default function Home() {
  const [leader, setLeader] = useState([] as leader[])
  const [isLogin, setLogin] = useState<boolean>(false)
  const [hotCH, setHotCH] = useState([] as any[])


  const { data, isLoading, error, status } = useQuery({
    queryKey: ['leaderBoard'],
    queryFn: async () => {
      axios.defaults.withCredentials = true;
      try {
        const res = await axios.get(`${Localhost()}/global`, { headers: { 'accept': "*/*" } });
        return (res.data);
      } catch (error) {
      }
    }
  })

  useEffect(() => {
    if (data && 'topPlayers' in data && data.topPlayers)
      setLeader(data.topPlayers)
    if (data && 'isLogged' in data && data.isLogged)
      setLogin(data.isLogged)
    if (data && 'hotChaneels' in data && data.hotChaneels)
      setHotCH(data.hotChaneels.data)
  }, [data])

  if (isLoading)
    return null
  else
    return (
      <>
        {
          leader.length ?
            <LeaderBoard leader={leader} limit={20} logged={isLogin} /> : null
        }
        <Matches isLogin={isLogin} />
        {
          hotCH.length ?
            <Rooms logged={isLogin} hotCH={hotCH} /> : null
        }
        <Footer />
      </>
    )
}
