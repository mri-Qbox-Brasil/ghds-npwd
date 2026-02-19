import React, { useEffect } from 'react';
import { useTheme } from '@mui/material';

import {
  Typography,
  Grid,
  IconButton,
  Slide,
  Paper,
  Box,
  List,
  Divider,
  GridProps,
  Button,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';

import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import Default from '../../../config/default.json';
import { NotificationItem } from './NotificationItem';
import usePhoneTime from '../../phone/hooks/usePhoneTime';
import { NoNotificationText } from './NoNotificationText';
import {
  notifications,
  useNavbarUncollapsed,
  useUnreadNotificationIds,
  useUnreadNotifications,
} from '@os/new-notifications/state';
import { useRecoilValue } from 'recoil';
import { useApp } from '@os/apps/hooks/useApps';
import { UnreadNotificationBarProps } from '@typings/notifications';
import { useNotification } from '../useNotification';
import batteryImg from '../../../apps/imgs/battery.png';
import batteryDark from '../../../apps/imgs/battery-dark.png';
import { cn } from '@utils/css';
import { IoIosCloseCircle } from '@react-icons/all-files/io/IoIosCloseCircle';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: 'transparent',
    marginTop: '20px',
    height: '30px',
    width: '100%',
    color: theme.palette.text.primary,
    zIndex: 99,
    paddingLeft: '30px',
    paddingRight: '30px',
    position: 'relative',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  drawer: {
    backgroundColor: 'transparent',
    width: '92%',
    position: 'absolute',
    left: '4%',
    top: '50px',
    zIndex: 98,
    borderRadius: '20px', // Cantos arredondados
    boxShadow: 'none',
    // boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)', // Leve sombra
  },
  paper: {
    borderRadius: '15px',
    marginBottom: '10px',
    padding: '15px',
    // boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    backgroundColor: theme.palette.mode === 'dark' ? '#333' : '#fff', // Ajuste dinâmico de cor
  },
  text: {
    position: 'relative',
    lineHeight: '50px',
    color: theme.palette.text.primary,
  },
  icon: {
    padding: '4px',
    color: theme.palette.text.primary,
  },
  collapseBtn: {
    margin: '0 auto',
  },
  timeText: {
    fontSize: '18px', // Tamanho maior para o texto do horário
    fontWeight: 500, // Mais próximo ao estilo do iOS
  },
}));

interface WrapperGridProps extends GridProps {
  tgtNoti?: UnreadNotificationBarProps;
  key: string | number;
}

const IconUnreadGrid: React.FC<WrapperGridProps> = ({ tgtNoti }) => {
  const notificationTgtApp = useApp(tgtNoti.appId);

  return (
    <Grid
      item
      key={tgtNoti.id}
      component={IconButton}
      sx={{
        color: 'text.primary',
        fontSize: 'small',
      }}
    >
      {notificationTgtApp.notificationIcon}
    </Grid>
  );
};

interface UnreadNotificationListItemProps {
  tgtNotiId: string;
  key: string | number;
}

const UnreadNotificationListItem: React.FC<UnreadNotificationListItemProps> = ({ tgtNotiId }) => {
  const notiContents = useRecoilValue(notifications(tgtNotiId));

  return <NotificationItem key={tgtNotiId} {...notiContents} />;
};

