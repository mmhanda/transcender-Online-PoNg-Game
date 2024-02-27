// 'use client';
import axios from "axios";
import { useQuery } from 'react-query';
import { Localhost } from "../global";

export interface User {
    id: number;
    fullname: string;
    email: string;
    avatar: string;
    status: string;
    updatedAt?: string;
    table_style?: string;
    password?: boolean;
}

export async function whoami(): Promise<User> {
    const response = await axios.get(`${Localhost()}/users/me`);
    return response.data;
}
