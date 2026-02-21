import React from 'react';
import { ChannelMessageProps } from '@typings/darkchat';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { PictureReveal } from '@ui/components/PictureReveal';
import { PictureResponsive } from '@ui/components/PictureResponsive';
import { cn } from '@utils/cn';

dayjs.extend(relativeTime);

const ChannelImageBubble: React.FC<ChannelMessageProps> = (item) => {
  return (
    <div className={cn(
      "flex w-full mb-2 animate-in fade-in zoom-in-95 duration-700",
      item.isMine ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "max-w-[85%] p-1.5 rounded-[22px] shadow-lg flex flex-col gap-1.5",
        item.isMine
          ? "bg-indigo-600 rounded-tr-none shadow-indigo-900/20"
          : "bg-neutral-900 rounded-tl-none border border-neutral-800 shadow-black/40"
      )}>
        <div className="rounded-2xl overflow-hidden border border-white/5">
          <PictureReveal>
            <PictureResponsive src={item.message} alt="Darkchat image" className="object-cover max-h-64" />
          </PictureReveal>
        </div>

        <div className={cn(
          "text-[9px] font-black uppercase tracking-wider px-2 pb-1 flex items-center justify-end",
          item.isMine ? "text-indigo-200/60" : "text-neutral-500"
        )}>
          {dayjs.unix(item.createdAt).fromNow()}
        </div>
      </div>
    </div>
  );
};

export default ChannelImageBubble;
