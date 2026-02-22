import React, { useState } from 'react';
import { Modal2 } from '@ui/components/Modal';
import { useTranslation } from 'react-i18next';
import { useDarkchatAPI } from '../../hooks/useDarkchatAPI';
import { Hash, Fingerprint } from 'lucide-react';
import { cn } from '@utils/cn';

interface NewChannelModalProps {
  open: boolean;
  closeModal: () => void;
}

export const NewChannelModal: React.FC<NewChannelModalProps> = ({ open, closeModal }) => {
  const [channelValue, setChannelValue] = useState<string>('');
  const [t] = useTranslation();
  const { addChannel } = useDarkchatAPI();

  const handleJoinChannel = () => {
    if (!channelValue.trim()) return;
    addChannel({ channelIdentifier: channelValue });
    setChannelValue('');
    closeModal();
  };

  return (
    <Modal2 visible={open} handleClose={closeModal} className="p-0 overflow-hidden bg-[#313338] rounded-[4px] shadow-2xl border border-[#1E1F22]">
      {/* Header */}
      <div className="px-4 pt-5 pb-2">
        <h2 className="text-[20px] font-bold text-white text-center">Entrar em um Canal</h2>
        <p className="text-[13px] text-[#B5BAC1] text-center mt-1 leading-snug">
          {t('DARKCHAT.NEW_CHANNEL_TITLE') as string || 'Crie ou entre em um canal usando um identificador secreto.'}
        </p>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        <div className="space-y-2">
          <label className="text-[12px] font-bold text-[#B5BAC1] uppercase tracking-wide">
            Identificador do Canal <span className="text-[#ED4245]">*</span>
          </label>
          <input
            type="password"
            className="w-full h-10 px-3 bg-[#1E1F22] border-none rounded-[3px] text-[15px] font-normal text-[#DBDEE1] placeholder:text-[#6D6F78] focus:ring-2 focus:ring-[#5865F2] transition-all"
            placeholder={t('DARKCHAT.NEW_CHANNEL_INPUT_PLACEHOLDER') as string || "Codinome do canal..."}
            value={channelValue}
            onChange={(e) => setChannelValue(e.currentTarget.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleJoinChannel()}
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-1">
          <button
            onClick={closeModal}
            className="px-4 py-2 text-[14px] font-medium text-[#DBDEE1] hover:text-white hover:underline transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleJoinChannel}
            disabled={!channelValue.trim()}
            className={cn(
              "px-6 py-2 rounded-[3px] text-[14px] font-medium transition-all",
              channelValue.trim()
                ? "bg-[#5865F2] text-white hover:bg-[#4752C4] active:bg-[#3C45A5]"
                : "bg-[#5865F2]/50 text-white/50 cursor-not-allowed"
            )}
          >
            {t('DARKCHAT.JOIN_BUTTON') as string || 'Entrar'}
          </button>
        </div>
      </div>
    </Modal2>
  );
};
