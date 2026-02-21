import React, { FocusEventHandler, useRef, useState } from 'react';
import { RefreshCw, ChevronLeft, Globe, Lock } from 'lucide-react';
import { cn } from '@utils/cn';

interface BrowserControlsProps {
  setBrowser: (url: string) => void;
  browserUrl: string;
  reloadPage: () => void;
  browserHasHistory: boolean;
  goBack: () => void;
}

export const BrowserURLBar: React.FC<BrowserControlsProps> = ({
  goBack,
  reloadPage,
  browserHasHistory,
  browserUrl,
  setBrowser,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputState, setInputState] = useState('');
  const [isFocused, setFocus] = useState(false);

  const handleFocus: FocusEventHandler = (e) => {
    setInputState(browserUrl);
    setFocus(true);
  };

  const handleFocusOut: FocusEventHandler = (e) => {
    setFocus(false);
    setInputState(browserUrl);
  };

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setInputState(e.target.value);
  };

  const onEnter: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if ((e as any).code !== 'Enter') return;
    setBrowser(inputState);
    e.currentTarget.blur();
  };

  const styledUrl = browserUrl.replace(/(^\w+:|^)\/\//, '');
  const transformedUrl = isFocused ? inputState : styledUrl;

  return (
    <div className="flex items-center gap-2 p-3 bg-neutral-100/50 dark:bg-neutral-900/50 backdrop-blur-md border-b border-neutral-200 dark:border-white/10">
      <div className="flex items-center gap-1">
        <button
          onClick={() => reloadPage()}
          className="p-2 rounded-xl hover:bg-neutral-200 dark:hover:bg-white/5 text-neutral-500 dark:text-neutral-400 transition-all active:scale-90"
        >
          <RefreshCw size={18} className={cn(isFocused ? "text-primary animate-spin-once" : "")} />
        </button>
        {browserHasHistory && (
          <button
            onClick={() => goBack()}
            className="p-2 rounded-xl hover:bg-neutral-200 dark:hover:bg-white/5 text-neutral-500 dark:text-neutral-400 transition-all active:scale-90"
          >
            <ChevronLeft size={20} />
          </button>
        )}
      </div>

      <div className={cn(
        "flex-grow flex items-center gap-2 px-3 h-10 rounded-2xl border transition-all duration-300",
        isFocused
          ? "bg-white dark:bg-black border-primary ring-2 ring-primary/20 shadow-lg"
          : "bg-neutral-200/50 dark:bg-white/5 border-transparent hover:border-neutral-300 dark:hover:border-white/10"
      )}>
        <Lock size={14} className={cn("shrink-0", isFocused ? "text-primary" : "text-neutral-400")} />
        <input
          ref={inputRef}
          type="text"
          className="bg-transparent border-none outline-none w-full text-sm font-medium text-neutral-700 dark:text-neutral-200 placeholder-neutral-400"
          onChange={handleChange}
          onKeyDown={onEnter}
          value={transformedUrl}
          onFocus={handleFocus}
          spellCheck={false}
          onBlur={handleFocusOut}
          placeholder="Digite um endereço..."
        />
        {!isFocused && <Globe size={14} className="text-neutral-400/50 shrink-0" />}
      </div>
    </div>
  );
};
