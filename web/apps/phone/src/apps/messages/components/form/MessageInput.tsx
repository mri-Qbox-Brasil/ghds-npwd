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
    <div className="px-2 py-2 pb-5 bg-white/80 dark:bg-black/80 backdrop-blur-xl flex items-end gap-1 animate-in slide-in-from-bottom duration-500">
      {/* Attachment Button */}
      <div className="flex items-center justify-center mb-0.5">
        <button
          onClick={onAddImageClick}
          className="p-2 rounded-full text-neutral-400 hover:text-blue-500 transition-all active:scale-90"
        >
          <Plus size={24} className="stroke-[2px]" />
        </button>
      </div>

      {/* Input Pill */}
      <div className="flex-1 min-w-0 bg-neutral-100 dark:bg-[#1C1C1E] border border-neutral-300/50 dark:border-white/10 rounded-[20px] px-3 py-1 flex items-end transition-all">
        <NPWDTextarea
          rows={1}
          className="bg-transparent border-none focus:ring-0 text-[16px] py-1 max-h-32 min-h-[32px] resize-none scrollbar-hide text-neutral-900 dark:text-white placeholder:text-neutral-400 font-normal leading-tight"
          onKeyDown={handleKeyPress}
          value={message}
          onChange={handleChange}
          placeholder="Message"
        />

        {/* Action Button inside Pill */}
        <div className="mb-1 ml-1">
          {message.trim().length > 0 ? (
            <button
              onClick={handleSubmit}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-500 text-white transition-all active:scale-90"
            >
              <SendHorizontal size={16} fill="white" />
            </button>
          ) : (
            voiceEnabled && (
              <button
                onClick={onVoiceClick}
                className="flex items-center justify-center p-1 text-neutral-400 hover:text-blue-500 transition-colors"
              >
                <Mic size={20} />
              </button>
            )
          )}
        </div>
      </div>

      {/* Right spacing to match iOS more closely if needed, or just padding */}
      <div className="w-1" />
    </div>
  );
};

export default MessageInput;
