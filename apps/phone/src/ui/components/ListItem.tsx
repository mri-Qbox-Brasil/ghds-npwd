import React, { forwardRef } from 'react';
import { Flex, type FlexProps } from './ui/flex';
import { cn } from '@utils/cn';

export interface ListItemProps extends FlexProps {
  button?: boolean;
}

export const ListItem = forwardRef<HTMLDivElement, ListItemProps>(
  ({ className, button, ...props }, ref) => {
    return (
      <Flex
        ref={ref}
        align="center"
        justify="start"
        className={cn(
          "w-full py-2 px-4 transition-colors relative",
          button && "cursor-pointer hover:bg-muted/50 active:bg-muted",
          className
        )}
        {...props}
      />
    );
  }
);

ListItem.displayName = 'ListItem';
