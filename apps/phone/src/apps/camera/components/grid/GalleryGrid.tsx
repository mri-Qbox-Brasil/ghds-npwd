import React from 'react';
import { useHistory } from 'react-router-dom';
import { useQueryParams } from '@common/hooks/useQueryParams';
import { addQueryToLocation } from '@common/utils/addQueryToLocation';
import { getLocationFromUrl } from '@common/utils/getLocationFromUrl';
import { usePhotosValue, useIsEditing, useCheckedPhotos } from '../../hooks/state';
import { Edit2, CheckCircle2, Circle } from 'lucide-react';
import { cn } from '@utils/cn';

export const GalleryGrid = () => {
  const history = useHistory();
  const query = useQueryParams();
  const photos = usePhotosValue();
  const [isEditing, setIsEditing] = useIsEditing();
  const [checkedPhotos, setCheckedPhotos] = useCheckedPhotos();

  const referal = query.referal ? decodeURIComponent(query.referal) : '/camera/image';

  const handlePhotoOpen = (photo: any) => {
    history.push(addQueryToLocation(getLocationFromUrl(referal), 'image', photo.image));
  };

  const toggleEdit = () => {
    setIsEditing((prev) => !prev);
    if (isEditing) setCheckedPhotos([]); // Limpa seleção ao sair do modo edição
  };

  const toggleCheck = (photoId: number) => {
    const currentIndex = checkedPhotos.indexOf(photoId);
    const newChecked = [...checkedPhotos];

    if (currentIndex === -1) {
      newChecked.push(photoId);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setCheckedPhotos(newChecked);
  };

  return (
    <div className="flex flex-col h-full bg-background animate-in fade-in duration-300">
      <header className="flex h-16 shrink-0 items-center justify-between px-6 sticky top-0 z-20 bg-background/80 backdrop-blur-md">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Galeria</h1>
        {!!photos.length && (
          <button
            onClick={toggleEdit}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-medium",
              isEditing
                ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30"
                : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200"
            )}
          >
            {isEditing ? "Concluído" : <Edit2 size={20} />}
          </button>
        )}
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-3 gap-0.5 pb-20">
          {photos.map((photo) => {
            const isChecked = checkedPhotos.indexOf(photo.id) !== -1;

            return (
              <div
                key={photo.id}
                className="relative aspect-square group overflow-hidden bg-neutral-100 dark:bg-neutral-800 cursor-pointer active:opacity-80 transition-opacity"
                onClick={() => isEditing ? toggleCheck(photo.id) : handlePhotoOpen(photo)}
              >
                <img
                  src={photo.image}
                  alt=""
                  className={cn(
                    "h-full w-full object-cover transition-transform duration-500 group-hover:scale-110",
                    isEditing && isChecked && "scale-90 opacity-70"
                  )}
                />

                {isEditing && (
                  <div className="absolute top-2 right-2 z-10 animate-in zoom-in">
                    {isChecked ? (
                      <CheckCircle2 className="text-blue-500 fill-white dark:fill-neutral-900 h-6 w-6" />
                    ) : (
                      <Circle className="text-white/80 h-6 w-6" strokeWidth={1.5} />
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {photos.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 opacity-40">
            <div className="text-5xl mb-4 text-neutral-300 dark:text-neutral-700">📸</div>
            <p className="font-medium text-neutral-500">Nenhuma foto encontrada</p>
          </div>
        )}
      </div>
    </div>
  );
};
