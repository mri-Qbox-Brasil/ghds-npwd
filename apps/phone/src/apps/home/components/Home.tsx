import React from 'react';
import { AppWrapper } from '@ui/components';
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
      <div className="pt-[80px] px-[16px]">
        {apps && <GridMenu items={[...gridApps, ...externalApps]} />}
      </div>

      {dockApps.length > 0 && <Dock apps={dockApps} />}
    </AppWrapper>
  );
};
