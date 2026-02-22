import React, { useRef } from 'react';
import { AppWrapper, AppContent } from '@ui/components';
import { DynamicHeader } from '@ui/components/DynamicHeader';
import { GalleryGrid } from './grid/GalleryGrid';
import { GalleryModal } from './modal/GalleryModal';
import { Route, Switch } from 'react-router-dom';
import { LoadingSpinner } from '@ui/components/LoadingSpinner';
import NewPhotoButton from './NewPhotoButton';

const CameraApp: React.FC = () => {
  return (
    <AppWrapper id="camera-app" className="bg-white/40 dark:bg-black/40 backdrop-blur-md">
      <AppContent className="flex flex-col h-full overflow-hidden">
        <Switch>
          <React.Suspense fallback={<LoadingSpinner />}>
            <Route path="/camera" exact component={GalleryGrid} />
            <Route path="/camera/image" exact component={GalleryModal} />
          </React.Suspense>
        </Switch>
      </AppContent>
      <Route exact path="/camera">
        <NewPhotoButton />
      </Route>
    </AppWrapper>
  );
};

export default CameraApp;
