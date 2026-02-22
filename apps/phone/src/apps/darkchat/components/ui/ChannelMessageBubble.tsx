import React from 'react';
import { ChannelMessageProps } from '@typings/darkchat';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { cn } from '@utils/cn';
import { Ghost } from 'lucide-react';

dayjs.extend(relativeTime);

const ChannelMessageBubble: React.FC<ChannelMessageProps> = (item) => {
  return (
    <div className={cn(
      "group flex gap-3 py-0.5 px-1 rounded-[4px] hover:bg-[#2E3035] transition-colors animate-in fade-in duration-300",
    )}>
      {/* Avatar */}
      <div className={cn(
        "h-10 w-10 rounded-full flex items-center justify-center shrink-0 mt-0.5",
        item.isMine ? "bg-[#5865F2]" : "bg-[#80848E]"
      )}>
        <Ghost size={20} strokeWidth={2} className="text-white" />
      </div>

      {/* Content */}
      <div className="flex flex-col min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className={cn(
            "text-[14px] font-semibold",
            item.isMine ? "text-[#5865F2]" : "text-[#F2F3F5]"
          )}>
            Anônimo
          </span>
          <span className="text-[11px] text-[#80848E] font-normal">
            {dayjs.unix(item.createdAt).fromNow()}
          </span>
        </div>

        <p className="text-[15px] font-normal text-[#DBDEE1] leading-snug break-words">
          {item.message}
        </p>
      </div>
    </div>
  );
};

export default ChannelMessageBubble;
