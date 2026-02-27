import React, { memo, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { usePhone } from '@os/phone/hooks/usePhone';
import { getNewLineCount } from '../../utils/message';
import { NPWDTextarea } from '@ui/components/Input';

export const TweetMessage = ({ modalVisible, message, handleChange, onEnter }) => {
  const textFieldInputRef = useRef<HTMLTextAreaElement>(null);
  const { ResourceConfig } = usePhone();
  const [t] = useTranslation();

  const { characterLimit, newLineLimit } = ResourceConfig.twitter;

  useEffect(() => {
    textFieldInputRef.current && textFieldInputRef.current.focus();
  }, [modalVisible]);

  if (!ResourceConfig) return null;

  let errorMessage = null;

  const overCharacterLimit = message.trim().length > characterLimit;
  const characterWarningPrompt = `${t('TWITTER.TWEET_MESSAGE_CHAR_LIMIT')} (${characterLimit})`;

  const overNewLineLimit = getNewLineCount(message) > newLineLimit;
  const newLineWarningPrompt = `${t('TWITTER.TWEET_MESSAGE_NEW_LINE_LIMIT')} (${newLineLimit})`;

  if (overCharacterLimit) {
    errorMessage = characterWarningPrompt;
  } else if (overNewLineLimit) {
    errorMessage = newLineWarningPrompt;
  }

  // Handle enter key to submit tweet
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (overNewLineLimit || overCharacterLimit) return;

    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      onEnter();
    }
  };

  return (
    <div className="w-full flex flex-col gap-1">
      <NPWDTextarea
        value={message}
        onChange={(e) => handleChange(e.currentTarget.value)}
        ref={textFieldInputRef}
        onKeyDown={handleKeyDown}
        placeholder={t('TWITTER.TWEET_MESSAGE_PLACEHOLDER') as unknown as string}
        className="min-h-[100px] w-full resize-none rounded-md border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 p-3 text-base text-neutral-900 dark:text-white outline-none focus:ring-2 focus:ring-sky-500 transition-all"
      />
      {errorMessage && (
        <span className="text-xs text-red-500 px-1 font-medium">{errorMessage as unknown as string}</span>
      )}
    </div>
  );
};

export default memo(TweetMessage);
