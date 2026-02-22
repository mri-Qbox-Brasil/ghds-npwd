import React, { useEffect, useState } from 'react';
import { useSettings } from '../../apps/settings/hooks/useSettings';
import { useTranslation } from 'react-i18next';
import { cn } from '@utils/cn';
import { Eye } from 'lucide-react';

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
          "cursor-pointer inset-0 absolute flex flex-col items-center justify-center z-10 gap-2 transition-opacity duration-300 backdrop-blur-2xl bg-white/60 dark:bg-black/60",
          covered ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        )}
      >
        <div className="h-10 w-10 rounded-full bg-white/80 dark:bg-neutral-800/80 flex items-center justify-center shadow-sm">
          <Eye size={20} className="text-neutral-500" />
        </div>
        <span className="text-[13px] font-medium text-neutral-600 dark:text-neutral-300">
          Toque para revelar
        </span>
      </div>
      <div className={cn("w-full h-full min-h-[50px]", ready ? "visible" : "invisible")}>
        {children}
      </div>
    </div>
  );
};
