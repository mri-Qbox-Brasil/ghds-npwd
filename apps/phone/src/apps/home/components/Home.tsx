import React from 'react';
import { AppWrapper } from '@ui/components';
import { GridMenu } from '@ui/components/GridMenu';
import { useApps } from '@os/apps/hooks/useApps';
import { useExternalApps } from '@common/hooks/useExternalApps';
import { Link } from 'react-router-dom';


export const HomeApp: React.FC = () => {
  const { apps } = useApps();
  const externalApps = useExternalApps();

  const gridApps = apps?.filter((a) => !a.isDockApp) || [];

  return (
    <AppWrapper>
      <div className="pt-[80px] px-[16px]">
        {apps && <GridMenu items={[...gridApps, ...externalApps]} />}
      </div>
    </AppWrapper>
  );
};
