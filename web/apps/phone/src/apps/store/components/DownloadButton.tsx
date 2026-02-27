import React from 'react';

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
    // Sistema — sem botão (igual ao iOS para apps do sistema)
    if (isEssential) {
        return null;
    }

    // Baixando — anel circular animado
    if (state === 'downloading') {
        return (
            <div className="relative w-8 h-8 flex items-center justify-center">
                <svg className="w-8 h-8 animate-spin-slow" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                    <circle
                        cx="18"
                        cy="18"
                        r="15"
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeDasharray="30 1000"
                        className="animate-download-fill"
                        style={{ transformOrigin: 'center', transform: 'rotate(-90deg)' }}
                    />
                </svg>
            </div>
        );
    }

    // Instalado — botão "Abrir" estilo iOS (borda azul, sem preenchimento)
    if (state === 'installed') {
        return (
            <button
                onClick={onUninstall}
                className="text-[13px] font-semibold px-4 py-1 rounded-full border border-blue-500 text-blue-500 bg-transparent active:opacity-60 transition-opacity min-w-[66px] text-center"
            >
                Abrir
            </button>
        );
    }

    // idle — não instalado → "Obter"
    return (
        <button
            onClick={onInstall}
            className="text-[13px] font-bold px-4 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 active:opacity-60 transition-opacity min-w-[66px] text-center"
        >
            Obter
        </button>
    );
};
