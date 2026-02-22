import React, { useState } from 'react';
import { ArrowUp, PlusCircle, Image as ImageIcon } from 'lucide-react';
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
    <div className="flex items-end gap-0 bg-[#383A40] rounded-[8px] px-1">
      {/* Attachment Button */}
      <button
        onClick={() => setModalVisible(true)}
        className="h-11 w-11 shrink-0 flex items-center justify-center text-[#B5BAC1] hover:text-[#DBDEE1] transition-colors active:scale-95"
      >
        <PlusCircle size={22} strokeWidth={2} />
      </button>

      {/* Input */}
      <textarea
        rows={1}
        className="flex-1 min-h-[44px] max-h-28 py-[11px] px-1 bg-transparent border-none text-[15px] font-normal text-[#DBDEE1] placeholder:text-[#6D6F78] focus:ring-0 resize-none scrollbar-hide"
        placeholder={t('DARKCHAT.MESSAGE_PLACEHOLDER') as string || "Enviar mensagem anônima..."}
        value={message}
        onChange={(e) => {
          setMessage(e.currentTarget.value);
          e.currentTarget.style.height = 'auto';
          e.currentTarget.style.height = e.currentTarget.scrollHeight + 'px';
        }}
        onKeyDown={handleKeyPress}
      />

      {/* Send Button */}
      {message.trim() && (
        <button
          onClick={handleSendMessage}
          className="h-11 w-11 shrink-0 flex items-center justify-center text-[#5865F2] hover:text-[#7983F5] transition-colors active:scale-95 animate-in zoom-in-50 duration-200"
        >
          <ArrowUp size={22} strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
};

export default ChannelInput;
