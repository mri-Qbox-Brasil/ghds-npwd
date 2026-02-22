import React from 'react';
import { ChannelItemProps } from '@typings/darkchat';
import { useHistory } from 'react-router-dom';
import { useSetActiveDarkchatState } from '../../state/state';
import { Hash } from 'lucide-react';

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
      className="w-full group flex items-center gap-1.5 px-2 py-1.5 rounded-[4px] hover:bg-[#35373C] active:bg-[#3F4147] transition-colors"
    >
      <Hash size={18} strokeWidth={2} className="text-[#80848E] group-hover:text-[#DBDEE1] shrink-0 transition-colors" />
      <span className="text-[15px] font-medium text-[#80848E] group-hover:text-white transition-colors truncate text-left">
        {item.label ?? item.identifier}
      </span>
    </button>
  );
};
