import React, { useRef } from 'react';
import { AppWrapper } from '@ui/components';
import { AppContent } from '@ui/components/AppContent';
import { DynamicHeader } from '@ui/components/DynamicHeader';

export const LocationApp: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <AppWrapper id="location" className="bg-[#F2F2F7] dark:bg-black">
      <DynamicHeader title="Localização" scrollRef={scrollRef} variant="pinned" />
      <AppContent
        ref={scrollRef}
        className="flex flex-col grow pb-24 scrollbar-hide h-full relative"
      >
        <DynamicHeader title="Localização" scrollRef={scrollRef} variant="largeTitle" />
      </AppContent>
    </AppWrapper>
  );
};
