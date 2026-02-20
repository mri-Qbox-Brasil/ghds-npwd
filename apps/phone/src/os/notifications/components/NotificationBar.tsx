import React, { useEffect } from 'react';
import { Slide } from '@mui/material';
import { Signal, Battery, ChevronUp } from 'lucide-react';
import { Flex } from '@ui/components/ui/flex';
import { Typography } from '@ui/components/ui/typography';
import { List } from '@ui/components/List';
import { Divider } from '@ui/components/ui/divider';

import Default from '../../../config/default.json';
import { useNotifications } from '../hooks/useNotifications';
import { NotificationItem } from './NotificationItem';
import usePhoneTime from '../../phone/hooks/usePhoneTime';
import { NoNotificationText } from './NoNotificationText';
import { usePlayer } from '@os/phone/hooks/usePlayer';
import { usePhone } from '@os/phone/hooks/usePhone';

export const NotificationBar = () => {

  const { icons, notifications, removeNotification, barUncollapsed, setBarUncollapsed } =
    useNotifications();

  const time = usePhoneTime();
  const source = usePlayer();
  const { ResourceConfig } = usePhone();

  useEffect(() => {
    if (notifications.length === 0) {
      setBarUncollapsed(false);
    }
  }, [notifications, setBarUncollapsed]);

  if (!ResourceConfig) return null;
  const { showId } = ResourceConfig.general;

  return (
    <>
      <Flex
        align="center"
        justify="between"
        className="bg-background h-[30px] w-full text-foreground z-[99] px-[15px] relative hover:cursor-pointer shrink-0"
        onClick={() => {
          setBarUncollapsed((curr: boolean) => !curr);
        }}
      >
        <Flex align="center" style={{ flexWrap: 'nowrap' }}>
          {icons.map((notifIcon) => (
            <div key={notifIcon.key} className="p-1 text-foreground flex items-center justify-center">
              {notifIcon.icon as React.ReactNode}
            </div>
          ))}
        </Flex>
        {time && (
          <div className="mx-1.5 flex items-center">
            <Typography variant="body2" className="leading-[30px]">{time}</Typography>
          </div>
        )}
        <Flex align="center" justify="end" style={{ flexWrap: 'nowrap' }}>
          {showId && (
            <div className="mr-2 flex items-center">
              <Typography variant="body2" className="leading-[30px]">ID: {source}</Typography>
            </div>
          )}
          <div className="flex items-center">
            <Signal size={20} />
          </div>
          <div className="mx-1.5 flex items-center">
            <Typography variant="body2" className="leading-[30px] normal-case">{Default.cellProvider}</Typography>
          </div>
          <div className="flex items-center">
            <Battery style={{ transform: 'rotate(90deg)', display: 'block' }} size={20} />
          </div>
        </Flex>
      </Flex>
      <Slide direction="down" in={barUncollapsed} mountOnEnter unmountOnExit>
        <div className="bg-background w-full absolute top-[30px] z-[98] shadow-md border-b border-border/50">
          <div className="py-2">
            <List>
              <Divider />
              {notifications.map((notification, idx) => (
                <NotificationItem
                  key={idx}
                  {...notification}
                  onClose={(e) => {
                    e.stopPropagation();
                    notification.onClose?.(notification as any);
                    removeNotification(idx);
                  }}
                  onClickClose={() => {
                    setBarUncollapsed(false);
                    if (!notification.cantClose) {
                      removeNotification(idx);
                    }
                  }}
                />
              ))}
            </List>
          </div>
          <Flex direction="col">
            {!notifications.length && <NoNotificationText />}
            <button
              className="mx-auto appearance-none bg-transparent border-none p-1 rounded-full hover:bg-muted/50 transition-colors text-muted-foreground cursor-pointer"
              onClick={() => setBarUncollapsed(false)}
            >
              <ChevronUp />
            </button>
          </Flex>
        </div>
      </Slide>
    </>
  );
};
