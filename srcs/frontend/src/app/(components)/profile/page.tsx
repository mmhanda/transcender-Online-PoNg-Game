'use client'
import { ProfileComp } from './ProfileComp';

export interface User {
  id: string;
  fullname: string;
  email: string;
  avatar: string;
  status : string;
  playerStats: {
    wins: number;
    losses: number;
    draws: number;
    winRate: number;
    rank: number;
    rankTierId: number;
    playeTime: number;
    xp: number;
  },
  classment: number
  tier: {
    id: 1,
    name: string,
    image: string,
    minRank: number,
    maxRank: number,
    color: string,
    degree: number,
    createdAt: string
  }
}

const Profile = () => {
  return <ProfileComp userId={0} />
}

export default Profile;