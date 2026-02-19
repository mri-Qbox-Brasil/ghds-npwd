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
    '&:hover': {
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
    width: theme.spacing(7.2),
    height: theme.spacing(7.2),
    fontSize: theme.typography.h4.fontSize,
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
  icon: React.ElementType;
  backgroundColor: string;
  color: string;
  notification: INotificationIcon;
}

export const AppIcon: React.FC<AppIconProps> = ({
  id,
  nameLocale,
  Icon,
  backgroundColor,
  color,
  icon,
  notification,
}) => {
  const [t] = useTranslation();
  const classes = useStyles({
    backgroundColor: backgroundColor || green[50],
    color: color || green[400],
  });

  return (
    <button className={classes.root}>
      <Badge
        color="error"
        badgeContent={notification?.badge}
        invisible={!notification || notification.badge < 2}
      >
        {Icon ? (
          <Icon className={classes.icon} fontSize="large" />
        ) : (
          <div className={classes.avatar}>{icon || t(nameLocale)}</div>
        )}
      </Badge>
      <span className={classes.name}>{t(nameLocale)}</span>
    </button>
  );
};
