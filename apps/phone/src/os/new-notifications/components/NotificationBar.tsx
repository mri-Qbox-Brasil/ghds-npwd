import React, { useEffect, useRef } from 'react';

import { Flex } from '@ui/components/ui/flex';
import { Typography } from '@ui/components/ui/typography';

import { ChevronUp } from 'lucide-react';
import { NotificationItem } from './NotificationItem';
import usePhoneTime from '../../phone/hooks/usePhoneTime';
import {
  useNavbarUncollapsed,
  useControlCenterOpen,
  useUnreadNotificationIds,
  useUnreadNotifications,
  useStatusBarStyle,
} from '@os/new-notifications/state';
import { useApp } from '@os/apps/hooks/useApps';
import { phoneState } from '@os/phone/hooks/state';
import { useRecoilValue } from 'recoil';
import { UnreadNotificationBarProps } from '@typings/notifications';
import { useNotification } from '../useNotification';
import { cn } from '@utils/css';
import { getAmbientBrightness } from '@utils/getBrightness';
import { useLocation } from 'react-router-dom';
import { useWallpaper } from '../../../apps/settings/hooks/useWallpaper';
import { useSettings } from '../../../apps/settings/hooks/useSettings';
import { ControlCenter } from './ControlCenter';


interface WrapperGridProps {
  tgtNoti?: UnreadNotificationBarProps;
}

const IconUnreadGrid: React.FC<WrapperGridProps> = ({ tgtNoti }) => {
  const app = useApp(tgtNoti?.appId);
  if (!app || !app.NotificationIcon) return null;
  return (
    <div className="w-[14px] h-[14px] flex items-center justify-center text-white mx-0.5">
      {/* @ts-ignore */}
      <app.NotificationIcon fontSize="inherit" />
    </div>
  );
};

const UnreadNotificationListItem: React.FC<{ tgtNotiId: string }> = ({ tgtNotiId }) => {
  const notiContents = useUnreadNotifications().find((n) => (n as any).notiId === tgtNotiId || (n as any).id === tgtNotiId);
  if (!notiContents) return null;
  return <NotificationItem key={tgtNotiId} {...notiContents} id={tgtNotiId} />;
};

const SignalIcon: React.FC<{ color: string }> = ({ color }) => (
  <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="8" width="3" height="4" rx="0.8" fill={color} />
    <rect x="4.2" y="5.5" width="3" height="6.5" rx="0.8" fill={color} />
    <rect x="8.4" y="2.5" width="3" height="9.5" rx="0.8" fill={color} />
    <rect x="12.6" y="0" width="3" height="12" rx="0.8" fill={color} />
  </svg>
);

const BatteryIcon: React.FC<{ color: string }> = ({ color }) => (
  <svg width="25" height="12" viewBox="0 0 25 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="0.5" y="0.5" width="21" height="11" rx="3.5" stroke={color} strokeOpacity="0.35" />
    <rect x="2" y="2" width="16" height="8" rx="2" fill={color} />
    <path d="M23 4v4a2 2 0 000-4z" fill={color} fillOpacity="0.4" />
  </svg>
);

