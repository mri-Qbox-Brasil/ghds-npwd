import React from 'react';
import { cn } from '@utils/cn';

export interface AlertDialogAction {
    label: string;
    onClick: () => void;
    style?: 'default' | 'destructive' | 'cancel';
    bold?: boolean;
}

export interface AlertDialogProps {
    isOpen: boolean;
    title: string;
    description?: string;
    actions: AlertDialogAction[];
    onClose?: () => void;
}

export const AlertDialog: React.FC<AlertDialogProps> = ({
    isOpen,
    title,
    description,
    actions,
    onClose,
}) => {
    if (!isOpen) return null;

    return (
        <div className="absolute inset-0 z-[100] flex items-center justify-center p-8">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 dark:bg-black/60 transition-opacity animate-in fade-in"
                onClick={onClose}
            />

            {/* Dialog Box */}
            <div className="relative w-full max-w-[270px] bg-[#F2F2F2]/90 dark:bg-[#252525]/90 backdrop-blur-xl rounded-[14px] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="p-4 pt-5 flex flex-col items-center text-center gap-1">
                    <h2 className="text-[17px] font-semibold text-black dark:text-white leading-tight tracking-tight">
                        {title}
                    </h2>
                    {description && (
                        <p className="text-[13px] text-black/70 dark:text-white/70 leading-snug tracking-tight">
                            {description}
                        </p>
                    )}
                </div>

                {/* Actions */}
                <div className={cn(
                    "flex border-t border-black/10 dark:border-white/10",
                    actions.length === 2 ? "flex-row" : "flex-col"
                )}>
                    {actions.map((action, idx) => (
                        <button
                            key={idx}
                            onClick={action.onClick}
                            className={cn(
                                "flex-1 py-[11px] px-4 text-[17px] active:bg-black/10 dark:active:bg-white/10 transition-colors flex items-center justify-center leading-normal",
                                actions.length === 2 && idx === 0 && "border-r border-black/10 dark:border-white/10",
                                actions.length > 2 && idx !== 0 && "border-t border-black/10 dark:border-white/10",
                                action.style === 'destructive' ? "text-red-500" : "text-blue-500",
                                (action.style === 'cancel' || action.bold) ? "font-semibold" : "font-normal"
                            )}
                        >
                            {action.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
