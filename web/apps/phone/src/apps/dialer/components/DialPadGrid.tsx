import React, { useContext } from 'react';
import { DialInputCtx } from '../context/InputContext';
import { cn } from '@utils/cn';

interface ButtonItemProps {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  label: string | number;
  letters: string;
}

const ButtonItem: React.FC<ButtonItemProps> = ({ letters, label, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center rounded-full h-[78px] w-[78px] transition-all duration-200",
        "bg-[#E5E5EA] dark:bg-[#1C1C1E] hover:bg-[#D1D1D6] dark:hover:bg-[#2C2C2E] active:bg-[#BDBDBD] dark:active:bg-[#3A3A3C] active:scale-95",
        "text-black dark:text-white select-none"
      )}
    >
      <span className={cn(
        "font-normal leading-none",
        label === '*' || label === '#' ? "text-4xl mt-1" : "text-3xl"
      )}>{label}</span>
      {letters && (
        <span className="text-[10px] font-medium tracking-widest mt-0.5 opacity-40">
          {letters}
        </span>
      )}
    </button>
  );
};

export const DialGrid = () => {
  const { add, clear } = useContext(DialInputCtx);

  const dialButtons = [
    { label: 1, letters: '' },
    { label: 2, letters: 'ABC' },
    { label: 3, letters: 'DEF' },
    { label: 4, letters: 'GHI' },
    { label: 5, letters: 'JKL' },
    { label: 6, letters: 'MNO' },
    { label: 7, letters: 'PQRS' },
    { label: 8, letters: 'TUV' },
    { label: 9, letters: 'WXYZ' },
    { label: '*', letters: '' },
    { label: 0, letters: '+' },
    { label: '#', letters: '' },
  ];

  return (
    <div className="grid grid-cols-3 gap-x-6 gap-y-4 justify-items-center w-full max-w-[300px] mx-auto pb-6">
      {dialButtons.map((btn) => (
        <ButtonItem
          key={btn.label}
          label={btn.label}
          letters={btn.letters}
          onClick={() => add(String(btn.label))}
        />
      ))}
    </div>
  );
};

export default DialGrid;