export const NotificationBar = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const time = usePhoneTime();
  const { pathname } = useLocation();
  const wallpaper = useWallpaper();
  const [settings] = useSettings();
  const isLocked = useRecoilValue(phoneState.isLocked);

  const [barCollapsed, setBarUncollapsed] = useNavbarUncollapsed();
  const [controlCenterOpen, setControlCenterOpen] = useControlCenterOpen();

  const [statusStyle, setStatusBarStyle] = useStatusBarStyle();
  const unreadNotificationIds = useUnreadNotificationIds();
  const unreadNotifications = useUnreadNotifications();
  const { markAllAsRead } = useNotification();
  const resourceConfig = useRecoilValue(phoneState.resourceConfig);
  const carrierName = (resourceConfig as any)?.lockscreen?.carrier || 'MRI';

  // Ambient Sensor: Detect background brightness automatically
  useEffect(() => {
    const detectBrightness = async () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const style = await getAmbientBrightness(
        rect.left + rect.width / 2,
        rect.top + rect.height / 2,
        containerRef.current,
        wallpaper
      );

      setStatusBarStyle(style);
    };

    const timeout = setTimeout(detectBrightness, 200);
    return () => clearTimeout(timeout);
  }, [pathname, wallpaper, settings.theme.value, controlCenterOpen, setStatusBarStyle]);

  const handleClearNotis = async () => {
    setBarUncollapsed(false);
    await markAllAsRead();
  };

  useEffect(() => {
    if (unreadNotificationIds.length === 0) {
      setBarUncollapsed(false);
    }
  }, [unreadNotificationIds, setBarUncollapsed]);

  const handleLeftClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (controlCenterOpen) {
      setControlCenterOpen(false);
      return;
    }
    setBarUncollapsed((curr) => !curr);
  };

  const handleRightClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (barCollapsed) {
      setBarUncollapsed(false);
      return;
    }
    setControlCenterOpen((curr) => !curr);
  };

  return (
    <>
      <div
        ref={containerRef}
        className={cn(
          "absolute top-0 left-0 w-full z-[10001] px-8 pt-6 pb-2 flex items-center justify-between shrink-0 bg-transparent pointer-events-none transition-colors duration-300",
          statusStyle === 'light' ? "text-white" : "text-black"
        )}
      >
        {/* Invisible hitboxes for iOS-like swipe from top */}
        <div className="absolute inset-0 flex w-full h-12 pointer-events-auto z-10">
          <div className="flex-1 h-full cursor-pointer" onClick={handleLeftClick} />
          <div className="w-[120px] h-full cursor-pointer" onClick={handleRightClick} />
        </div>

        <div className={cn(
          "font-sans text-[15px] font-semibold tracking-tight leading-none z-0 mt-0.5 min-w-[40px] transition-all duration-300",
          isLocked ? "opacity-100" : "opacity-100"
        )}>
          {isLocked ? carrierName : (time || '00:00')}
        </div>

        <div className="flex flex-col items-center gap-1.5 overflow-visible z-0 mt-0.5">
          <div className="flex items-center gap-1.5">
            <SignalIcon color="currentColor" />
            <BatteryIcon color="currentColor" />
          </div>
          {/* iOS Control Center Handle Indicator (Always below the right side icons on Lockscreen) */}
          <div className={cn(
            "w-[45px] h-[3px] rounded-full transition-opacity duration-300 ml-auto",
            statusStyle === 'light' ? "bg-white/50" : "bg-black/30",
            isLocked ? "opacity-100" : "opacity-0"
          )} />
        </div>
      </div>

      {/* Control Center */}
      <ControlCenter />

      {/* Notification Center */}
      <div
        className="absolute inset-0 overflow-hidden z-[10003]"
        style={{ pointerEvents: barCollapsed ? 'auto' : 'none' }}
      >
        {/* Blur backdrop overlay */}
        <div
          className={cn(
            "absolute inset-0 bg-black/40 backdrop-blur-md transition-opacity duration-500",
            barCollapsed ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setBarUncollapsed(false)}
          data-ignore-brightness="true"
        />

        <div
          className={cn(
            "absolute inset-0 w-full h-full pt-[80px] px-4 flex flex-col transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1)",
            barCollapsed ? "translate-y-0" : "-translate-y-full"
          )}
        >
          {/* Header and Clear Button */}
          <div className="flex items-center justify-between px-2 mb-4">
            <Typography variant="body2" className="text-[20px] font-bold tracking-tight text-white drop-shadow-md">
              Central de Notificações
            </Typography>
            {unreadNotificationIds?.length > 0 && (
              <button
                className="bg-white/20 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-[13px] font-semibold hover:bg-white/30 active:scale-95 transition-all shadow-sm border border-white/10"
                onClick={handleClearNotis}
              >
                Limpar
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto pb-10 hide-scrollbar space-y-2.5">
            {unreadNotificationIds &&
              unreadNotificationIds
                .filter((val, idx, self) => idx === self.findIndex((t: string) => t === val))
                .map((notification, idx) => (
                  <UnreadNotificationListItem key={idx} tgtNotiId={notification} />
                ))}

            {!unreadNotificationIds.length && (
              <div className="flex flex-col items-center justify-center mt-20 opacity-60">
                <span className="text-white font-medium text-[16px]">Nenhuma notificação nova</span>
                <span className="text-white/70 text-[13px] mt-1">Sua caixa de entrada está limpa.</span>
              </div>
            )}
          </div>

          <Flex justify="center" className="pb-8 pt-2">
            <button
              className="mx-auto text-white/50 hover:text-white cursor-pointer appearance-none bg-transparent border-none p-2 rounded-full active:scale-90 transition-all font-semibold"
              onClick={() => setBarUncollapsed(false)}
            >
              Deslize para Cima
            </button>
          </Flex>
        </div>
      </div>
    </>
  );
};
