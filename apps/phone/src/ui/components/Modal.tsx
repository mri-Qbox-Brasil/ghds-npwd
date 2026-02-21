import React from 'react';
import * as DialogRadix from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@utils/cn';

interface ModalProps {
  children: React.ReactNode;
  visible?: boolean;
  handleClose?: () => void;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({ children, visible, handleClose, className }) => {
  return (
    <DialogRadix.Root open={visible} onOpenChange={(open) => !open && handleClose && handleClose()}>
      <DialogRadix.Portal container={document.getElementById('phone')}>
        <DialogRadix.Overlay className="fixed inset-0 z-[40] bg-black/50" />
        <DialogRadix.Content
          className={cn(
            "absolute left-[50%] top-[80px] z-[50] flex w-[90%] flex-col translate-x-[-50%] rounded-[6px] bg-white p-6 shadow-lg dark:bg-neutral-900 dark:text-neutral-50",
            className
          )}
        >
          <button
            onClick={handleClose}
            className="absolute right-3 top-3 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </button>
          {children}
        </DialogRadix.Content>
      </DialogRadix.Portal>
    </DialogRadix.Root>
  );
};

export const Modal2: React.FC<ModalProps> = ({ children, visible, handleClose, className }) => {
  return (
    <DialogRadix.Root open={visible} onOpenChange={(open) => !open && handleClose && handleClose()}>
      <DialogRadix.Portal container={document.getElementById('phone')}>
        <DialogRadix.Overlay className="fixed inset-0 z-[40] bg-black/50" />
        <DialogRadix.Content
          className={cn(
            "absolute left-[50%] top-[50%] z-[50] max-h-[100vh] w-[80vw] max-w-[350px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-neutral-100 p-[25px] text-neutral-900 shadow-lg dark:bg-neutral-800 dark:text-neutral-50",
            className
          )}
        >
          {children}
        </DialogRadix.Content>
      </DialogRadix.Portal>
    </DialogRadix.Root>
  );
};

export default Modal;
