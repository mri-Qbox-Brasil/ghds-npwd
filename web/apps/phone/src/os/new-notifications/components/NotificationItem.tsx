import React from 'react';
import { useApp } from '@os/apps/hooks/useApps';
import { useRecoilValue } from 'recoil';
import { notifications, useSetNavbarUncollapsed } from '@os/new-notifications/state';
import { useNotification } from '@os/new-notifications/useNotification';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface NotificationItemProps {
  id: string;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({ id }) => {
  const { appId, content, secondaryTitle, path } = useRecoilValue(notifications(id));
  const { markAsRead } = useNotification();
  const app = useApp(appId);
  const history = useHistory();
  const [t] = useTranslation();
  const closeBar = useSetNavbarUncollapsed();

  const handleOnClose = () => {
    markAsRead(id);
    closeBar(false);
    if (path) history.push(path);
  };

  const title = secondaryTitle || (app?.nameLocale ? t(app.nameLocale) : 'Notificação');

  return (
    <div
      onClick={handleOnClose}
      className="relative cursor-pointer w-[360px] min-h-[72px] mx-auto bg-white/60 dark:bg-black/40 text-neutral-900 dark:text-white rounded-[24px] shadow-sm border border-white/20 dark:border-white/10 overflow-hidden flex transition-transform active:scale-[0.98]"
    >
      <div className="flex items-center justify-center py-3 pl-4">
        <div className="w-10 h-10 rounded-[10px] overflow-hidden bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-700 dark:to-neutral-800 flex items-center justify-center shadow-sm text-neutral-600 dark:text-neutral-300 [&>svg]:w-6 [&>svg]:h-6">
          {app?.icon ? (
            app.icon
          ) : (
            <div className="w-5 h-5 bg-neutral-400 rounded-sm" />
          )}
        </div>
      </div>

      <div className="flex flex-col justify-center py-3 px-3 flex-1">
        <span className="font-semibold text-[15px] leading-tight line-clamp-1">
          {title}
        </span>

        {content && (
          <div className="text-[14px] text-neutral-600 dark:text-neutral-300 leading-snug line-clamp-2 mt-0.5">
            {content}
          </div>
        )}
      </div>
    </div>
  );
};
