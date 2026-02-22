import React from 'react';
import { useHistory } from 'react-router-dom';
import { useQueryParams } from '@common/hooks/useQueryParams';
import { addQueryToLocation } from '@common/utils/addQueryToLocation';
import { getLocationFromUrl } from '@common/utils/getLocationFromUrl';
import { usePhotosValue, useIsEditing, useCheckedPhotos } from '../../hooks/state';
import { CheckCircle2, Circle } from 'lucide-react';
import { cn } from '@utils/cn';

export const GalleryGrid = () => {
  const history = useHistory();
  const query = useQueryParams();
  const photos = usePhotosValue();
  const [isEditing] = useIsEditing();
  const [checkedPhotos, setCheckedPhotos] = useCheckedPhotos();

  const referal = query.referal ? decodeURIComponent(query.referal) : '/camera/image';

  const handlePhotoOpen = (photo: any) => {
    history.push(addQueryToLocation(getLocationFromUrl(referal), 'image', photo.image));
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

  if (photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-3">
        <span className="text-5xl">📸</span>
        <p className="text-[15px] font-medium text-neutral-400 dark:text-neutral-500">Nenhuma foto</p>
        <p className="text-[13px] text-neutral-400 dark:text-neutral-600">
          Tire uma foto com o botão abaixo
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-3 gap-[1px] bg-neutral-200 dark:bg-neutral-800">
        {photos.map((photo) => {
          const isChecked = checkedPhotos.indexOf(photo.id) !== -1;

          return (
            <div
              key={photo.id}
              className="relative aspect-square overflow-hidden bg-white dark:bg-black cursor-pointer active:opacity-80 transition-opacity"
              onClick={() => isEditing ? toggleCheck(photo.id) : handlePhotoOpen(photo)}
            >
              <img
                src={photo.image}
                alt=""
                className={cn(
                  "h-full w-full object-cover transition-transform duration-300",
                  isEditing && isChecked && "scale-90 rounded-lg opacity-70"
                )}
              />

              {isEditing && (
                <div className="absolute bottom-2 right-2 z-10">
                  {isChecked ? (
                    <CheckCircle2 className="text-blue-500 fill-white dark:fill-black h-6 w-6 drop-shadow" />
                  ) : (
                    <Circle className="text-white/80 h-6 w-6 drop-shadow" strokeWidth={1.5} />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Photo count */}
      <div className="flex justify-center py-4">
        <p className="text-xs text-neutral-400 font-medium">
          {photos.length} {photos.length === 1 ? 'Foto' : 'Fotos'}
        </p>
      </div>
    </>
  );
};
