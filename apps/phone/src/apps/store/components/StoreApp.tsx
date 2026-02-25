import React, { useRef, useState } from 'react';
import { AppWrapper } from '@ui/components';
import { useApps } from '@os/apps/hooks/useApps';
import { useTranslation } from 'react-i18next';
import { DownloadButton } from './DownloadButton';
import { useAppStore } from '../hooks/useAppStore';
import { Search, ChevronRight, Sparkles, LayoutGrid } from 'lucide-react';

import { BottomNav, BottomNavItem } from '@ui/components/BottomNav';
import { useHistory } from 'react-router-dom';

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

const APP_BANNER_COLORS: Record<string, [string, string]> = {
    TWITTER: ['#1d9bf0', '#0f4c81'],
    BANK: ['#16a34a', '#052e16'],
    MAIL: ['#3b82f6', '#1e3a8a'],
    DARKCHAT: ['#171717', '#404040'],
    MATCH: ['#f43f5e', '#4c0519'],
    MARKETPLACE: ['#f97316', '#431407'],
    WEATHER: ['#0ea5e9', '#0c4a6e'],
    NOTES: ['#fde047', '#713f12'],
    CAMERA: ['#6366f1', '#1e1b4b'],
};

type Tab = 'today' | 'apps' | 'search';

export const StoreApp: React.FC = () => {
    const { apps } = useApps();
    const [t] = useTranslation();
    const { installApp, uninstallApp, getDownloadState, isEssential, isInstalled } = useAppStore();
    const [activeTab, setActiveTab] = useState<Tab>('today');
    const [search, setSearch] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);
    const history = useHistory();

    const optionalApps = apps.filter((a) => !isEssential(a.id));
    const installedApps = apps.filter((a) => isInstalled(a.id));
    const notInstalledApps = apps.filter((a) => !isEssential(a.id) && !isInstalled(a.id));
    const featuredApps = optionalApps.filter((a) => APP_BANNER_COLORS[a.id]);

    const filteredApps = apps.filter((app) => {
        const name = t(app.nameLocale) || app.id;
        return name.toLowerCase().includes(search.toLowerCase());
    });

    return (
        <AppWrapper id="store-app" className="flex flex-col bg-[#f2f2f7] dark:bg-[#1c1c1e]">
            {/* Custom Tab Header */}
            <div className="flex-shrink-0 bg-[#f2f2f7] dark:bg-[#1c1c1e]">
                {activeTab !== 'search' && (
                    <div className="flex items-center justify-between px-5 pt-14 pb-1">
                        <h1 className="text-[34px] font-bold text-neutral-900 dark:text-white tracking-tight">
                            {activeTab === 'today' ? 'Hoje' : 'Apps'}
                        </h1>
                    </div>
                )}
                {activeTab === 'search' && (
                    <div className="px-4 pt-14 pb-3">
                        <h1 className="text-[34px] font-bold text-neutral-900 dark:text-white tracking-tight mb-3">
                            Pesquisar
                        </h1>
                        <div className="flex items-center gap-2 bg-white/80 dark:bg-neutral-800/80 rounded-[12px] px-3 py-2.5 shadow-sm">
                            <Search size={16} className="text-neutral-400 shrink-0" />
                            <input
                                autoFocus
                                type="text"
                                placeholder="Jogos, apps e muito mais..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="bg-transparent text-[15px] text-neutral-800 dark:text-white placeholder:text-neutral-400 outline-none w-full"
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Scrollable Content */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-hide pb-24">

                {/* === TODAY TAB === */}
                {activeTab === 'today' && (
                    <div className="px-5 pt-2 flex flex-col gap-5">
                        {/* Date */}
                        <p className="text-[13px] font-semibold text-neutral-400 uppercase tracking-wide">
                            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
                        </p>

                        {/* Featured Cards */}
                        {featuredApps.map((app) => {
                            const name = t(app.nameLocale) || app.id;
                            const category = APP_CATEGORIES[app.id] ?? 'App';
                            const [colorA, colorB] = APP_BANNER_COLORS[app.id] ?? ['#3b82f6', '#1e3a8a'];
                            const downloadState = getDownloadState(app.id);

                            return (
                                <div
                                    key={app.id}
                                    className="rounded-[22px] overflow-hidden shadow-lg"
                                    style={{ background: `linear-gradient(135deg, ${colorA}, ${colorB})` }}
                                >
                                    {/* Banner top category */}
                                    <div className="px-5 pt-5 pb-2">
                                        <p className="text-[12px] font-bold uppercase tracking-wider text-white/60 mb-1">
                                            {category}
                                        </p>
                                        <p className="text-[26px] font-bold text-white leading-tight">{name}</p>
                                    </div>

                                    {/* Icon + action row */}
                                    <div className="px-5 pb-5 mt-2 flex items-center justify-between">
                                        <div className="w-14 h-14 rounded-[14px] overflow-hidden shadow-md bg-white/10 flex items-center justify-center">
                                            {app.icon}
                                        </div>
                                        <DownloadButton
                                            state={downloadState}
                                            isEssential={false}
                                            onInstall={() => installApp(app.id)}
                                            onUninstall={() => uninstallApp(app.id)}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* === APPS TAB === */}
                {activeTab === 'apps' && (
                    <div className="flex flex-col gap-5 pt-2 pb-5">
                        {/* Installed Section */}
                        {installedApps.length > 0 && (
                            <div>
                                <div className="flex items-center justify-between px-5 mb-2">
                                    <p className="text-[18px] font-bold text-neutral-900 dark:text-white">Instalados</p>
                                    <button className="text-blue-500 text-[14px] font-medium flex items-center gap-0.5">
                                        Ver todos <ChevronRight size={14} />
                                    </button>
                                </div>
                                <div className="bg-white dark:bg-[#2c2c2e] rounded-[16px] mx-4 overflow-hidden divide-y divide-neutral-100 dark:divide-neutral-700/50 shadow-sm">
                                    {installedApps.map((app) => {
                                        const name = t(app.nameLocale) || app.id;
                                        const category = APP_CATEGORIES[app.id] ?? 'App';
                                        return (
                                            <div key={app.id} className="flex items-center gap-3 px-4 py-3">
                                                <div className="w-[52px] h-[52px] rounded-[13px] overflow-hidden shrink-0 shadow-sm bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center">
                                                    {app.icon}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-[15px] font-semibold text-neutral-900 dark:text-white truncate">{name}</p>
                                                    <p className="text-[12px] text-neutral-400">{category}</p>
                                                </div>
                                                <DownloadButton
                                                    state="installed"
                                                    isEssential={isEssential(app.id)}
                                                    onInstall={() => { }}
                                                    onUninstall={() => history.push(app.path)}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Available Section */}
                        {notInstalledApps.length > 0 && (
                            <div>
                                <div className="flex items-center justify-between px-5 mb-2">
                                    <p className="text-[18px] font-bold text-neutral-900 dark:text-white">Disponíveis</p>
                                </div>
                                <div className="bg-white dark:bg-[#2c2c2e] rounded-[16px] mx-4 overflow-hidden divide-y divide-neutral-100 dark:divide-neutral-700/50 shadow-sm">
                                    {notInstalledApps.map((app) => {
                                        const name = t(app.nameLocale) || app.id;
                                        const category = APP_CATEGORIES[app.id] ?? 'App';
                                        const downloadState = getDownloadState(app.id);
                                        return (
                                            <div key={app.id} className="flex items-center gap-3 px-4 py-3">
                                                <div className="w-[52px] h-[52px] rounded-[13px] overflow-hidden shrink-0 shadow-sm bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center">
                                                    {app.icon}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-[15px] font-semibold text-neutral-900 dark:text-white truncate">{name}</p>
                                                    <p className="text-[12px] text-neutral-400">{category}</p>
                                                    {downloadState === 'downloading' && (
                                                        <p className="text-[11px] text-blue-500 animate-pulse">Baixando...</p>
                                                    )}
                                                </div>
                                                <DownloadButton
                                                    state={downloadState}
                                                    isEssential={false}
                                                    onInstall={() => installApp(app.id)}
                                                    onUninstall={() => uninstallApp(app.id)}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* === SEARCH TAB === */}
                {activeTab === 'search' && (
                    <div className="pt-2 px-4">
                        {search === '' ? (
                            <div>
                                <p className="text-[13px] font-semibold text-neutral-400 uppercase tracking-wide mb-3 px-1">
                                    Sugestões
                                </p>
                                <div className="bg-white dark:bg-[#2c2c2e] rounded-[16px] overflow-hidden divide-y divide-neutral-100 dark:divide-neutral-700/50 shadow-sm">
                                    {apps.slice(0, 6).map((app) => {
                                        const name = t(app.nameLocale) || app.id;
                                        return (
                                            <div key={app.id} className="flex items-center gap-3 px-4 py-3">
                                                <Search size={16} className="text-neutral-400" />
                                                <p className="text-[15px] text-neutral-800 dark:text-white">{name}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white dark:bg-[#2c2c2e] rounded-[16px] overflow-hidden divide-y divide-neutral-100 dark:divide-neutral-700/50 shadow-sm">
                                {filteredApps.length === 0 ? (
                                    <div className="flex flex-col items-center py-12 text-neutral-400">
                                        <Search size={32} className="mb-3 opacity-30" />
                                        <p className="text-[15px]">Nenhum resultado</p>
                                    </div>
                                ) : (
                                    filteredApps.map((app) => {
                                        const name = t(app.nameLocale) || app.id;
                                        const category = APP_CATEGORIES[app.id] ?? 'App';
                                        const downloadState = getDownloadState(app.id);
                                        const essential = isEssential(app.id);
                                        return (
                                            <div key={app.id} className="flex items-center gap-3 px-4 py-3">
                                                <div className="w-[52px] h-[52px] rounded-[13px] overflow-hidden shrink-0 shadow-sm bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center">
                                                    {app.icon}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-[15px] font-semibold text-neutral-900 dark:text-white truncate">{name}</p>
                                                    <p className="text-[12px] text-neutral-400">{category}</p>
                                                </div>
                                                <DownloadButton
                                                    state={downloadState}
                                                    isEssential={essential}
                                                    onInstall={() => installApp(app.id)}
                                                    onUninstall={() => uninstallApp(app.id)}
                                                />
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Bottom Tab Bar usando componente global */}
            <BottomNav>
                <BottomNavItem
                    icon={<Sparkles size={22} />}
                    label="Hoje"
                    isActive={activeTab === 'today'}
                    onClick={() => setActiveTab('today')}
                />
                <BottomNavItem
                    icon={<LayoutGrid size={22} />}
                    label="Apps"
                    isActive={activeTab === 'apps'}
                    onClick={() => setActiveTab('apps')}
                />
                <BottomNavItem
                    icon={<Search size={22} />}
                    label="Pesquisar"
                    isActive={activeTab === 'search'}
                    onClick={() => setActiveTab('search')}
                />
            </BottomNav>
        </AppWrapper>
    );
};

export default StoreApp;