export const NotificationBar = () => {
  const classes = useStyles();
  const time = usePhoneTime();
  const theme = useTheme();
  // const time = '04:20'; //  mock dev ghds

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
        className={cn(classes.root, 'flex flex-nowrap items-center justify-between')}
        onClick={() => {
          setBarUncollapsed((curr) => !curr);
        }}
      >
        {time && (
          <Grid item className={classes.item}>
            <Typography className={classes.text} variant="button">
              {time}
            </Typography>
          </Grid>
        )}
        <Grid container item wrap="nowrap">
          {unreadNotifications &&
            unreadNotifications
              .filter((val, idx, self) => idx === self.findIndex((t) => t.appId === val.appId))
              .map((notification, idx) => {
                return <IconUnreadGrid tgtNoti={notification} key={idx} />;
              })}
        </Grid>

        <div className="flex items-center justify-end">
          <div>
            <svg
              width="19"
              height="13"
              viewBox="0 0 19 13"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.5751 3.79376C10.5751 3.24192 11.0224 2.79456 11.5743 2.79456H12.5735C13.1253 2.79456 13.5727 3.24192 13.5727 3.79376V11.7874C13.5727 12.3393 13.1253 12.7866 12.5735 12.7866H11.5743C11.0224 12.7866 10.5751 12.3393 10.5751 11.7874V3.79376Z"
                fill={theme.palette.mode === 'dark' ? '#FFF' : '#000'} // Cor dinâmica do SVG
              />
              <path
                d="M15.5711 1.79535C15.5711 1.2435 16.0185 0.796143 16.5703 0.796143H17.5695C18.1214 0.796143 18.5687 1.2435 18.5687 1.79535V11.7874C18.5687 12.3393 18.1214 12.7866 17.5695 12.7866H16.5703C16.0185 12.7866 15.5711 12.3393 15.5711 11.7874V1.79535Z"
                fill={theme.palette.mode === 'dark' ? '#FFF' : '#000'} // Cor dinâmica do SVG
              />
              <path
                d="M5.57904 7.29099C5.57904 6.73914 6.0264 6.29178 6.57825 6.29178H7.57746C8.1293 6.29178 8.57666 6.73914 8.57666 7.29099V11.7874C8.57666 12.3393 8.1293 12.7866 7.57746 12.7866H6.57825C6.0264 12.7866 5.57904 12.3393 5.57904 11.7874V7.29099Z"
                fill={theme.palette.mode === 'dark' ? '#FFF' : '#000'} // Cor dinâmica do SVG
              />
              <path
                d="M0.583008 9.78901C0.583008 9.23716 1.03037 8.7898 1.58221 8.7898H2.58142C3.13327 8.7898 3.58063 9.23716 3.58063 9.78901V11.7874C3.58063 12.3393 3.13327 12.7866 2.58142 12.7866H1.58221C1.03037 12.7866 0.583008 12.3393 0.583008 11.7874V9.78901Z"
                fill={theme.palette.mode === 'dark' ? '#FFF' : '#000'} // Cor dinâmica do SVG
              />
            </svg>
          </div>
          <div className="ml-3 w-8">
            {/* <BatteryFull /> */}

            <img src={theme.palette.mode === 'dark' ? batteryImg : batteryDark}></img>
          </div>
        </div>
      </div>
      <Slide direction="down" in={barCollapsed} mountOnEnter unmountOnExit>
        <div
          style={{
            height: '100%',
            position: 'absolute',
            width: '100%',
            zIndex: 1,
            // backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.8)',
          }}
        >
          <Paper square className={classes.drawer}>
            <Box py={1}>
              {unreadNotificationIds?.length !== 0 && (
                <Box pl={2}>
                  <Button color="inherit" size="small" onClick={handleClearNotis}>
                    {/* <IoIosCloseCircle fontSize={'24px'} color=""></IoIosCloseCircle> */}
                    Limpar
                  </Button>
                </Box>
              )}
              <List>
                {unreadNotificationIds &&
                  unreadNotificationIds
                    .filter((val, idx, self) => idx === self.findIndex((t: string) => t === val))
                    .map((notification, idx) => (
                      <UnreadNotificationListItem key={idx} tgtNotiId={notification} />
                    ))}
              </List>
            </Box>
            <Box display="flex" flexDirection="column">
              {!unreadNotificationIds.length && <NoNotificationText />}
              <IconButton
                className={classes.collapseBtn}
                size="small"
                onClick={() => setBarUncollapsed(false)}
              >
                <ArrowDropUpIcon />
              </IconButton>
            </Box>
          </Paper>
        </div>
      </Slide>
    </>
  );
};
