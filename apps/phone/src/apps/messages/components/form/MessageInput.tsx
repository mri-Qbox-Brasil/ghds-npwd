import React, { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NPWDTextarea } from '@ui/components/Input';
import { useMessageAPI } from '../../hooks/useMessageAPI';
import { MessageConversation } from '@typings/messages';
import useMessages from '../../hooks/useMessages';
import { useWordFilter } from '@os/wordfilter/hooks/useWordFilter';
import { Image, Mic, SendHorizontal, Plus } from 'lucide-react';
import { cn } from '@utils/cn';

interface IProps {
  onAddImageClick(): void;
  onVoiceClick: () => void;
  messageConversation: MessageConversation | undefined;
  messageGroupName: string | undefined;
  voiceEnabled: boolean;
}

const MessageInput = ({
  messageConversation,
  onAddImageClick,
  onVoiceClick,
  voiceEnabled,
}: IProps) => {
  const [t] = useTranslation();
  const [message, setMessage] = useState('');
  const { sendMessage } = useMessageAPI();
  const { activeMessageConversation } = useMessages();
  const { clean } = useWordFilter();

  const handleSubmit = async () => {
    if (message.trim()) {
      await sendMessage({
        conversationId: messageConversation.id,
        conversationList: activeMessageConversation.conversationList,
        message: clean(message),
        tgtPhoneNumber: messageConversation.participant,
      });
      setMessage('');
    }
  };

  const handleKeyPress = async (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      event.stopPropagation();
      await handleSubmit();
    }
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setMessage(e.currentTarget.value);
  };

  if (!messageConversation?.id) return null;

  return (
    <div className="px-4 py-3 bg-background/95 backdrop-blur-md border-t border-neutral-100 dark:border-neutral-800 flex items-end gap-2 animate-in slide-in-from-bottom duration-500">
      <div className="flex items-center self-center">
        <button
          onClick={onAddImageClick}
          className="p-2.5 rounded-full text-neutral-400 hover:text-blue-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all active:scale-90"
        >
          <Plus size={24} />
        </button>
      </div>

      <div className="flex-1 min-w-0 bg-neutral-100 dark:bg-neutral-800 rounded-[22px] px-4 py-1.5 flex items-end border border-transparent focus-within:border-blue-500/30 transition-all shadow-inner">
        <NPWDTextarea
          rows={1}
          className="bg-transparent border-none focus:ring-0 text-[15px] py-1 max-h-32 min-h-[32px] resize-none scrollbar-hide text-neutral-900 dark:text-white placeholder:text-neutral-400 font-medium leading-tight"
          onKeyDown={handleKeyPress}
          value={message}
          onChange={handleChange}
          placeholder={t('MESSAGES.NEW_MESSAGE') as string}
        />

        {voiceEnabled && message.trim().length === 0 && (
          <button
            onClick={onVoiceClick}
            className="p-2 -mr-1 text-neutral-400 hover:text-blue-500 transition-colors"
          >
            <Mic size={20} />
          </button>
        )}
      </div>

      <div className="flex items-center self-center">
        <button
          onClick={handleSubmit}
          disabled={!message.trim()}
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-full transition-all active:scale-90 shadow-md",
            message.trim()
              ? "bg-blue-500 text-white shadow-blue-500/20 hover:bg-blue-600 scale-100"
              : "bg-neutral-200 dark:bg-neutral-800 text-neutral-400 pointer-events-none scale-90"
          )}
        >
          <SendHorizontal size={22} />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
