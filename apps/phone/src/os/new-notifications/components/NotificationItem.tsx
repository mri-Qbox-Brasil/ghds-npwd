import React from 'react';
import { ListItem, ListItemAvatar, ListItemText, useTheme } from '@mui/material';
import { useApp } from '@os/apps/hooks/useApps';
import { useRecoilValue } from 'recoil';
import { notifications, useSetNavbarUncollapsed } from '@os/new-notifications/state';
import { useNotification } from '@os/new-notifications/useNotification';
import { useHistory } from 'react-router-dom';

interface NotificationItemProps {
  id: string;
  key: string | number;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({ id, key }) => {
  const { appId, content, path } = useRecoilValue(notifications(id));
  const { markAsRead } = useNotification();
  const { icon } = useApp(appId);
  const history = useHistory();
  const closeBar = useSetNavbarUncollapsed();
  const theme = useTheme();

  const handleOnClose = () => {
    markAsRead(id);
    closeBar(false); // set's to be to collapsed - wording is weird
    history.push(path);
  };

  return (
    <ListItem
      button
      onClick={handleOnClose}
      sx={{ 
        position: 'relative', 
        backgroundColor: theme.palette.mode === 'dark' ? '#333' : '#fff',
        borderRadius: '20px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
        opacity: '0.94',
        marginBottom: '10px',
        '&:hover': {
          cursor: 'pointer',
          backgroundColor: theme.palette.mode === 'dark' ? '#333' : '#fff',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.4)',
          opacity: '0.97',
        },
        '& .MuiListItemAvatar-root': {
          minWidth: '35px',
          marginRight: '10px',
        },

      }}
      key={key}
    >
      {icon && <ListItemAvatar
        sx={{ maxWidth: '5px', marginRight: '10px' }}
      >{icon}</ListItemAvatar>}
      <ListItemText primary={content} />
    </ListItem>
  );
};
