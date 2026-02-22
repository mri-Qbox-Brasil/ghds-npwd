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
        "flex flex-col max-w-[75%]",
        isMine ? "items-end" : "items-start"
      )}>
        {/* Bubble */}
        <div className={cn(
          "relative px-3.5 py-2 rounded-[18px] text-[16px] leading-[1.3] transition-all",
          isMine
            ? "bg-[#007AFF] text-white rounded-br-sm"
            : "bg-[#E9E9EB] dark:bg-[#262628] text-black dark:text-white rounded-bl-sm",
          (isMessageImage || message.is_embed) && "p-1 rounded-[18px]"
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
            <div className="overflow-hidden rounded-[14px]">
              <PictureReveal>
                <PictureResponsive src={message.message} alt="attachment" />
              </PictureReveal>
            </div>
          ) : (
            <p className="whitespace-pre-wrap break-words font-normal">
              {message.message}
            </p>
          )}
        </div>

        {/* Subtle Timestamp */}
        <div className={cn(
          "text-[10px] mt-0.5 opacity-40 font-medium px-1",
          isMine ? "text-right" : "text-left"
        )}>
          {dayjs.unix(message.createdAt).format('HH:mm')}
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
