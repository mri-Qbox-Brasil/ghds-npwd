import React from 'react';
import { Flex } from '@ui/components/ui/flex';
import { Typography } from '@ui/components/ui/typography';
import useTimer from '../hooks/useTimer';

const formatTime = (time: number) => (time < 10 ? `0${time}` : time);

export const CallTimer = () => {
  const { seconds, hours, minutes } = useTimer();
  return (
    <Flex>
      <Typography variant="body1">
        {`${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`}
      </Typography>
    </Flex>
  );
};
