import React, { useEffect } from 'react';
import { useTheme } from '@mui/material';

import {
  Typography,
  IconButton,
  Slide,
  Paper,
  Box,
  List,
  Button,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';

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


const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: 'transparent',
    width: '100%',
    color: theme.palette.text.primary,
    zIndex: 99,
    padding: '25px',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexShrink: 0,
    '&:hover': {
      cursor: 'pointer',
    },
  },

  timeText: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif',
    fontSize: '15px',
    fontWeight: 600,
    letterSpacing: '-0.3px',
    color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
    lineHeight: 1,
  },

  notiIcons: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },

  statusIcons: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },

  drawer: {
    position: 'absolute',
    left: '6%',
    top: '60px',
    width: '88%',
    zIndex: 98,
    borderRadius: '20px',
    overflow: 'hidden',
    backdropFilter: 'blur(5px)',
    WebkitBackdropFilter: 'blur(5px)',
    backgroundColor: theme.palette.mode === 'dark'
      ? 'rgba(28, 28, 30, 0.50)'
      : 'rgba(242, 242, 247, 0.50)',
    border: theme.palette.mode === 'dark'
      ? '0.5px solid rgba(255, 255, 255, 0.12)'
      : '0.5px solid rgba(0, 0, 0, 0.08)',
  },

  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 16px 6px',
  },

  drawerTitle: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif',
    fontSize: '13px',
    fontWeight: 700,
    letterSpacing: '0.4px',
    textTransform: 'uppercase' as const,
    color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)',
  },

  clearBtn: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif',
    fontSize: '13px',
    fontWeight: 500,
    color: theme.palette.mode === 'dark' ? '#0a84ff' : '#007AFF',
    textTransform: 'none' as const,
    padding: '0',
    minWidth: 'auto',
  },

  collapseBtn: {
    margin: '0 auto',
    color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.3)',
  },

  text: {
    position: 'relative',
    color: theme.palette.text.primary,
  },

  icon: {
    padding: '4px',
    color: theme.palette.text.primary,
  },
}));

interface WrapperGridProps {
  tgtNoti?: UnreadNotificationBarProps;
}

const IconUnreadGrid: React.FC<WrapperGridProps> = ({ tgtNoti }) => {
  const tgtNotiId = tgtNoti?.notiId;
  const app = useApp(tgtNoti?.appId);
  if (!app || !tgtNotiId) return null;
  return (
    <NotificationItem key={tgtNotiId} {...tgtNoti} />
  );
};

const UnreadNotificationListItem: React.FC<{ tgtNotiId: string }> = ({ tgtNotiId }) => {
  const notiContents = useUnreadNotifications().find((n) => n.notiId === tgtNotiId);
  if (!notiContents) return null;
  return <NotificationItem key={tgtNotiId} {...notiContents} />;
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
  const classes = useStyles();
  const time = usePhoneTime();
  const theme = useTheme();

  const [barCollapsed, setBarUncollapsed] = useNavbarUncollapsed();
  const unreadNotificationIds = useUnreadNotificationIds();
  const unreadNotifications = useUnreadNotifications();
  const { markAllAsRead } = useNotification();

  const iconColor = theme.palette.mode === 'dark' ? '#ffffff' : '#000000';

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
        className={classes.root}
        onClick={() => setBarUncollapsed((curr) => !curr)}
      >
        {time && (
          <Typography className={classes.timeText}>
            {time}
          </Typography>
        )}

        <div className={classes.notiIcons}>
          {unreadNotifications &&
            unreadNotifications
              .filter((val, idx, self) => idx === self.findIndex((t) => t.appId === val.appId))
              .map((notification, idx) => (
                <IconUnreadGrid tgtNoti={notification} key={idx} />
              ))}
        </div>

        <div className={classes.statusIcons}>
          <SignalIcon color={iconColor} />
          <BatteryIcon color={iconColor} />
        </div>
      </div>

      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden', zIndex: 97, pointerEvents: barCollapsed ? 'auto' : 'none' }}>
        <Slide direction="down" in={barCollapsed} mountOnEnter unmountOnExit>
          <div style={{ position: 'absolute', top: 10, left: 0, width: '100%', height: '100%' }}>
            <Paper
              square
              elevation={0}
              className={classes.drawer}
            >
              <div className={classes.drawerHeader}>
                <Typography className={classes.drawerTitle}>
                  Notificações
                </Typography>
                {unreadNotificationIds?.length > 0 && (
                  <Button className={classes.clearBtn} onClick={handleClearNotis} disableRipple>
                    Limpar tudo
                  </Button>
                )}
              </div>

              <Box pb={1} px={1}>
                <List disablePadding>
                  {unreadNotificationIds &&
                    unreadNotificationIds
                      .filter((val, idx, self) => idx === self.findIndex((t: string) => t === val))
                      .map((notification, idx) => (
                        <UnreadNotificationListItem key={idx} tgtNotiId={notification} />
                      ))}
                </List>
                {!unreadNotificationIds.length && <NoNotificationText />}
              </Box>

              <Box display="flex" justifyContent="center" pb={0.5}>
                <IconButton
                  className={classes.collapseBtn}
                  size="small"
                  onClick={() => setBarUncollapsed(false)}
                >
                  <ChevronUp />
                </IconButton>
              </Box>
            </Paper>
          </div>
        </Slide>
      </div>
    </>
  );
};
