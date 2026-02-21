import React, { useMemo, useState, useCallback } from 'react';
import { ArrowLeft, Trash2, Share } from 'lucide-react';
import { useHistory } from 'react-router-dom';
import { useQueryParams } from '@common/hooks/useQueryParams';
import { ShareModal } from './ShareModal';
import { GalleryPhoto, PhotoEvents } from '@typings/photo';
import { usePhotoActions } from '../../hooks/usePhotoActions';
import fetchNui from '@utils/fetchNui';
import { ServerPromiseResp } from '@typings/common';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from '@os/snackbar/hooks/useSnackbar';
import { cn } from '@utils/cn';

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

      <header className="absolute top-0 w-full flex h-20 items-center justify-between px-4 z-20 bg-gradient-to-b from-black/80 to-transparent">
        <button
          onClick={_handleClose}
          className="p-3 text-white rounded-full hover:bg-white/10 transition-colors"
        >
          <ArrowLeft size={28} />
        </button>
      </header>

      <main className="flex-1 flex items-center justify-center w-full">
        <img
          src={meta.image}
          alt="gallery"
          className="max-w-full max-h-full object-contain"
        />
      </main>

      <footer className="absolute bottom-0 w-full px-12 py-8 flex items-center justify-between z-20 bg-gradient-to-t from-black/80 to-transparent">
        <button
          onClick={handleDeletePhoto}
          className="flex flex-col items-center gap-1.5 p-3 rounded-2xl hover:bg-red-500/20 text-red-400 group transition-all"
        >
          <div className="h-12 w-12 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 shadow-lg group-hover:scale-110 transition-transform">
            <Trash2 size={24} />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Excluir</span>
        </button>

        <button
          onClick={handleSharePhoto}
          className="flex flex-col items-center gap-1.5 p-3 rounded-2xl hover:bg-white/10 text-white group transition-all"
        >
          <div className="h-12 w-12 rounded-xl flex items-center justify-center bg-white/10 border border-white/20 shadow-lg group-hover:scale-110 transition-transform">
            <Share size={24} />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Enviar</span>
        </button>
      </footer>

      {/* Overlay opcional para quando o modal de compartilhamento está aberto */}
      {shareOpen && <div className="absolute inset-0 bg-black/40 z-30 backdrop-blur-sm transition-all" />}
    </div>
  );
};
