import React from 'react';
import { Button } from './ui/button';
import { Typography } from './ui/typography';
import { Flex } from './ui/flex';
import { cn } from '@utils/cn';

interface DialogFormProps {
  children: React.ReactNode;
  open: boolean;
  handleClose: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void; // No idea what those types are
  onSubmit: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  title: string;
  content: string;
}

const DialogForm: React.FC<DialogFormProps> = ({
  children,
  open,
  handleClose,
  onSubmit,
  title,
  content,
}) => {
  if (!open) return null;

  return (
    <div className="relative flex flex-col items-center justify-center">
      <div className="absolute top-[80px] z-10 flex w-[90%] flex-col rounded-xl bg-background p-4 shadow-xl border border-border">
        <Typography variant="h6" className="px-2 mb-2">
          {title}
        </Typography>
        <div className="px-2 mb-4">
          <Typography variant="body2" color="muted" className="mb-4">
            {content}
          </Typography>
          {children}
        </div>
        <Flex justify="end" className="gap-2 p-2">
          <Button variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={onSubmit}>
            Confirm
          </Button>
        </Flex>
      </div>
    </div>
  );
};

export default DialogForm;
