'use client'
import React, { FC } from 'react';
import {Chat} from '../ChatComponant';

type Params = string;

type Props = {
    params: {
        conversation: string;
    };
}

const convertations: FC<Props> = ({ params }) => {
    const conversation:Params = params.conversation ? params.conversation : '0';
    return <Chat id={conversation} />
}
export default convertations;
