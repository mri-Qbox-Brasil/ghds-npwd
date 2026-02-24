import React, { ReactNode } from 'react';
import { cn } from '@utils/cn';
import { Typography } from './ui/typography';

interface BottomNavProps {
    children: ReactNode;
    className?: string;
}

export const BottomNav: React.FC<BottomNavProps> = ({ children, className }) => {
    return (
        <div className={cn(
            "absolute bottom-0 w-full min-h-[80px] pb-6 px-6 pt-3",
            "bg-[#F9F9F9]/90 dark:bg-[#1C1C1E]/90 backdrop-blur-md",
            "border-t border-neutral-200 dark:border-neutral-800",
            "flex justify-between items-center z-40",
            className
        )}>
            {children}
        </div>
    );
};

interface BottomNavItemProps {
    icon: ReactNode;
    label: string;
    isActive?: boolean;
    activeClassName?: string;
    onClick?: () => void;
    className?: string;
}

export const BottomNavItem: React.FC<BottomNavItemProps> = ({
    icon,
    label,
    isActive = false,
    activeClassName = "text-blue-500",
    onClick,
    className
}) => {
    return (
        <button
            onClick={onClick}
            className={cn(
                "flex flex-col items-center justify-center gap-1 active:opacity-70 transition-opacity bg-transparent border-none outline-none flex-1",
                isActive ? activeClassName : "text-neutral-500 dark:text-neutral-400",
                className
            )}
        >
            <div className={cn("w-6 h-6 flex items-center justify-center", isActive && "font-semibold")}>
                {icon}
            </div>
            <Typography variant="caption" className="text-[10px] font-medium leading-none mt-0.5">
                {label}
            </Typography>
        </button>
    );
};

interface BottomToolbarItemProps {
    icon: ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
}

export const BottomToolbarItem: React.FC<BottomToolbarItemProps> = ({
    icon,
    onClick,
    disabled = false,
    className
}) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={cn(
                "bg-transparent border-none outline-none flex items-center justify-center p-2",
                "text-blue-500 transition-opacity",
                disabled ? "opacity-30 cursor-not-allowed" : "active:opacity-70",
                className
            )}
        >
            {icon}
        </button>
    );
};
