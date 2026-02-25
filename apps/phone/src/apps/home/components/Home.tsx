import React from 'react';
import { AppWrapper } from '@ui/components';
import { GridMenu } from '@ui/components/GridMenu';
import { useApps } from '@os/apps/hooks/useApps';
import { useExternalApps } from '@common/hooks/useExternalApps';
import { useAppStore } from '@apps/store/hooks/useAppStore';


export const HomeApp: React.FC = () => {
  const { apps } = useApps();
  const externalApps = useExternalApps();
  const { isInstalled, isLoaded } = useAppStore();

  const gridApps = apps?.filter((a) => {
    if (a.isDockApp) return false;
    if (a.isDisabled) return false;
    if (!isLoaded) return true; // Show all while loading to avoid empty flash
    return isInstalled(a.id);
  }) || [];

  return (
    <AppWrapper>
      <div className="pt-[80px] px-[16px]">
        {apps && <GridMenu items={[...gridApps, ...externalApps]} />}
      </div>
    </AppWrapper>
  );
};
