import React, { useRef } from 'react';
import { AppWrapper, AppContent } from '@ui/components';
import { DynamicHeader } from '@ui/components/DynamicHeader';
import { ExampleApp } from './ExampleApp';
import { useTranslation } from 'react-i18next';
import { LoadingSpinner } from '@ui/components/LoadingSpinner';

export const ExampleAppWrapper: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [t] = useTranslation();

  return (
    <AppWrapper className="bg-[#F2F2F7] dark:bg-black">
      <DynamicHeader title={t('APPS_EXAMPLE')} scrollRef={scrollRef} variant="pinned" />
      <AppContent
        ref={scrollRef}
        className="flex flex-col grow pb-24 scrollbar-hide h-full relative"
      >
        <DynamicHeader title={t('APPS_EXAMPLE')} scrollRef={scrollRef} variant="largeTitle" />
        <React.Suspense fallback={<LoadingSpinner />}>
          <ExampleApp />
        </React.Suspense>
      </AppContent>
    </AppWrapper>
  );
};
