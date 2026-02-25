import React from 'react';
import { cn } from '@utils/css';

interface DownloadButtonProps {
    state: 'idle' | 'downloading' | 'installed';
    isEssential: boolean;
    onInstall: () => void;
    onUninstall: () => void;
}

export const DownloadButton: React.FC<DownloadButtonProps> = ({
    state,
    isEssential,
    onInstall,
    onUninstall,
}) => {
    if (isEssential) {
        return (
            <span className="text-[12px] font-semibold px-3 py-1 rounded-full bg-neutral-200 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400">
                Essencial
            </span>
        );
    }

    if (state === 'downloading') {
        return (
            <div className="relative w-8 h-8 flex items-center justify-center">
                <svg className="w-8 h-8 -rotate-90 animate-spin-slow" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                    <circle
                        cx="18"
                        cy="18"
                        r="15"
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeDasharray="60 1000"
                        className="animate-download-fill"
                    />
                </svg>
            </div>
        );
    }

    if (state === 'installed') {
        return (
            <button
                onClick={onUninstall}
                className="text-[12px] font-semibold px-3 py-1 rounded-full bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 active:scale-95 transition-all"
            >
                Remover
            </button>
        );
    }

    // idle — not installed
    return (
        <button
            onClick={onInstall}
            className="text-[12px] font-bold px-4 py-1 rounded-full bg-blue-500 text-white active:scale-95 active:bg-blue-600 transition-all shadow-sm"
        >
            Obter
        </button>
    );
};
