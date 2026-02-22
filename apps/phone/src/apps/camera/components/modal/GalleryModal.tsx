import React, { useMemo, useState, useCallback } from 'react';
import { ChevronLeft, Trash2, Share } from 'lucide-react';
import { useHistory } from 'react-router-dom';
import { useQueryParams } from '@common/hooks/useQueryParams';
import { ShareModal } from './ShareModal';
import { GalleryPhoto, PhotoEvents } from '@typings/photo';
import { usePhotoActions } from '../../hooks/usePhotoActions';
import fetchNui from '@utils/fetchNui';
import { ServerPromiseResp } from '@typings/common';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from '@os/snackbar/hooks/useSnackbar';

export const GalleryModal = () => {
  const [shareOpen, setShareOpen] = useState<GalleryPhoto | null>(null);
  const history = useHistory();
  const query = useQueryParams();
  const { deletePhoto } = usePhotoActions();
  const { addAlert } = useSnackbar();
  const [t] = useTranslation();

  const referal = query.referal || '/camera';

  const meta: GalleryPhoto = useMemo(
    () => ({ id: parseInt(query.id as string), image: query.image as string }),
    [query],
  );

  const _handleClose = () => {
    history.push(referal);
  };

  const handleDeletePhoto = () => {
    fetchNui<ServerPromiseResp<GalleryPhoto>>(PhotoEvents.DELETE_PHOTO, {
      image: meta.image,
    }).then((serverResp) => {
      if (serverResp.status !== 'ok') {
        return addAlert({ message: t('CAMERA.FAILED_TO_DELETE'), type: 'error' });
      }

      deletePhoto(meta.image);
      history.goBack();
    });
  };

  const handleSharePhoto = useCallback(() => {
    setShareOpen(meta);
  }, [meta]);

  if (!meta.image) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black animate-in fade-in duration-300">
      <ShareModal referal={referal} meta={shareOpen} onClose={() => setShareOpen(null)} />

      {/* Header with back button */}
      <header className="absolute top-0 w-full flex items-center justify-between px-4 pt-[50px] pb-3 z-20 bg-gradient-to-b from-black/80 to-transparent">
        <button
          onClick={_handleClose}
          className="flex items-center gap-0.5 text-white active:opacity-70 transition-opacity"
        >
          <ChevronLeft size={28} strokeWidth={2} />
          <span className="text-[17px] font-medium">Galeria</span>
        </button>
      </header>

      {/* Image */}
      <main className="flex-1 flex items-center justify-center w-full">
        <img
          src={meta.image}
          alt="gallery"
          className="max-w-full max-h-full object-contain"
        />
      </main>

      {/* iOS bottom toolbar */}
      <footer className="absolute bottom-0 w-full px-8 pb-8 pt-4 flex items-center justify-around z-20 bg-gradient-to-t from-black/80 to-transparent">
        <button
          onClick={handleDeletePhoto}
          className="flex flex-col items-center gap-1 text-white/80 active:text-red-400 transition-colors"
        >
          <Trash2 size={22} />
          <span className="text-[10px] font-medium">Excluir</span>
        </button>

        <button
          onClick={handleSharePhoto}
          className="flex flex-col items-center gap-1 text-white/80 active:text-blue-400 transition-colors"
        >
          <Share size={22} />
          <span className="text-[10px] font-medium">Enviar</span>
        </button>
      </footer>

      {shareOpen && <div className="absolute inset-0 bg-black/40 z-30 backdrop-blur-sm transition-all" />}
    </div>
  );
};
