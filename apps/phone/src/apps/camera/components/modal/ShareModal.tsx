import React from 'react';
import Modal from '../../../../ui/components/Modal';
import { setClipboard } from '@os/phone/hooks/useClipboard';
import { useHistory } from 'react-router-dom';
import { GalleryPhoto } from '@typings/photo';
import { useTranslation } from 'react-i18next';
import { Copy, X } from 'lucide-react';
import { NPWDButton } from '@npwd/keyos';

interface IShareModalProps {
  meta: GalleryPhoto | null;
  referal: string;
  onClose(): void;
}

export const ShareModal = ({ meta, onClose, referal }: IShareModalProps) => {
  const history = useHistory();
  const [t] = useTranslation();

  const handleCopyImage = () => {
    if (!meta) return;
    setClipboard(meta.image);
    history.push(referal);
    onClose();
  };

  if (!meta) return null;

  return (
    <Modal visible={!!meta} handleClose={onClose}>
      <div className="p-6 flex flex-col gap-6 animate-in slide-in-from-bottom-4 duration-300">
        <div className="flex flex-col gap-1 items-center text-center">
          <div className="h-14 w-14 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-2">
            <Copy size={32} />
          </div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
            {t('CAMERA.COPY_IMAGE')}
          </h2>
          <p className="text-xs text-neutral-400 font-medium">
            Deseja copiar o link desta imagem para a área de transferência?
          </p>
        </div>

        <div className="space-y-4">
          <NPWDButton
            onClick={handleCopyImage}
            className="w-full h-14 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/30 transition-all active:scale-95"
          >
            Copiar Link da Imagem
          </NPWDButton>

          <button
            onClick={onClose}
            className="w-full py-2 text-sm font-medium text-neutral-400 hover:text-neutral-500 transition-colors"
          >
            {t('GENERIC_CANCEL')}
          </button>
        </div>
      </div>
    </Modal>
  );
};
