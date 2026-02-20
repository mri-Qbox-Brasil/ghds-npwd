import React, { forwardRef } from 'react';
import { Flex, type FlexProps } from './ui/flex';
import { cn } from '@utils/cn';

export interface ListProps extends FlexProps { }

export const List = forwardRef<HTMLDivElement, ListProps>(
  ({ className, ...props }, ref) => {
    return (
      <Flex
        ref={ref}
        direction="col"
        className={cn("w-full py-2", className)}
        {...props}
      />
    );
  }
);
List.displayName = 'List';
