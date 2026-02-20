import React from 'react';
import { AppWrapper } from '@ui/components';
import { Box, styled } from '@mui/material';
import { GridMenu } from '@ui/components/GridMenu';
import { useApps } from '@os/apps/hooks/useApps';
import { useExternalApps } from '@common/hooks/useExternalApps';
import { Link } from 'react-router-dom';

import { Dock } from './Dock';

export const HomeApp: React.FC = () => {
  const { apps } = useApps();
  const externalApps = useExternalApps();
  return (
    <AppWrapper>
      <Box component="div" mt={3} px={1.6}>
        {apps && <GridMenu xs={3} items={[...apps, ...externalApps]} />}
      </Box>

      {apps && <Dock apps={apps.slice(0, 4)} />}
    </AppWrapper>
  );
};
