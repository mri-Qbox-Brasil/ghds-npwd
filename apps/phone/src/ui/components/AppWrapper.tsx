import React from 'react';
import { AppWrapperTypes } from '../interface/InterfaceUI';
import { cn } from '@utils/cn';
import { motion } from 'framer-motion';

export const AppWrapper: React.FC<AppWrapperTypes & React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  style,
  handleClickAway,
  className,
  ...props
}) => {
  return (
    <motion.div
      {...(props as any)}
      className={cn('flex flex-col relative w-full h-full', className)}
      style={{ ...style }}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{
        type: 'spring',
        stiffness: 380,
        damping: 30,
        mass: 0.8,
      }}
    >
      {children}
    </motion.div>
  );
};
