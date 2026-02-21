import React, { useState } from 'react';
import { Modal2 } from '@ui/components/Modal';
import { useTranslation } from 'react-i18next';
import { useDarkchatAPI } from '../../hooks/useDarkchatAPI';
import { Hash, Plus, X, Fingerprint } from 'lucide-react';
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
    <Modal2 visible={open} handleClose={closeModal} className="p-0 overflow-hidden bg-neutral-900 rounded-[32px] border border-neutral-800 shadow-2xl">
      <header className="p-6 border-b border-neutral-800 bg-neutral-900/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-500">
            <Plus size={24} strokeWidth={2.5} />
          </div>
          <h2 className="text-xl font-black text-white uppercase tracking-tighter italic">Novo Canal</h2>
        </div>
        <button onClick={closeModal} className="text-neutral-600 hover:text-red-500 transition-colors">
          <X size={24} strokeWidth={3} />
        </button>
      </header>

      <div className="p-8 space-y-6">
        <div className="space-y-3">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-neutral-500 px-1 italic">Identificador do Canal:</p>
          <div className="relative group">
            <Fingerprint className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600 group-focus-within:text-indigo-500 transition-colors" size={20} />
            <input
              type="password"
              className="w-full h-14 pl-12 pr-4 bg-black border border-neutral-800 rounded-2xl text-sm font-bold text-white placeholder:text-neutral-700 focus:ring-1 focus:ring-indigo-500/50 transition-all shadow-inner"
              placeholder={t('DARKCHAT.NEW_CHANNEL_INPUT_PLACEHOLDER') as string || "Codinome do canal..."}
              value={channelValue}
              onChange={(e) => setChannelValue(e.currentTarget.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleJoinChannel()}
            />
          </div>
          <p className="px-1 text-[10px] font-bold text-neutral-600 italic leading-snug">
            {t('DARKCHAT.NEW_CHANNEL_TITLE') as string || 'Crie ou entre em um canal usando um identificador secreto.'}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleJoinChannel}
            disabled={!channelValue.trim()}
            className={cn(
              "w-full py-4 rounded-2xl font-black uppercase tracking-[0.2em] transition-all active:scale-95 flex items-center justify-center gap-3",
              channelValue.trim()
                ? "bg-white text-black hover:bg-neutral-200 shadow-lg shadow-white/5"
                : "bg-neutral-800 text-neutral-600 cursor-not-allowed"
            )}
          >
            <Hash size={20} strokeWidth={3} />
            {t('DARKCHAT.JOIN_BUTTON') as string || 'Acessar Canal'}
          </button>
          <button
            onClick={closeModal}
            className="w-full py-3.5 text-neutral-500 font-bold uppercase tracking-widest hover:text-red-500 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </Modal2>
  );
};
