import React from 'react';
import { darken, Theme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import { green } from '@mui/material/colors';
import { Badge } from '@mui/material';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles<Theme, { color: string; backgroundColor: string }>((theme) => ({
  root: {
    padding: 0,
    background: 'transparent',
    marginBottom: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    width: '90px', // Define a largura máxima para o ícone e o texto
  },
  avatar: {
    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    boxShadow: 'rgba(0, 0, 0, 0.00) 0px 1px 3px 0px, rgba(27, 31, 35, 0.00) 0px 0px 0px 2px',
    '&:hover': {
      transform: 'scale(1.05)',
      boxShadow: 'rgba(0, 0, 0, 0.2) 0px 4px 12px',
      background: ({ backgroundColor }) => {
        return `linear-gradient(45deg, ${darken(backgroundColor, 0.35)} 10%, ${backgroundColor} 90%)`;
      },
    },
    background: ({ backgroundColor }) => {
      return `linear-gradient(45deg, ${darken(backgroundColor, 0.2)} 20%, ${backgroundColor} 90%)`;
    },
    color: ({ color }) => color,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
    overflow: 'hidden',
    width: theme.spacing(7.2),
    height: theme.spacing(7.2),
    fontSize: theme.typography.h4.fontSize,
    '& img': {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
    '& svg': {
      width: '100%',
      height: '100%',
    },
  },
  icon: {
    fontSize: theme.typography.h4.fontSize,
    width: theme.spacing(7.2),
    height: theme.spacing(7.2),
  },
  name: {
    marginTop: theme.spacing(0.5),
    fontSize: '12px',
    color: 'white',
    weight: 'bold',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '80px',
    textAlign: 'center',
    textShadow: '1px 1px 1px rgba(0, 0, 0, 0.3)',
  },
}));

export interface AppIconProps {
  id: string;
  nameLocale: string;
  Icon: React.ElementType;
  icon: React.ReactNode;
  backgroundColor: string;
  color: string;
  notification: any; // Fallback to any or the correct typing as Notification wasn't correctly imported
  isDockItem?: boolean;
}

export const AppIcon: React.FC<AppIconProps> = ({
  id,
  nameLocale,
  Icon,
  backgroundColor,
  color,
  icon,
  notification,
  isDockItem,
}) => {
  const [t] = useTranslation();
  const classes = useStyles({
    backgroundColor: backgroundColor || green[50],
    color: color || green[400],
  });

  return (
    <button className={classes.root} style={isDockItem ? { marginBottom: 0 } : {}}>
      <Badge
        color="error"
        badgeContent={notification?.badge}
        invisible={!notification || notification.badge < 2}
      >
        {Icon ? (
          <Icon className={classes.icon} fontSize="large" />
        ) : (
          <div className={classes.avatar}>
            {icon ? <>{icon}</> : <>{t(nameLocale)}</>}
          </div>
        )}
      </Badge>
      {!isDockItem && <span className={classes.name}>{String(t(nameLocale))}</span>}
    </button>
  );
};
