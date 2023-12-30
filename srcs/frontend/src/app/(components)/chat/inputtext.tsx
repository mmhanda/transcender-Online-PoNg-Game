import React, { FC } from 'react';

interface InputTextProps {
  value?: string;
  setValue: (value: string) => void;
  placeholder: string;
  title: string;
  type: string;
}

const InputText: FC<InputTextProps> = ({
  value = '', // Set default value to an empty string if undefined
  setValue,
  placeholder,
  title,
  type,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return (
    <input
      type={type}
      className="focus:border-[#a970e3] border-transparent border-2 placeholder-[#ffffff] placeholder-opacity-50 rounded-[11px] w-full py-[1rem] bg-[#ebd4ff] bg-opacity-[.08] text-[10px] pl-10"
      title={title}
      placeholder={placeholder}
      value={value}
      onChange={handleChange}
    />
  );
};

export default InputText;