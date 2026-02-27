import React from 'react';
import { CallControls } from './CallControls';
import { Flex } from '@ui/components/ui/flex';

interface CallNotificationProps {
  children: React.ReactNode;
}

export const CallNotification: React.FC<CallNotificationProps> = ({ children }) => (
  <Flex direction="col" className="pb-12 relative w-full h-full">
    <Flex className="w-full">{children}</Flex>
    <Flex className="absolute bottom-2 right-0">
      <CallControls isSmall />
    </Flex>
  </Flex>
);
