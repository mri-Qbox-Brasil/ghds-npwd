import React, { useRef } from 'react';
import { AppWrapper, AppContent } from '@ui/components';
import { DynamicHeader } from '@ui/components/DynamicHeader';
import { GalleryGrid } from './grid/GalleryGrid';
import { GalleryModal } from './modal/GalleryModal';
import { Route, Switch } from 'react-router-dom';
import { LoadingSpinner } from '@ui/components/LoadingSpinner';
import NewPhotoButton from './NewPhotoButton';
import { useIsEditing, useCheckedPhotos, usePhotosLoadable } from '../hooks/state';

const CameraApp: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const photosLoadable = usePhotosLoadable();
  const [isEditing, setIsEditing] = useIsEditing();
  const [checkedPhotos, setCheckedPhotos] = useCheckedPhotos();

  const toggleEdit = () => {
    setIsEditing((prev) => !prev);
    if (isEditing) setCheckedPhotos([]);
  };

  const rightActions = photosLoadable.state === 'hasValue' && !!photosLoadable.contents.length ? (
    <button
      onClick={toggleEdit}
      className="text-[17px] font-normal text-blue-500 active:text-blue-600 transition-colors"
    >
      {isEditing ? "OK" : "Selecionar"}
    </button>
  ) : null;

  return (
    <AppWrapper id="camera-app" className="bg-white/40 dark:bg-black/40 backdrop-blur-md">
      <Switch>
        <Route path="/camera" exact>
          {/* Pinned header — outside AppContent */}
          <DynamicHeader
            title="Galeria"
            scrollRef={scrollRef}
            variant="pinned"
            rightContent={rightActions}
          />

          <AppContent
            ref={scrollRef}
            className="flex flex-col grow pb-24 scrollbar-hide h-full relative"
          >
            {/* Large title — inside AppContent */}
            <DynamicHeader title="Galeria" scrollRef={scrollRef} variant="largeTitle" />

            <React.Suspense fallback={<LoadingSpinner />}>
              <GalleryGrid />
            </React.Suspense>
          </AppContent>

          <NewPhotoButton />
        </Route>

        <Route path="/camera/image" exact>
          <React.Suspense fallback={<LoadingSpinner />}>
            <GalleryModal />
          </React.Suspense>
        </Route>
      </Switch>
    </AppWrapper>
  );
};

export default CameraApp;
