import React from 'react';
import { useApp } from '@os/apps/hooks/useApps';
import { useRecoilValue } from 'recoil';
import { notifications, useSetNavbarUncollapsed } from '@os/new-notifications/state';
import { useNotification } from '@os/new-notifications/useNotification';
import { useHistory } from 'react-router-dom';
import { ListItem } from '@ui/components/ListItem';
import { Typography } from '@ui/components/ui/typography';

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

  const handleOnClose = () => {
    markAsRead(id);
    closeBar(false); // set's to be to collapsed - wording is weird
    history.push(path);
  };

  return (
    <ListItem
      button
      onClick={handleOnClose}
      className="relative bg-background opacity-95 mb-2.5 rounded-[20px] shadow-lg hover:opacity-100 hover:shadow-xl dark:bg-[#333]"
      key={key}
    >
      {icon && <div className="min-w-[35px] max-w-[5px] mr-2.5 flex justify-center">{icon as unknown as React.ReactNode}</div>}
      <Typography variant="body1">{content}</Typography>
    </ListItem>
  );
};
