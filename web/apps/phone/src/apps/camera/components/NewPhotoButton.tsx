import React, { useState } from 'react';
import { Plus, Trash2, Loader2 } from 'lucide-react';
import { useIsEditing } from '../hooks/state';
import fetchNui from '@utils/fetchNui';
import { ServerPromiseResp } from '@typings/common';
import { GalleryPhoto, PhotoEvents } from '@typings/photo';
import { usePhotoActions } from '../hooks/usePhotoActions';
import { useCheckedPhotosValue } from '../hooks/state';
import { useSnackbar } from '@os/snackbar/hooks/useSnackbar';
import { useTranslation } from 'react-i18next';
import { cn } from '@utils/cn';

const NewPhotoButton = () => {
  const [isEditing, setIsEditing] = useIsEditing();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const checkedPhotos = useCheckedPhotosValue();
  const { takePhoto, deletePhotos } = usePhotoActions();
  const { addAlert } = useSnackbar();
  const [t] = useTranslation();

  const handleTakePhoto = () => {
    setIsLoading(true);
    fetchNui<ServerPromiseResp<GalleryPhoto>>(PhotoEvents.TAKE_PHOTO).then((serverResp) => {
      if (serverResp.status !== 'ok') {
        setIsLoading(false);
        return addAlert({
          message: t(serverResp.errorMsg as string) as unknown as string,
          type: 'error',
        });
      }

      takePhoto(serverResp.data);
      setIsLoading(false);
    });
  };

  const handleDeletePhotos = () => {
    fetchNui<ServerPromiseResp<number[]>>(PhotoEvents.DELETE_MULTIPLE_PHOTOS, checkedPhotos).then(
      (serverResp) => {
        if (serverResp.status !== 'ok') {
          return addAlert({ message: t('CAMERA.FAILED_TO_DELETE') as unknown as string, type: 'error' });
        }
        deletePhotos(checkedPhotos);
        setIsEditing(false);
      },
    );
  };

  return (
    <button
      onClick={!isEditing ? handleTakePhoto : handleDeletePhotos}
      disabled={isLoading || (isEditing && checkedPhotos.length === 0)}
      className={cn(
        "fixed bottom-20 right-6 z-40 h-16 w-16 rounded-full flex items-center justify-center shadow-2xl transition-all active:scale-90",
        !isEditing
          ? "bg-blue-500 text-white hover:bg-blue-600 shadow-blue-500/30"
          : "bg-red-500 text-white hover:bg-red-600 shadow-red-500/30 disabled:bg-neutral-200 dark:disabled:bg-neutral-800 disabled:text-neutral-400 disabled:shadow-none"
      )}
    >
      {isLoading ? (
        <Loader2 className="animate-spin h-8 w-8" />
      ) : !isEditing ? (
        <Plus size={32} />
      ) : (
        <Trash2 size={28} />
      )}
    </button>
  );
};

export default NewPhotoButton;
