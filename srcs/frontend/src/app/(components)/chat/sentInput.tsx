import React from 'react';
interface SentInputProps {
    setValue?: (value: string|undefined) => void;
    value: string | undefined;
    sentMsg: any;
}

const SentInput = ({ setValue, value , sentMsg }: SentInputProps) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        (setValue) && setValue(e.target.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            if (value === '' || value == undefined) return;
            if (value.replace(/\s/g, '').length === 0) return;
            (setValue) && setValue((e.target as HTMLInputElement).value);
            sentMsg((e.target as HTMLInputElement).value);
            (setValue) && setValue('');
        }
    }

    return (

        <input id="send-message"
            maxLength={1024}
            type="text"
            value={value}
            onChange={(e) => {
                (setValue) && setValue(e.target.value);
            }}
            onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    handleKeyDown(e)
                }
            }}
            placeholder="Message"
            className=" bg-white placeholder-[#ffffffaa] bg-opacity-[.07] h-[42px] w-full rounded-sm border border-transparent focus:border-[#ffffff2e]  pl-[10px] pr-[42px] text-[12px] flex" />

    );
}

export default SentInput;