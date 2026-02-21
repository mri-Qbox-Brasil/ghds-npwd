import React from 'react';
import { AppContentTypes } from '../interface/InterfaceUI';
import { LoadingSpinner } from '@ui/components/LoadingSpinner';
import { cn } from '@utils/cn';

export const AppContent = React.forwardRef<HTMLDivElement, AppContentTypes & React.HTMLAttributes<HTMLDivElement>>((
  {
    children,
    paperStyle,
    backdrop,
    disableSuspenseHandler,
    onClickBackdrop,
    className,
    style,
    ...props
  },
  ref
) => {
  return (
    <div
      ref={ref}
      {...props}
      className={cn("flex flex-col flex-1 bg-[#F2F2F7] dark:bg-black relative", className)}
      style={{ overflow: backdrop ? 'hidden' : 'auto', ...style }}
    >
      {backdrop && (
        <div
          className="absolute inset-0 z-[1] bg-black/50 transition-opacity duration-300"
          onClick={onClickBackdrop}
        />
      )}
      <div className={cn('flex-auto w-full grow')} style={paperStyle}>
        {!disableSuspenseHandler ? (
          <React.Suspense fallback={<LoadingSpinner />}>{children}</React.Suspense>
        ) : (
          children
        )}
      </div>
    </div>
  );
});

AppContent.displayName = 'AppContent';
