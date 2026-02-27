import React from 'react';
import { Button as ShadcnButton, buttonVariants } from './ui/button';
import { VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

// Compatibilidade para atributos antigos (como color, variant do mui)
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' | string;
  variant?: 'contained' | 'outlined' | 'text' | string;
  size?: 'small' | 'medium' | 'large' | string;
  component?: React.ElementType; // Compatibilidade com MUI
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ color, variant, size, className, children, ...props }, ref) => {
  // Map MUI props to shadcn variants
  let shadcnVariant: VariantProps<typeof buttonVariants>['variant'] = 'default';

  if (variant === 'outlined') shadcnVariant = 'outline';
  else if (variant === 'text') shadcnVariant = 'ghost';
  else if (color === 'error' || color === 'error') shadcnVariant = 'destructive';
  else if (color === 'secondary') shadcnVariant = 'secondary';

  let shadcnSize: VariantProps<typeof buttonVariants>['size'] = 'default';
  if (size === 'small') shadcnSize = 'sm';
  else if (size === 'large') shadcnSize = 'lg';

  return (
    <ShadcnButton
      ref={ref}
      variant={shadcnVariant}
      size={shadcnSize}
      className={className}
      aria-label="button"
      {...props}
    >
      {children}
    </ShadcnButton>
  );
});
Button.displayName = 'Button';

export type NPWDButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

// Mantém NPWDButton original compatível, agora redirecionando para o ShadcnButton
export const NPWDButton: React.FC<NPWDButtonProps> = ({
  children,
  size,
  variant,
  className,
  ...props
}) => {
  return (
    <ShadcnButton
      variant={variant || 'default'}
      size={size || 'default'}
      className={className}
      {...props}
    >
      {children}
    </ShadcnButton>
  );
};
