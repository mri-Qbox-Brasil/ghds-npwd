import React from 'react';
import { Modal2 } from '@ui/components/Modal';
import { useModal } from '../../hooks/useModal';
import { Image as ImageIcon, Send, Camera, Link as LinkIcon } from 'lucide-react';
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
        // Handle error silently
      });
  };

  return (
    <Modal2 visible={modalVisible} handleClose={() => setModalVisible(false)} className="p-0 overflow-hidden bg-[#313338] rounded-[4px] shadow-2xl border border-[#1E1F22]">
      {/* Header */}
      <div className="px-4 pt-5 pb-2">
        <h2 className="text-[20px] font-bold text-white text-center">Enviar Mídia</h2>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Quick Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleImageGallery}
            className="flex-1 flex flex-col items-center justify-center p-4 bg-[#2B2D31] rounded-[4px] hover:bg-[#35373C] transition-colors gap-2 group"
          >
            <div className="h-10 w-10 rounded-full bg-[#5865F2] flex items-center justify-center group-hover:bg-[#4752C4] transition-colors">
              <Camera size={20} strokeWidth={2} className="text-white" />
            </div>
            <span className="text-[13px] font-medium text-[#B5BAC1]">Câmera</span>
          </button>
          <div className="flex-1 flex flex-col items-center justify-center p-4 bg-[#2B2D31] rounded-[4px] opacity-30 cursor-not-allowed gap-2">
            <div className="h-10 w-10 rounded-full bg-[#80848E] flex items-center justify-center">
              <ImageIcon size={20} strokeWidth={2} className="text-white" />
            </div>
            <span className="text-[13px] font-medium text-[#80848E]">Galeria</span>
          </div>
        </div>

        {/* URL Input */}
        <div className="space-y-2">
          <label className="text-[12px] font-bold text-[#B5BAC1] uppercase tracking-wide">Link da imagem</label>
          <input
            className="w-full h-10 px-3 bg-[#1E1F22] border-none rounded-[3px] text-[15px] font-normal text-[#DBDEE1] placeholder:text-[#6D6F78] focus:ring-2 focus:ring-[#5865F2] transition-all"
            placeholder={t('DARKCHAT.MEDIA_PLACEHOLDER') as string || "https://..."}
            value={modalMedia}
            onChange={(e) => setModalMedia(e.currentTarget.value)}
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-1">
          <button
            onClick={() => setModalVisible(false)}
            className="px-4 py-2 text-[14px] font-medium text-[#DBDEE1] hover:text-white hover:underline transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSendImage}
            disabled={!modalMedia.trim()}
            className={cn(
              "px-6 py-2 rounded-[3px] text-[14px] font-medium transition-all",
              modalMedia.trim()
                ? "bg-[#5865F2] text-white hover:bg-[#4752C4] active:bg-[#3C45A5]"
                : "bg-[#5865F2]/50 text-white/50 cursor-not-allowed"
            )}
          >
            {t('GENERIC.SEND') as string || 'Enviar'}
          </button>
        </div>
      </div>
    </Modal2>
  );
};
