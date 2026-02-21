import React, { memo } from 'react';
import { Image, Smile } from 'lucide-react';
import { usePhone } from '@os/phone/hooks/usePhone';
import { NPWDButton } from '@npwd/keyos';

export const IconButtons = ({ onImageClick, onEmojiClick }) => {
  const { ResourceConfig } = usePhone();

  if (!ResourceConfig) return null;
  const { enableImages, enableEmojis } = ResourceConfig.twitter;

  return (
    <div className="flex flex-row gap-1 px-1">
      {enableImages && (
        <NPWDButton
          onClick={onImageClick}
          size="icon"
          variant="ghost"
          className="rounded-full text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-500/10"
        >
          <Image size={20} />
        </NPWDButton>
      )}
      {enableEmojis && (
        <NPWDButton
          onClick={onEmojiClick}
          size="icon"
          variant="ghost"
          className="rounded-full text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-500/10"
        >
          <Smile size={20} />
        </NPWDButton>
      )}
    </div>
  );
};

export default memo(IconButtons);
