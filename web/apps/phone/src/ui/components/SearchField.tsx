import React from 'react';
import { Search } from 'lucide-react';
import { Input } from './ui/input';
import { cn } from '@utils/css';

interface SearchFieldProps {
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  value: string;
  placeholder?: string;
  className?: string;
}

const DEFAULT_PROPS = {
  onChange: () => { },
  value: '',
  placeholder: 'Search...',
};

export const SearchField: React.FC<SearchFieldProps> = ({
  value,
  onChange,
  placeholder,
  className,
} = DEFAULT_PROPS) => {
  return (
    <div className={cn("relative flex h-[60px] w-full items-center justify-center rounded-md bg-white/20 px-2 transition-colors hover:bg-white/30 dark:bg-neutral-800/50 dark:hover:bg-neutral-800/80", className)}>
      <div className="pointer-events-none absolute left-3 flex h-full items-center justify-center">
        <Search className="h-5 w-5 text-neutral-500 dark:text-neutral-400" />
      </div>
      <Input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-label="search"
        className="h-10 w-full rounded-md border-0 bg-transparent pl-10 pr-2 transition-all duration-300 focus-visible:ring-0 focus-visible:ring-offset-0"
      />
    </div>
  );
};

export default SearchField;
