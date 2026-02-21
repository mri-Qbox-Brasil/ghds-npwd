import React from 'react';
import { ChannelItemProps } from '@typings/darkchat';
import { useHistory } from 'react-router-dom';
import { useSetActiveDarkchatState } from '../../state/state';
import { Hash, ChevronRight } from 'lucide-react';
import { cn } from '@utils/cn';

export const ChannelItem: React.FC<ChannelItemProps> = (item) => {
  const history = useHistory();
  const setActiveConversation = useSetActiveDarkchatState();

  const handleGoToConversation = () => {
    setActiveConversation(item);
    history.push(`/darkchat/conversation/${item.id}`);
  };

  return (
    <button
      onClick={handleGoToConversation}
      className="w-full group flex items-center justify-between p-4 mb-2 bg-neutral-900/40 hover:bg-neutral-900 transition-all rounded-2xl border border-transparent hover:border-neutral-800"
    >
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-neutral-800 text-neutral-500 group-hover:text-indigo-400 group-hover:bg-indigo-400/10 transition-all duration-500">
          <Hash size={24} strokeWidth={2.5} />
        </div>
        <div className="flex flex-col items-start truncate min-w-0">
          <span className="font-bold text-sm text-neutral-200 group-hover:text-white transition-colors truncate">
            {item.label ?? item.identifier}
          </span>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-600 italic">
            Canal Anônimo
          </span>
        </div>
      </div>
      <div className="text-neutral-700 group-hover:text-indigo-400 transition-colors">
        <ChevronRight size={20} strokeWidth={3} />
      </div>
    </button>
  );
};
