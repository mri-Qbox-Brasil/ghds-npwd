import React from 'react';
import { AppWrapper } from '@ui/components';
import { AppContent } from '@ui/components/AppContent';
import { useCall } from '../hooks/useCall';
import { CallTimer } from './CallTimer';
import { CallControls } from './CallControls';
import CallContactContainer from './CallContactContainer';
import RingingText from './RingingText';
import { LoadingSpinner } from '@ui/components/LoadingSpinner';
import { useWallpaper } from '../../../apps/settings/hooks/useWallpaper';
import { Flex } from '@ui/components/ui/flex';

export const CallModal: React.FC = () => {
  const { call } = useCall();
  const wallpaper = useWallpaper();

  if (!call) return null;

  return (
    <AppWrapper>
      <AppContent
        paperStyle={{
          backgroundImage: wallpaper,
        }}
      >
        <React.Suspense fallback={<LoadingSpinner />}>
          <Flex direction="col" justify="between" className="h-full p-10 backdrop-blur-[20px] brightness-[0.6]">
            <Flex direction="col">
              <CallContactContainer />
              {call?.is_accepted ? <CallTimer /> : call?.isTransmitter && <RingingText />}
            </Flex>
            <CallControls />
          </Flex>
        </React.Suspense>
      </AppContent>
    </AppWrapper>
  );
};
