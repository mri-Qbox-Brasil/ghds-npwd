import React from 'react';
import { Search } from 'lucide-react';
import { toggleKeys } from '@ui/components';

export function SearchButton({ handleClick }) {
  return (
    <div className="absolute bottom-[75px] right-[12px]">
      <button
        className="flex h-14 w-14 items-center justify-center rounded-full text-white bg-sky-500 hover:bg-sky-600 shadow-lg focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all active:scale-95"
        onClick={handleClick}
        onMouseUp={() => {
          toggleKeys(false);
        }}
      >
        <Search size={24} />
      </button>
    </div>
  );
}

export default SearchButton;
