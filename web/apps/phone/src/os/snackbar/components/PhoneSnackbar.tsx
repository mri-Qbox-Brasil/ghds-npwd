import React, { useEffect } from 'react';
import { useSnackbar } from '../hooks/useSnackbar';
import Alert from '../../../ui/components/Alert';

export const PhoneSnackbar: React.FC = () => {
  const { alert, isOpen, handleClose } = useSnackbar();

  useEffect(() => {
    if (!isOpen) return;
    const duration = alert?.duration ?? 3000;
    const timer = setTimeout(() => {
      handleClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [isOpen, alert, handleClose]);

  if (!isOpen) return null;

  return (
    <div className="flex justify-center items-center h-auto w-full px-4 overflow-visible mx-auto absolute left-0 bottom-[100px] right-0 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
      <Alert severity={alert?.type || 'info'}>
        {alert?.message || ''}
      </Alert>
    </div>
  );
};
