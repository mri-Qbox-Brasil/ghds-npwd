import React, { useEffect, useState } from 'react';
import { useSettings } from '../../apps/settings/hooks/useSettings';
import { useTranslation } from 'react-i18next';
import { cn } from '@utils/cn';

export const PictureReveal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings] = useSettings();
  const [covered, setCovered] = useState<boolean>(false);
  const [ready, setReady] = useState<boolean>(false);
  const [t] = useTranslation();

  useEffect(() => {
    if (settings.streamerMode === true) {
      setCovered(true);
    }
    setReady(true);
  }, [settings.streamerMode]);

  const onClickCover = () => setCovered(false);

  return (
    <div className="w-full relative flex flex-col justify-center items-center">
      <div
        onClick={onClickCover}
        className={cn(
          "cursor-pointer bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 inset-0 absolute flex items-center justify-center z-10 p-4 text-center text-sm font-medium transition-opacity duration-300",
          covered ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        )}
      >
        {t('GENERIC_CLICK_TO_REVEAL') as unknown as string}
      </div>
      <div className={cn("w-full h-full min-h-[50px]", ready ? "visible" : "invisible")}>
        {children}
      </div>
    </div>
  );
};
