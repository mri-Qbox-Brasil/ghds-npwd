import React from 'react';
import { usePhone } from '@os/phone/hooks/usePhone';
import { cn } from '@utils/cn';

const positionClasses = {
  vertical: {
    top: 'top-10',
    bottom: 'bottom-10',
    center: 'top-1/2 -translate-y-1/2',
  },
  horizontal: {
    left: 'left-5',
    right: 'right-5',
    center: 'left-1/2 -translate-x-1/2',
  },
};

interface NotificationProps {
  open: boolean;
  handleClose: () => void;
  children?: React.ReactNode;
}


export const Notification: React.FC<NotificationProps> = ({ children, handleClose, open }) => {
  const { ResourceConfig } = usePhone();

  if (!ResourceConfig || !open) return null;

  const { horizontal, vertical } = ResourceConfig.notificationPosition;

  return (
    <div
      className={cn(
        'absolute z-[-5] w-[350px] min-h-[100px] opacity-95 transition-all duration-500 rounded-xl overflow-hidden shadow-lg border border-border animate-in fade-in zoom-in-95',
        positionClasses.vertical[vertical] || 'top-10',
        positionClasses.horizontal[horizontal] || 'left-1/2 -translate-x-1/2'
      )}
    >
      <div className="w-full h-full bg-background/90 backdrop-blur-sm">
        {children}
      </div>
    </div>
  );
};

export default Notification;
