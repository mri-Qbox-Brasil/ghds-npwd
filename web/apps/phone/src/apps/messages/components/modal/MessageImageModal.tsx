import { useCallback, useEffect } from 'react';
import { Modal2 } from '../../../../ui/components/Modal';
import { useHistory, useLocation } from 'react-router-dom';
import { deleteQueryFromLocation } from '@common/utils/deleteQueryFromLocation';
import { PictureResponsive } from '@ui/components/PictureResponsive';
import { useTranslation } from 'react-i18next';
import { useMessageAPI } from '../../hooks/useMessageAPI';
import { MessageConversation } from '@typings/messages';
import useMessages from '../../hooks/useMessages';
import { Share2, X, Image as ImageIcon } from 'lucide-react';
import { cn } from '@utils/cn';

interface IProps {
  messageGroup: MessageConversation | undefined;
  imagePreview: any;
  onClose(): void;
  image?: string;
  setImagePreview: (preview: string | null) => void;
}

export const MessageImageModal = ({
  messageGroup,
  onClose,
  image,
  setImagePreview,
  imagePreview,
}: IProps) => {
  const history = useHistory();
  const [t] = useTranslation();
  const { pathname, search } = useLocation();
  const { sendMessage } = useMessageAPI();
  const { activeMessageConversation } = useMessages();

  const removeQueryParamImage = useCallback(() => {
    setImagePreview(null);
    history.replace(deleteQueryFromLocation({ pathname, search }, 'image'));
  }, [history, pathname, search, setImagePreview]);

  const sendImageMessage = useCallback(
    (m) => {
      if (!messageGroup || !activeMessageConversation) return;
      sendMessage({
        conversationId: messageGroup.id,
        conversationList: activeMessageConversation.conversationList,
        message: m,
        tgtPhoneNumber: messageGroup.participant,
      });
      onClose();
    },
    [sendMessage, messageGroup, onClose, activeMessageConversation],
  );

  const sendFromQueryParam = useCallback(
    (image) => {
      sendImageMessage(image);
      removeQueryParamImage();
    },
    [removeQueryParamImage, sendImageMessage],
  );

  useEffect(() => {
    if (!image) return;
    setImagePreview(image);
  }, [image, setImagePreview]);

  return (
    <Modal2 visible={!!imagePreview} handleClose={removeQueryParamImage} className="p-0 overflow-hidden bg-neutral-50 dark:bg-neutral-900 rounded-3xl">
      <header className="p-6 border-b border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-blue-500/10 text-blue-500">
            <ImageIcon size={24} strokeWidth={2.5} />
          </div>
          <h2 className="text-xl font-black text-neutral-900 dark:text-white uppercase tracking-tighter italic">Compartilhar Imagem</h2>
        </div>
        <button onClick={removeQueryParamImage} className="text-neutral-400 hover:text-red-500 transition-colors">
          <X size={24} strokeWidth={3} />
        </button>
      </header>

      <div className="p-6 space-y-6">
        <div className="overflow-hidden rounded-2xl border-4 border-white dark:border-neutral-800 shadow-xl bg-white dark:bg-neutral-900 aspect-square flex items-center justify-center">
          {imagePreview && (
            <img src={imagePreview} className="w-full h-full object-cover animate-in zoom-in-95 duration-500" alt="Preview" />
          )}
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => sendFromQueryParam(imagePreview)}
            className="w-full py-4 bg-blue-500 hover:bg-blue-600 text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-lg shadow-blue-500/30 transition-all active:scale-95 flex items-center justify-center gap-3"
          >
            <Share2 size={20} strokeWidth={3} />
            Enviar para conversa
          </button>
          <button
            onClick={removeQueryParamImage}
            className="w-full py-3.5 bg-neutral-200 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 font-bold uppercase tracking-widest rounded-2xl transition-all active:scale-95"
          >
            Cancelar
          </button>
        </div>
      </div>
    </Modal2>
  );
};
