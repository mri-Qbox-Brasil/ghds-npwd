import React from 'react';
import { ChannelMessageProps } from '@typings/darkchat';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { cn } from '@utils/cn';

dayjs.extend(relativeTime);

const ChannelMessageBubble: React.FC<ChannelMessageProps> = (item) => {
  return (
    <div className={cn(
      "flex w-full mb-1 animate-in fade-in slide-in-from-bottom-2 duration-500",
      item.isMine ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "max-w-[85%] min-w-[100px] p-3 rounded-2xl shadow-sm flex flex-col gap-1.5",
        item.isMine
          ? "bg-indigo-600 text-white rounded-tr-none shadow-indigo-900/10"
          : "bg-neutral-900 text-neutral-200 rounded-tl-none border border-neutral-800/50 shadow-black/20"
      )}>
        <p className="text-sm font-medium leading-relaxed break-words">
          {item.message}
        </p>

        <div className={cn(
          "text-[9px] font-black uppercase tracking-wider flex items-center justify-end",
          item.isMine ? "text-indigo-200/60" : "text-neutral-500"
        )}>
          {dayjs.unix(item.createdAt).fromNow()}
        </div>
      </div>
    </div>
  );
};

export default ChannelMessageBubble;
