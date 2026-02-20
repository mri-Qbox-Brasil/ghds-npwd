import { X } from 'lucide-react';
import { ListItem } from '@ui/components/ListItem';
import { Typography } from '@ui/components/ui/typography';
import { INotification } from '../providers/NotificationsProvider';
import { useCurrentCallValue } from '@os/call/hooks/state';

export const NotificationItem = ({
  onClose,
  onClickClose,
  ...notification
}: INotification & {
  onClose: (e: any) => void;
  onClickClose: (e: any) => void;
}) => {
  const { title, icon, content, cantClose, onClick } = notification;
  const call = useCurrentCallValue();

  return (
    <ListItem
      button
      onClick={(e) => {
        if (onClick && !call) {
          onClick(notification);
          onClickClose(e);
        }
      }}
      className={`relative border-b border-border/50 ${cantClose ? 'pr-2' : 'pr-[28px]'}`}
    >
      {icon && <div className="min-w-[35px] max-w-[5px] mr-2.5 flex justify-center">{icon as unknown as React.ReactNode}</div>}
      <div className="flex flex-col flex-grow text-left">
        <Typography variant="body1">{title as unknown as string}</Typography>
        <Typography variant="body2" color="muted">{content as unknown as string}</Typography>
      </div>
      {!cantClose && (
        <button
          onClick={onClose}
          className="absolute right-2 top-2 p-1 text-blue-500 hover:bg-muted/50 rounded-full cursor-pointer appearance-none bg-transparent border-none"
        >
          <X size={18} />
        </button>
      )}
    </ListItem>
  );
};
