import React from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@utils/cn';

export interface AppIconProps {
  id: string;
  nameLocale: string;
  Icon: React.ElementType;
  icon: React.ReactNode;
  backgroundColor: string;
  color: string;
  notification: any;
  isDockItem?: boolean;
}

export const AppIcon: React.FC<AppIconProps> = ({
  id,
  nameLocale,
  Icon,
  backgroundColor = '#f0fdf4',
  color = '#4ade80',
  icon,
  notification,
  isDockItem,
}) => {
  const [t] = useTranslation();

  return (
    <button
      className={cn(
        'group p-0 bg-transparent flex flex-col items-center text-center w-[90px]',
        !isDockItem && 'mb-6'
      )}
    >
      <div className="relative">
        {notification?.badge >= 2 && (
          <div className="absolute -top-1.5 -right-1.5 min-w-[20px] h-[20px] px-1 bg-red-600 text-white text-[11px] font-bold rounded-full flex items-center justify-center z-10 border-2 border-background shadow-sm">
            {notification.badge}
          </div>
        )}

        {Icon ? (
          <div className="w-[64px] h-[64px] flex items-center justify-center text-[2.125rem]">
            <Icon fontSize="inherit" className="w-full h-full" />
          </div>
        ) : (
          <div
            className="transition-all duration-200 transform group-hover:scale-105 group-hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)] flex justify-center items-center rounded-[18px] overflow-hidden w-[64px] h-[64px] text-[2.125rem]"
            style={{
              backgroundColor: backgroundColor,
              color: color,
              backgroundImage: `linear-gradient(45deg, rgba(0,0,0,0.2) 20%, transparent 90%)`
            }}
          >
            {icon ? <div className="w-full h-full overflow-hidden flex items-center justify-center">{icon}</div> : <>{t(nameLocale) as unknown as string}</>}
          </div>
        )}
      </div>
      {!isDockItem && (
        <span className="mt-1.5 text-[11px] text-white/90 font-medium whitespace-nowrap overflow-hidden text-ellipsis max-w-[70px] text-center [text-shadow:0_1px_2px_rgba(0,0,0,0.4)]">
          {t(nameLocale) as unknown as string}
        </span>
      )}
    </button>
  );
};
