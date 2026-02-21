import React from 'react';
import { AppContentTypes } from '../interface/InterfaceUI';
import { LoadingSpinner } from '@ui/components/LoadingSpinner';
import { cn } from '@utils/cn';

export const AppContent: React.FC<AppContentTypes & React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  paperStyle,
  backdrop,
  disableSuspenseHandler,
  onClickBackdrop,
  ...props
}) => {
  return (
    <div
      className="flex flex-col flex-1 bg-[#F6F6F67] dark:bg-black relative"
      style={backdrop ? { overflow: 'hidden' } : { overflow: 'auto' }}
    >
      {backdrop && (
        <div
          className="absolute inset-0 z-[1] bg-black/50 transition-opacity duration-300"
          onClick={onClickBackdrop}
        />
      )}
      <div className={cn('flex-auto w-full grow', props.className)} style={paperStyle}>
        {!disableSuspenseHandler ? (
          <React.Suspense fallback={<LoadingSpinner />}>{children}</React.Suspense>
        ) : (
          children
        )}
      </div>
    </div>
  );
};
