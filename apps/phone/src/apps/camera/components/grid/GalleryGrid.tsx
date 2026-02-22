import React, { useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { useQueryParams } from '@common/hooks/useQueryParams';
import { addQueryToLocation } from '@common/utils/addQueryToLocation';
import { getLocationFromUrl } from '@common/utils/getLocationFromUrl';
import { usePhotosValue, useIsEditing, useCheckedPhotos } from '../../hooks/state';
import { CheckCircle2, Circle } from 'lucide-react';
import { DynamicHeader } from '@ui/components/DynamicHeader';
import { cn } from '@utils/cn';

export const GalleryGrid = () => {
  const history = useHistory();
  const query = useQueryParams();
  const photos = usePhotosValue();
  const [isEditing, setIsEditing] = useIsEditing();
  const [checkedPhotos, setCheckedPhotos] = useCheckedPhotos();
  const scrollRef = useRef<HTMLDivElement>(null);

  const referal = query.referal ? decodeURIComponent(query.referal) : '/camera/image';

  const handlePhotoOpen = (photo: any) => {
    history.push(addQueryToLocation(getLocationFromUrl(referal), 'image', photo.image));
  };

  const toggleEdit = () => {
    setIsEditing((prev) => !prev);
    if (isEditing) setCheckedPhotos([]);
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

  const rightActions = !!photos.length ? (
    <button
      onClick={toggleEdit}
      className="text-[17px] font-normal text-blue-500 active:text-blue-600 transition-colors"
    >
      {isEditing ? "OK" : "Selecionar"}
    </button>
  ) : null;

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300">
      {/* Pinned header */}
      <DynamicHeader
        title="Galeria"
        scrollRef={scrollRef}
        variant="pinned"
        rightContent={rightActions}
      />

      <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-hide">
        {/* Large title */}
        <DynamicHeader title="Galeria" scrollRef={scrollRef} variant="largeTitle" />

        {photos.length > 0 ? (
          <div className="grid grid-cols-3 gap-[2px] pb-20">
            {photos.map((photo) => {
              const isChecked = checkedPhotos.indexOf(photo.id) !== -1;

              return (
                <div
                  key={photo.id}
                  className="relative aspect-square overflow-hidden bg-neutral-100 dark:bg-neutral-800 cursor-pointer active:opacity-80 transition-opacity"
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
                        <CheckCircle2 className="text-blue-500 fill-white dark:fill-neutral-900 h-6 w-6 drop-shadow" />
                      ) : (
                        <Circle className="text-white/80 h-6 w-6 drop-shadow" strokeWidth={1.5} />
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 gap-3">
            <span className="text-5xl">📸</span>
            <p className="text-[15px] font-medium text-neutral-400 dark:text-neutral-500">Nenhuma foto</p>
            <p className="text-[13px] text-neutral-400 dark:text-neutral-600">
              Tire uma foto com o botão abaixo
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
