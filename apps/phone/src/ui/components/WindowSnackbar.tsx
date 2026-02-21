import React, { useState } from 'react';
import { Typography } from '@ui/components/ui/typography';
import { Alert } from './Alert';
import { useNuiEvent } from 'fivem-nui-react-lib';

/**
 * NOTE: Will make this more generic at some point for error handling as well
 */
const WindowSnackbar: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [severity, setSeverity] = useState<'info' | 'error' | 'success'>('info');

  useNuiEvent('PHONE', 'startRestart', () => {
    setMessage('Restarting UI');
    setOpen(true);
    setSeverity('error');
    setTimeout(() => window.location.reload(), 3000);
  });

  if (!open) return null;

  return (
    <div className="absolute left-1/2 -translate-x-1/2 bottom-5 w-auto z-[1000] animate-in fade-in slide-in-from-bottom-2 duration-300">
      <Alert severity={severity}>
        <Typography variant="body1">Phone - {message}</Typography>
      </Alert>
    </div>
  );
};

export default WindowSnackbar;
