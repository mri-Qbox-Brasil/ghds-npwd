import React, { useState } from 'react';
import { Send, Image as ImageIcon, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useDarkchatAPI } from '../../hooks/useDarkchatAPI';
import { useActiveDarkchatValue } from '../../state/state';
import { useMyPhoneNumber } from '@os/simcard/hooks/useMyPhoneNumber';
import { useModal } from '../../hooks/useModal';
import { cn } from '@utils/cn';

const ChannelInput: React.FC = () => {
  const [message, setMessage] = useState<string>('');
  const [t] = useTranslation();
  const { sendMessage } = useDarkchatAPI();
  const { id: channelId } = useActiveDarkchatValue();
  const phoneNumber = useMyPhoneNumber();
  const { setModalVisible } = useModal();

  const handleSendMessage = () => {
    if (!message.trim()) return;
    sendMessage({
      channelId,
      message,
      phoneNumber,
      type: 'text',
    });
    setMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex items-end gap-2 animate-in slide-in-from-bottom-4 duration-700">
      <button
        onClick={() => setModalVisible(true)}
        className="h-12 w-12 shrink-0 flex items-center justify-center rounded-2xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all active:scale-90"
      >
        <ImageIcon size={20} strokeWidth={2.5} />
      </button>

      <div className="relative flex-1 group">
        <textarea
          rows={1}
          className="w-full min-h-[48px] max-h-32 p-3.5 pr-12 bg-neutral-900 border border-neutral-800 rounded-2xl text-sm font-bold text-white placeholder:text-neutral-600 focus:ring-1 focus:ring-indigo-500/50 transition-all resize-none scrollbar-hide"
          placeholder={t('DARKCHAT.MESSAGE_PLACEHOLDER') as string || "Diga algo anônimo..."}
          value={message}
          onChange={(e) => {
            setMessage(e.currentTarget.value);
            e.currentTarget.style.height = 'auto';
            e.currentTarget.style.height = e.currentTarget.scrollHeight + 'px';
          }}
          onKeyDown={handleKeyPress}
        />

        <button
          onClick={handleSendMessage}
          disabled={!message.trim()}
          className={cn(
            "absolute right-2 bottom-2 h-8 w-8 flex items-center justify-center rounded-xl transition-all active:scale-95",
            message.trim()
              ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/30"
              : "bg-neutral-800 text-neutral-600 opacity-50 cursor-not-allowed"
          )}
        >
          <Send size={16} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
};

export default ChannelInput;
