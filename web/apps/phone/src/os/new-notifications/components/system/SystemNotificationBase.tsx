import { Flex } from '@ui/components/ui/flex';
import { Typography } from '@ui/components/ui/typography';
import { useApps } from '@os/apps/hooks/useApps';
import fetchNui from '@utils/fetchNui';
import { CustomContentProps, SnackbarContent, useSnackbar } from 'notistack';
import { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle, XCircle } from 'lucide-react';

interface SystemNotificationBaseProps extends CustomContentProps {
  secondaryTitle?: string;
  controls: boolean;
}

export type SystemNotificationBaseComponent = React.FC<SystemNotificationBaseProps>;

export const SystemNotificationBase = forwardRef<HTMLDivElement, SystemNotificationBaseProps>(
  (props, ref) => {
    const { secondaryTitle, message, controls } = props;
    const { closeSnackbar } = useSnackbar();
    const { getApp } = useApps();
    const app = getApp('SETTINGS');
    const [t] = useTranslation();

    const handleCloseNoti = () => {
      closeSnackbar(props.id);
    };

    const handleConfirmAction = async (e: React.MouseEvent) => {
      e.stopPropagation();
      await fetchNui('npwd:onNotificationConfirm', props.id);
    };

    const handleCancelAction = async (e: React.MouseEvent) => {
      e.stopPropagation();
      await fetchNui('npwd:onNotificationCancel', props.id);
    };

    return (
      <SnackbarContent style={{ minWidth: '100%', display: 'flex', justifyContent: 'center' }} ref={ref}>
        <div
          onClick={handleCloseNoti}
          className="relative cursor-pointer w-[360px] min-h-[72px] mx-auto bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-3xl text-neutral-900 dark:text-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] border border-white/20 dark:border-white/10 overflow-hidden flex flex-col p-4 mt-2 pointer-events-auto transition-transform active:scale-[0.98]"
        >
          <div className="flex items-center w-full mb-1">
            <div
              className="w-6 h-6 rounded-[6px] flex items-center justify-center shadow-sm text-white"
              style={{ backgroundColor: app.backgroundColor }}
            >
              <app.NotificationIcon fontSize="small" />
            </div>
            <div className="font-semibold text-[13px] opacity-60 ml-2 flex-grow uppercase tracking-wide">
              {t('APPS_SYSTEM') as unknown as string}
            </div>
            {secondaryTitle && (
              <div className="text-[12px] opacity-50 font-medium">
                {secondaryTitle}
              </div>
            )}
          </div>

          <div className="font-medium text-[15px] leading-tight line-clamp-3 mt-1 text-black dark:text-white">
            {message as string}
          </div>

          {controls && (
            <div className="flex gap-3 mt-3">
              <button
                onClick={handleConfirmAction}
                className="flex-1 bg-neutral-900 dark:bg-white text-white dark:text-black py-2 rounded-xl font-semibold text-[14px] transition-colors flex justify-center items-center opacity-90 hover:opacity-100"
              >
                Confirmar
              </button>
              <button
                onClick={handleCancelAction}
                className="flex-1 bg-red-500/10 text-red-500 py-2 rounded-xl font-semibold text-[14px] transition-colors flex justify-center items-center hover:bg-red-500/20"
              >
                Cancelar
              </button>
            </div>
          )}
        </div>
      </SnackbarContent>
    );
  },
);
