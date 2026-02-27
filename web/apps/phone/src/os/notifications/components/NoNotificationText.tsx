import React from 'react';
import { Flex } from '@ui/components/ui/flex';
import { Typography } from '@ui/components/ui/typography';
import { useTranslation } from 'react-i18next';

export const NoNotificationText: React.FC = () => {
  const [t] = useTranslation();

  return (
    <Flex className="w-full py-2" justify="center">
      <Typography variant="body2" color="muted">
        🎉 {t('NOTIFICATIONS.NO_UNREAD') as unknown as string} 🎉
      </Typography>
    </Flex>
  );
};
