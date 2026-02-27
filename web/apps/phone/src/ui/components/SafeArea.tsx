import React from 'react';
import { cn } from '@utils/cn';
import { AppContent } from './AppContent';
import { AppContentTypes } from '../interface/InterfaceUI';

interface SafeAreaProps extends Omit<AppContentTypes, 'children'>, React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    header?: React.ReactNode;
    bottomNav?: React.ReactNode;
}

/**
 * SafeArea is the ultimate layout wrapper for NPWD applications.
 * It automatically handles the positioning and safe-area paddings 
 * when using fixed headers (`DynamicHeader`) or `BottomNav` components.
 * 
 * It wraps the standard `AppContent` so it supports all standard scroll and suspense logic.
 * 
 * Usage:
 * <SafeArea 
 *      header={<DynamicHeader title="Dashboard" variant="pinned" />}
 *      bottomNav={<BottomNav>...</BottomNav>}
 * >
 *      Your content here...
 * </SafeArea>
 */
export const SafeArea = React.forwardRef<HTMLDivElement, SafeAreaProps>((
    {
        children,
        header,
        bottomNav,
        className,
        ...props
    },
    ref
) => {
    return (
        <div className="flex flex-col relative w-full h-full overflow-hidden bg-transparent">
            {header}

            <AppContent
                ref={ref}
                className={cn(
                    header ? "pt-[105px]" : "pt-2",
                    bottomNav && "pb-[90px]", // Accommodate BottomNav
                    className
                )}
                {...props}
            >
                {children}
            </AppContent>

            {bottomNav}
        </div>
    );
});

SafeArea.displayName = 'SafeArea';
