import React, { useRef, useState } from 'react';
import { AppWrapper, AppContent } from '@ui/components';
import { DynamicHeader } from '@ui/components/DynamicHeader';
import { useApps } from '@os/apps/hooks/useApps';
import { useTranslation } from 'react-i18next';
import { DownloadButton } from './DownloadButton';
import { useAppStore } from '../hooks/useAppStore';
import { Search } from 'lucide-react';

const APP_CATEGORIES: Record<string, string> = {
    DIALER: 'Comunicação',
    CONTACTS: 'Comunicação',
    MESSAGES: 'Comunicação',
    BROWSER: 'Utilitários',
    CALCULATOR: 'Utilitários',
    SETTINGS: 'Sistema',
    STORE: 'Sistema',
    DARKCHAT: 'Social',
    MATCH: 'Social',
    TWITTER: 'Social',
    MARKETPLACE: 'Social',
    NOTES: 'Produtividade',
    CAMERA: 'Multimédia',
    WEATHER: 'Utilitários',
    BANK: 'Financeiro',
    MAIL: 'Comunicação',
};

export const StoreApp: React.FC = () => {
    const { apps } = useApps();
    const [t] = useTranslation();
    const { installApp, uninstallApp, getDownloadState, isEssential } = useAppStore();
    const [search, setSearch] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    const filteredApps = apps.filter((app) => {
        const name = t(app.nameLocale) || app.id;
        return name.toLowerCase().includes(search.toLowerCase());
    });

    return (
        <AppWrapper id="store-app" className="bg-white dark:bg-[#111] flex flex-col">
            {/* Pinned Header */}
            <DynamicHeader title="Loja" scrollRef={scrollRef} variant="pinned" />

            <AppContent ref={scrollRef} className="flex flex-col grow pb-24 scrollbar-hide">
                {/* Large Title */}
                <DynamicHeader title="Loja" scrollRef={scrollRef} variant="largeTitle" />

                {/* Search Bar */}
                <div className="px-4 pb-4">
                    <div className="flex items-center gap-2 bg-neutral-100 dark:bg-neutral-800 rounded-[12px] px-3 py-2.5">
                        <Search size={16} className="text-neutral-400 shrink-0" />
                        <input
                            type="text"
                            placeholder="Buscar apps..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-transparent text-[15px] text-neutral-800 dark:text-white placeholder:text-neutral-400 outline-none w-full"
                        />
                    </div>
                </div>

                {/* Apps List */}
                <div className="flex flex-col divide-y divide-neutral-100 dark:divide-neutral-800">
                    {filteredApps.map((app) => {
                        const name = t(app.nameLocale) || app.id;
                        const category = APP_CATEGORIES[app.id] ?? 'App';
                        const downloadState = getDownloadState(app.id);
                        const essential = isEssential(app.id);

                        return (
                            <div key={app.id} className="flex items-center gap-3 px-4 py-3">
                                {/* App Icon */}
                                <div className="w-[54px] h-[54px] rounded-[14px] overflow-hidden shrink-0 shadow-sm bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                                    {app.icon}
                                </div>

                                {/* Name & Category */}
                                <div className="flex flex-col flex-1 min-w-0">
                                    <span className="text-[15px] font-semibold text-neutral-900 dark:text-white leading-tight truncate">
                                        {name}
                                    </span>
                                    <span className="text-[12px] text-neutral-400 mt-0.5">{category}</span>
                                    {downloadState === 'downloading' && (
                                        <span className="text-[11px] text-blue-500 mt-0.5 animate-pulse">
                                            Baixando...
                                        </span>
                                    )}
                                </div>

                                {/* Download Button */}
                                <DownloadButton
                                    state={downloadState}
                                    isEssential={essential}
                                    onInstall={() => installApp(app.id)}
                                    onUninstall={() => uninstallApp(app.id)}
                                />
                            </div>
                        );
                    })}
                </div>

                {filteredApps.length === 0 && (
                    <div className="flex flex-col items-center justify-center mt-16 opacity-50">
                        <p className="text-neutral-500 dark:text-neutral-400 text-[15px]">
                            Nenhum app encontrado
                        </p>
                    </div>
                )}
            </AppContent>
        </AppWrapper>
    );
};

export default StoreApp;
