'use client'
import React, { FC } from 'react';
import { ProfileComp } from '../../profile/ProfileComp';


interface Props {
    params: {
        user: number;
    };
}

const user: FC<Props> = ({ params }) => {
    const user  = params.user;
    return (<ProfileComp userId={user} />);
}



export default user;
