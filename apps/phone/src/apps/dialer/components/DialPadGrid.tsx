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
        "flex flex-col items-center justify-center rounded-full h-[72px] w-[72px] transition-all",
        "bg-neutral-100/80 dark:bg-neutral-800/80 hover:bg-neutral-200 dark:hover:bg-neutral-700",
        "active:bg-neutral-300 dark:active:bg-neutral-600 active:scale-95",
        "text-neutral-900 dark:text-white shadow-sm"
      )}
    >
      <span className="text-3xl font-medium leading-none">{label}</span>
      {letters && (
        <span className="text-[9px] font-bold uppercase tracking-[2px] mt-0.5 opacity-50">
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
    <div className="grid grid-cols-3 gap-x-6 gap-y-4 justify-items-center w-full max-w-[280px] mx-auto">
      {dialButtons.map((btn) => (
        <ButtonItem
          key={btn.label}
          label={btn.label}
          letters={btn.letters}
          onClick={() => btn.label === '#' ? clear() : add(String(btn.label))}
        />
      ))}
    </div>
  );
};

export default DialGrid;
