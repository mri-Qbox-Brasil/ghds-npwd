import React, { useState } from 'react';
import { Message } from '@typings/messages';
import { PictureResponsive } from '@ui/components/PictureResponsive';
import { PictureReveal } from '@ui/components/PictureReveal';
import { useMyPhoneNumber } from '@os/simcard/hooks/useMyPhoneNumber';
import MessageBubbleMenu from './MessageBubbleMenu';
import { useSetSelectedMessage } from '../../hooks/state';
import MessageEmbed from '../ui/MessageEmbed';
import { useContactActions } from '../../../contacts/hooks/useContactActions';
import dayjs from 'dayjs';
import { MoreHorizontal } from 'lucide-react';
import { cn } from '@utils/cn';

const isImage = (url) => {
  return /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|png|jpeg|gif|webp)/g.test(url);
};

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { getContactByNumber } = useContactActions();
  const setSelectedMessage = useSetSelectedMessage();

  const openMenu = () => {
    setSelectedMessage(message);
    setMenuOpen(true);
  };

  const myNumber = useMyPhoneNumber();
  const isMine = message.author === myNumber;

  let parsedEmbed;
  if (message?.embed) {
    try {
      parsedEmbed = JSON.parse(message?.embed);
    } catch (e) {
      parsedEmbed = null;
    }
  }

  const getContactDisplay = () => {
    const contact = getContactByNumber(message.author);
    return contact?.display || message.author;
  };

  const isMessageImage = isImage(message.message);

  return (
    <div className={cn(
      "flex flex-col w-full mb-2 animate-in fade-in slide-in-from-bottom-2 duration-300",
      isMine ? "items-end pr-2" : "items-start pl-2"
    )}>
      {!isMine && (
        <span className="text-[11px] font-bold text-neutral-400 dark:text-neutral-500 ml-3 mb-1 uppercase tracking-wider">
          {getContactDisplay()}
        </span>
      )}

      <div className={cn(
        "flex items-center max-w-[85%] group",
        isMine ? "flex-row" : "flex-row-reverse"
      )}>
        {/* Menu Trigger */}
        <button
          onClick={openMenu}
          className={cn(
            "p-2 text-neutral-300 opacity-0 group-hover:opacity-100 transition-all hover:text-neutral-500 dark:hover:text-neutral-400 active:scale-90",
            isMine ? "mr-1" : "ml-1"
          )}
        >
          <MoreHorizontal size={16} />
        </button>

        {/* Bubble */}
        <div className={cn(
          "relative px-4 py-2.5 rounded-2xl text-[15px] leading-snug shadow-sm transition-all",
          isMine
            ? "bg-blue-500 text-white rounded-tr-sm"
            : "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 rounded-tl-sm",
          (isMessageImage || message.is_embed) && "p-1 rounded-2xl"
        )}>
          {message.is_embed && parsedEmbed ? (
            <MessageEmbed
              type={parsedEmbed.type}
              embed={parsedEmbed}
              isMine={isMine}
              message={message.message}
              openMenu={openMenu}
            />
          ) : isMessageImage ? (
            <div className="overflow-hidden rounded-xl border border-black/5 dark:border-white/5 shadow-inner">
              <PictureReveal>
                <PictureResponsive src={message.message} alt="attachment" />
              </PictureReveal>
            </div>
          ) : (
            <p className="whitespace-pre-wrap break-words font-medium">
              {message.message}
            </p>
          )}

          {/* Timestamp inside bubble for better look */}
          <div className={cn(
            "text-[9px] mt-1 opacity-60 font-bold",
            isMine ? "text-right text-blue-100" : "text-left text-neutral-400"
          )}>
            {dayjs.unix(message.createdAt).format('HH:mm')}
          </div>
        </div>
      </div>

      <MessageBubbleMenu
        message={message}
        isImage={isMessageImage}
        open={menuOpen}
        handleClose={() => setMenuOpen(false)}
      />
    </div>
  );
};

export default MessageBubble;
