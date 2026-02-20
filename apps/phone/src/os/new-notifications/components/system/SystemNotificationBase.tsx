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

    const handleConfirmAction = async () => {
      await fetchNui('npwd:onNotificationConfirm', props.id);
    };

    const handleCancelAction = async () => {
      await fetchNui('npwd:onNotificationCancel', props.id);
    };

    return (
      <SnackbarContent style={{ minWidth: '370px' }} ref={ref}>
        <Flex
          direction="col"
          onClick={handleCloseNoti}
          className="bg-paper p-4 rounded-xl shadow-[0_5px_15px_rgba(0,0,0,0.35)] w-full"
        >
          <Flex align="center" className="text-white w-full mb-2">
            <Flex
              align="center"
              justify="center"
              className="p-1 rounded-full text-base"
              style={{ backgroundColor: app.backgroundColor }}
            >
              <app.NotificationIcon fontSize="inherit" />
            </Flex>
            <div className="text-[#bfbfbf] font-normal pl-2 flex-grow text-base">
              {t('APPS_SYSTEM') as unknown as string}
            </div>
            <div>
              <Typography color="default" className="text-[#bfbfbf]">{secondaryTitle}</Typography>
            </div>
          </Flex>
          <div className="text-white text-base line-clamp-2 overflow-hidden text-ellipsis">
            {message as string}
          </div>
          {controls && (
            <Flex className="mt-2 text-white">
              <button onClick={handleConfirmAction} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <CheckCircle size={20} />
              </button>
              <button onClick={handleCancelAction} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <XCircle size={20} />
              </button>
            </Flex>
          )}
        </Flex>
      </SnackbarContent>
    );
  },
);
