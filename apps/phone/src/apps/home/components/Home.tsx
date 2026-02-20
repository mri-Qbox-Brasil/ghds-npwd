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

  const dockApps = apps?.filter((a) => a.isDockApp) || [];
  const gridApps = apps?.filter((a) => !a.isDockApp) || [];

  return (
    <AppWrapper>
      <Box component="div" mt={3} px={1.6}>
        {apps && <GridMenu xs={3} items={[...gridApps, ...externalApps]} />}
      </Box>

      {dockApps.length > 0 && <Dock apps={dockApps} />}
    </AppWrapper>
  );
};
