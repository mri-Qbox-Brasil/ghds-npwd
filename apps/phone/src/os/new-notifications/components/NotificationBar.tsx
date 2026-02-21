import React, { useEffect } from 'react';

import { Slide } from '@mui/material';
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
} from '@os/new-notifications/state';
import { useApp } from '@os/apps/hooks/useApps';
import { UnreadNotificationBarProps } from '@typings/notifications';
import { useNotification } from '../useNotification';
import { cn } from '@utils/css';


interface WrapperGridProps {
  tgtNoti?: UnreadNotificationBarProps;
}

const IconUnreadGrid: React.FC<WrapperGridProps> = ({ tgtNoti }) => {
  const tgtNotiId = (tgtNoti as any)?.notiId || (tgtNoti as any)?.id;
  const app = useApp(tgtNoti?.appId);
  if (!app || !tgtNotiId) return null;
  return (
    <NotificationItem key={tgtNotiId} {...tgtNoti} id={tgtNotiId} />
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
  const time = usePhoneTime();

  const [barCollapsed, setBarUncollapsed] = useNavbarUncollapsed();
  const unreadNotificationIds = useUnreadNotificationIds();
  const unreadNotifications = useUnreadNotifications();
  const { markAllAsRead } = useNotification();

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
        className="absolute top-0 left-0 w-full text-foreground z-[100] px-10 pt-6 pb-2 flex items-center justify-between shrink-0 hover:cursor-pointer bg-transparent pointer-events-auto"
        onClick={() => setBarUncollapsed((curr) => !curr)}
      >
        {time ? (
          <div className="font-sans text-[15px] font-bold tracking-tight text-foreground leading-none">
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

        <div className="flex items-center gap-1.5 fill-foreground stroke-foreground text-foreground">
          <SignalIcon color="currentColor" />
          <BatteryIcon color="currentColor" />
        </div>
      </div>

      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden', zIndex: 97, pointerEvents: barCollapsed ? 'auto' : 'none' }}>
        <Slide direction="down" in={barCollapsed} mountOnEnter unmountOnExit>
          <div style={{ position: 'absolute', top: 10, left: 0, width: '100%', height: '100%' }}>
            <div
              className="absolute left-[6%] top-[60px] w-[88%] z-[98] rounded-[20px] overflow-hidden backdrop-blur-sm bg-background/70 border border-border"
            >
              <div className="flex items-center justify-between px-4 pt-3.5 pb-1.5">
                <Typography variant="body2" className="text-[13px] font-bold tracking-tight uppercase text-muted-foreground">
                  Notificações
                </Typography>
                {unreadNotificationIds?.length > 0 && (
                  <button className="font-sans text-[13px] font-medium text-primary uppercase appearance-none p-0 min-w-auto bg-transparent border-none cursor-pointer" onClick={handleClearNotis}>
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

              <Flex justify="center" className="pb-1">
                <button
                  className="mx-auto text-muted-foreground hover:text-foreground cursor-pointer appearance-none bg-transparent border-none p-1 rounded-full hover:bg-muted/50 transition-colors"
                  onClick={() => setBarUncollapsed(false)}
                >
                  <ChevronUp />
                </button>
              </Flex>
            </div>
          </div>
        </Slide>
      </div>
    </>
  );
};
