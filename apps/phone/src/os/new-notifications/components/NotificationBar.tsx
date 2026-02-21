import React, { useEffect, useRef } from 'react';

import { Flex } from '@ui/components/ui/flex';
import { Typography } from '@ui/components/ui/typography';
import { List } from '@ui/components/List';

import { ChevronUp } from 'lucide-react';
import { NotificationItem } from './NotificationItem';
import usePhoneTime from '../../phone/hooks/usePhoneTime';
import { NoNotificationText } from './NoNotificationText';
import {
  useNavbarUncollapsed,
  useUnreadNotificationIds,
  useUnreadNotifications,
  useStatusBarStyle,
} from '@os/new-notifications/state';
import { useApp } from '@os/apps/hooks/useApps';
import { UnreadNotificationBarProps } from '@typings/notifications';
import { useNotification } from '../useNotification';
import { cn } from '@utils/css';
import { getAmbientBrightness } from '@utils/getBrightness';
import { useLocation } from 'react-router-dom';
import { useWallpaper } from '../../../apps/settings/hooks/useWallpaper';


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

  const [barCollapsed, setBarUncollapsed] = useNavbarUncollapsed();
  const [statusStyle, setStatusBarStyle] = useStatusBarStyle();
  const unreadNotificationIds = useUnreadNotificationIds();
  const unreadNotifications = useUnreadNotifications();
  const { markAllAsRead } = useNotification();

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

    // Run detection with a slight delay to ensure app is rendered
    const timeout = setTimeout(detectBrightness, 200);
    return () => clearTimeout(timeout);
  }, [pathname, wallpaper, setStatusBarStyle]);

  const handleClearNotis = async () => {
    setBarUncollapsed(false);
    await markAllAsRead();
  };

  useEffect(() => {
    if (unreadNotificationIds.length === 0) {
      setBarUncollapsed(false);
    }
  }, [unreadNotificationIds, setBarUncollapsed]);


  return (
    <>
      <div
        ref={containerRef}
        className={cn(
          "absolute top-0 left-0 w-full z-[100] px-10 pt-6 pb-2 flex items-center justify-between shrink-0 hover:cursor-pointer bg-transparent pointer-events-auto transition-colors duration-300",
          statusStyle === 'light' ? "text-white" : "text-black"
        )}
        onClick={() => setBarUncollapsed((curr) => !curr)}
      >
        {time ? (
          <div className="font-sans text-[14px] font-medium tracking-tight leading-none">
            {time}
          </div>
        ) : <div className="w-10" />}

        <div className="flex items-center gap-1">
          {unreadNotifications &&
            unreadNotifications
              .filter((val, idx, self) => idx === self.findIndex((t) => t.appId === val.appId))
              .map((notification, idx) => (
                <IconUnreadGrid tgtNoti={notification} key={idx} />
              ))}
        </div>

        <div className="flex items-center gap-1.5 overflow-visible">
          <SignalIcon color="currentColor" />
          <BatteryIcon color="currentColor" />
        </div>
      </div>

      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden', zIndex: 97, pointerEvents: barCollapsed ? 'auto' : 'none' }}>
        <div
          className={cn(
            "absolute top-2.5 left-0 w-full h-full transition-all duration-400 cubic-bezier(0.16, 1, 0.3, 1)",
            barCollapsed ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
          )}
        >
          <div
            className="absolute left-[6%] top-[60px] w-[88%] z-[98] rounded-[20px] overflow-hidden backdrop-blur-md bg-background/70 border border-border/50 shadow-2xl"
          >
            <div className="flex items-center justify-between px-4 pt-4 pb-2">
              <Typography variant="body2" className="text-[13px] font-bold tracking-tight uppercase text-muted-foreground">
                Notificações
              </Typography>
              {unreadNotificationIds?.length > 0 && (
                <button className="font-sans text-[13px] font-bold text-blue-500 uppercase appearance-none p-0 min-w-auto bg-transparent border-none cursor-pointer hover:text-blue-400 active:scale-95 transition-all" onClick={handleClearNotis}>
                  Limpar tudo
                </button>
              )}
            </div>

            <div className="pb-2 px-2">
              <List>
                {unreadNotificationIds &&
                  unreadNotificationIds
                    .filter((val, idx, self) => idx === self.findIndex((t: string) => t === val))
                    .map((notification, idx) => (
                      <UnreadNotificationListItem key={idx} tgtNotiId={notification} />
                    ))}
              </List>
              {!unreadNotificationIds.length && <NoNotificationText />}
            </div>

            <Flex justify="center" className="pb-2">
              <button
                className="mx-auto text-muted-foreground hover:text-foreground cursor-pointer appearance-none bg-transparent border-none p-1.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 active:scale-90 transition-all"
                onClick={() => setBarUncollapsed(false)}
              >
                <ChevronUp size={20} strokeWidth={2.5} />
              </button>
            </Flex>
          </div>
        </div>
      </div>
    </>
  );
};
