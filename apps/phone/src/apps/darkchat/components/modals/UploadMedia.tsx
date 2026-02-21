import React from 'react';
import { Modal2 } from '@ui/components/Modal';
import { useModal } from '../../hooks/useModal';
import { Image as ImageIcon, Send, X, Camera, Link as LinkIcon } from 'lucide-react';
import { useHistory, useLocation } from 'react-router-dom';
import qs from 'qs';
import { isImageValid } from '../../../../common/utils/isImageValid';
import { useDarkchatAPI } from '../../hooks/useDarkchatAPI';
import { useActiveDarkchatValue } from '../../state/state';
import { useMyPhoneNumber } from '../../../../os/simcard/hooks/useMyPhoneNumber';
import { useTranslation } from 'react-i18next';
import { cn } from '@utils/cn';

export const UploadMediaModal = () => {
  const { modalVisible, setModalVisible, modalMedia, setModalMedia } = useModal();
  const history = useHistory();
  const { pathname, search } = useLocation();
  const { sendMessage } = useDarkchatAPI();
  const { id: channelId } = useActiveDarkchatValue();
  const phoneNumber = useMyPhoneNumber();
  const [t] = useTranslation();

  const handleImageGallery = () => {
    history.push(
      `/camera?${qs.stringify({
        referal: encodeURIComponent(pathname + search),
      })}`,
    );
  };

  const handleSendImage = () => {
    const link = modalMedia.trim();
    if (!link) return;

    isImageValid(link)
      .then(() => {
        sendMessage({
          type: 'image',
          message: link,
          channelId,
          phoneNumber,
        });
        setModalVisible(false);
        setModalMedia('');
      })
      .catch(() => {
        // Handle error silently or show alert
      });
  };

  return (
    <Modal2 visible={modalVisible} handleClose={() => setModalVisible(false)} className="p-0 overflow-hidden bg-neutral-900 rounded-[32px] border border-neutral-800 shadow-2xl">
      <header className="p-6 border-b border-neutral-800 bg-neutral-900/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-500">
            <ImageIcon size={24} strokeWidth={2.5} />
          </div>
          <h2 className="text-xl font-black text-white uppercase tracking-tighter italic">Enviar Mídia</h2>
        </div>
        <button onClick={() => setModalVisible(false)} className="text-neutral-600 hover:text-red-500 transition-colors">
          <X size={24} strokeWidth={3} />
        </button>
      </header>

      <div className="p-8 space-y-8">
        <div className="flex items-center gap-4">
          <button
            onClick={handleImageGallery}
            className="flex-1 flex flex-col items-center justify-center p-6 bg-neutral-800 hover:bg-neutral-700 rounded-3xl border border-neutral-700 transition-all active:scale-95 group gap-2"
          >
            <div className="p-3 bg-indigo-500/10 text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white rounded-2xl transition-all">
              <Camera size={24} strokeWidth={2.5} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 group-hover:text-white transition-colors">Câmera</span>
          </button>
          <div className="h-10 w-px bg-neutral-800" />
          <div className="flex-1 flex flex-col items-center justify-center p-4 gap-1 opacity-20 cursor-not-allowed">
            <ImageIcon size={24} className="text-neutral-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Galeria</span>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-neutral-500 px-1 italic">Ou cole o link:</p>
          <div className="relative group">
            <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600 group-focus-within:text-indigo-500 transition-colors" size={20} />
            <input
              className="w-full h-14 pl-12 pr-4 bg-black border border-neutral-800 rounded-2xl text-sm font-bold text-white placeholder:text-neutral-700 focus:ring-1 focus:ring-indigo-500/50 transition-all shadow-inner"
              placeholder={t('DARKCHAT.MEDIA_PLACEHOLDER') as string || "https://..."}
              value={modalMedia}
              onChange={(e) => setModalMedia(e.currentTarget.value)}
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-2">
          <button
            onClick={handleSendImage}
            disabled={!modalMedia.trim()}
            className={cn(
              "w-full py-4 rounded-2xl font-black uppercase tracking-[0.2em] transition-all active:scale-95 flex items-center justify-center gap-3 shadow-xl",
              modalMedia.trim()
                ? "bg-indigo-500 text-white hover:bg-indigo-600 shadow-indigo-500/20"
                : "bg-neutral-800 text-neutral-600 cursor-not-allowed"
            )}
          >
            <Send size={20} strokeWidth={3} />
            {t('GENERIC.SEND') as string || 'Enviar Imagem'}
          </button>
          <button
            onClick={() => setModalVisible(false)}
            className="w-full py-3.5 text-neutral-500 font-bold uppercase tracking-widest hover:text-red-500 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </Modal2>
  );
};
