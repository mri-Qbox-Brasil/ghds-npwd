import React, { forwardRef } from 'react';
import { PhoneEvents } from '@typings/phone';
import fetchNui from '@utils/fetchNui';
import { cva, VariantProps } from 'class-variance-authority';
import { Search } from "lucide-react";
import { cn } from "@utils/css";
import { Input } from './ui/input';

export const toggleKeys = (keepGameFocus: boolean) =>
  fetchNui(
    PhoneEvents.TOGGLE_KEYS,
    {
      keepGameFocus,
    },
    {},
  );

// Props compatíveis com o mínimo do TextField antigo
export interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'standard' | 'outlined' | 'filled' | string;
  label?: string;
  fullWidth?: boolean;
  InputProps?: any; // Algumas referências a ícones podem quebrar aqui se utilizavam MUI
  error?: boolean;
  helperText?: string;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>((props, ref) => {
  const { variant, label, fullWidth, InputProps, error, helperText, ...rest } = props;

  return (
    <div className={cn("flex flex-col gap-1.5", fullWidth ? "w-full" : "")}>
      {label && <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{label}</label>}
      <Input
        ref={ref}
        {...rest}
        className={cn(
          error ? "border-red-500 focus-visible:ring-red-500" : "",
          rest.className
        )}
        onMouseUp={(e) => {
          toggleKeys(false);
          if (props.onMouseUp) props.onMouseUp(e);
        }}
        onBlur={(e) => {
          toggleKeys(true);
          if (props.onBlur) props.onBlur(e);
        }}
      />
      {helperText && (
        <span className={cn("text-xs", error ? "text-red-500" : "text-neutral-500")}>
          {helperText}
        </span>
      )}
    </div>
  );
});

export const InputBase = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>((props, ref) => (
  <input
    ref={ref}
    {...props}
    className={cn("bg-transparent outline-none w-full", props.className)}
    onMouseUp={(e) => {
      toggleKeys(false);
      if (props.onMouseUp) {
        props.onMouseUp(e);
      }
    }}
    onBlur={(e) => {
      toggleKeys(true);
      if (props.onBlur) {
        props.onBlur(e);
      }
    }}
  />
));

export const classes = cva('rounded-md outline-none w-full', {
  variants: {
    size: {
      md: 'text-base py-2 px-2',
    },
    variant: {
      primary: 'bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-100 border border-transparent focus:border-blue-500 focus:ring-1 focus:ring-blue-500',
    },
  },
  defaultVariants: {
    size: 'md',
    variant: 'primary',
  },
});

export type NPWDInputProps = React.InputHTMLAttributes<HTMLInputElement> & VariantProps<typeof classes>;

export const textareaClasses = cva('rounded-md outline-none w-full', {
  variants: {
    size: {
      md: 'text-base py-2 px-2',
    },
    variant: {
      primary: 'bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-100 border border-transparent focus:border-blue-500 focus:ring-1 focus:ring-blue-500',
    },
  },
  defaultVariants: {
    size: 'md',
    variant: 'primary',
  },
});

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & VariantProps<typeof textareaClasses>;

export const NPWDInput: React.FC<NPWDInputProps> = ({ size, variant, className, ...props }) => {
  return <input
    {...props}
    className={cn(classes({ size, variant, className }))}
    onMouseUp={(e) => {
      toggleKeys(false);
      if (props.onMouseUp) {
        props.onMouseUp(e);
      }
    }}
    onBlur={(e) => {
      toggleKeys(true);
      if (props.onBlur) {
        props.onBlur(e);
      }
    }}
  />;
};

export const NPWDTextarea: React.FC<TextareaProps> = ({ size, variant, className, ...props }) => {
  return <textarea
    {...props}
    className={cn(textareaClasses({ size, variant, className }))}
    onMouseUp={(e) => {
      toggleKeys(false);
      if (props.onMouseUp) {
        props.onMouseUp(e);
      }
    }}
    onBlur={(e) => {
      toggleKeys(true);
      if (props.onBlur) {
        props.onBlur(e);
      }
    }}
  />;
};

export const NPWDSearchInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ ...props }) => {
  return (
    <div className="flex items-center justify-start bg-neutral-200 dark:bg-neutral-800 rounded-md px-2 space-x-2 border dark:border-neutral-700 focus-within:ring-2 focus-within:ring-blue-500">
      <Search className="h-5 w-5 dark:text-neutral-400" />
      <input
        {...props}
        className="w-full text-base dark:text-neutral-100 py-2 bg-transparent outline-none"
        onMouseUp={(e) => {
          toggleKeys(false);
          if (props.onMouseUp) {
            props.onMouseUp(e);
          }
        }}
        onBlur={(e) => {
          toggleKeys(true);
          if (props.onBlur) {
            props.onBlur(e);
          }
        }}
      />
    </div>
  )
}
