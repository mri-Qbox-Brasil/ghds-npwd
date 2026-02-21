import React from 'react';
import { AppWrapperTypes } from '../interface/InterfaceUI';
import { cn } from '@utils/cn';

export const AppWrapper: React.FC<AppWrapperTypes & React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  style,
  handleClickAway,
  className,
  ...props
}) => {
  return (
    <div
      {...props}
      className={cn("flex flex-col relative w-full h-full min-h-[720px]", className)}
      style={{
        padding: 0,
        paddingTop: 15,
        margin: 0,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
