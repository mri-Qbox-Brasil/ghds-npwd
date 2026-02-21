import React, { HTMLAttributes } from 'react';
import { cn } from '@utils/cn';

interface ButtonOptions {
  onClick: () => void;
  label: string;
}

interface CalculatorButtonProps extends HTMLAttributes<HTMLButtonElement> {
  gridSpan?: number;
  buttonOpts: ButtonOptions;
  isAction?: boolean;
}

export const CalculatorButton: React.FC<CalculatorButtonProps> = ({
  className,
  buttonOpts,
  gridSpan = 1,
  isAction = false,
}) => (
  <button
    key={buttonOpts.label}
    onClick={buttonOpts.onClick}
    className={cn(
      "h-16 flex items-center justify-center rounded-2xl text-lg font-bold transition-all active:scale-95 shadow-sm",
      isAction
        ? "bg-primary text-primary-foreground hover:bg-primary/90"
        : "bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 hover:bg-neutral-200 dark:hover:bg-neutral-800",
      gridSpan === 3 ? "col-span-3" : "col-span-1",
      className
    )}
  >
    {buttonOpts.label}
  </button>
);
