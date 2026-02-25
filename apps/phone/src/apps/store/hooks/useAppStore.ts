import { useState, useEffect, useCallback } from 'react';
import fetchNui from '@utils/fetchNui';
import { ServerPromiseResp } from '@typings/common';
import { usePhone } from '@os/phone/hooks';

const ESSENTIAL_APPS_FALLBACK = ['DIALER', 'CONTACTS', 'MESSAGES', 'SETTINGS', 'STORE'];

// Mirrors config.default.json store.preInstalledApps — used before ResourceConfig loads
const DEFAULT_PREINSTALLED_APPS = [
    'CALCULATOR', 'BROWSER', 'NOTES', 'BANK', 'MAIL', 'WEATHER', 'CAMERA',
];

const STORAGE_KEY = 'npwd:playerData';

/** Formato v2 persistido no banco */
interface PlayerData {
    v: 2;
    installed: string[];
    order: string[];
}

type LegacyData = string[]; // formato v1 (apenas lista de instalados)

export interface AppDownloadState {
    [appId: string]: 'idle' | 'downloading' | 'installed';
}

function parsePlayerData(raw: string): PlayerData | null {
    try {
        const parsed = JSON.parse(raw);
        // v2 format
        if (parsed && typeof parsed === 'object' && parsed.v === 2) {
            return parsed as PlayerData;
        }
        // Legacy: simple array → migrate to v2 with empty order
        if (Array.isArray(parsed)) {
            const legacy: LegacyData = parsed;
            return { v: 2, installed: legacy, order: [] };
        }
    } catch { /* invalid */ }
    return null;
}

export const useAppStore = () => {
    const { ResourceConfig } = usePhone();

    const storeConfig = (ResourceConfig as any)?.store ?? {};
    const essentialApps: string[] = storeConfig.essentialApps ?? ESSENTIAL_APPS_FALLBACK;
    const preInstalledApps: string[] = storeConfig.preInstalledApps ?? DEFAULT_PREINSTALLED_APPS;

    const [installedApps, setInstalledApps] = useState<string[]>([]);
    const [appOrder, setAppOrder] = useState<string[]>([]);
    const [downloadStates, setDownloadStates] = useState<AppDownloadState>({});
    const [isLoaded, setIsLoaded] = useState(false);
    const [configApplied, setConfigApplied] = useState(false);

    // ── Load ──────────────────────────────────────────────────────────────────
    const loadPlayerData = useCallback(async (): Promise<PlayerData | null> => {
        try {
            const resp = await fetchNui<ServerPromiseResp<string | null>>('npwd:getInstalledApps');
            if (resp?.status === 'ok' && resp.data) {
                return parsePlayerData(resp.data);
            }
        } catch { /* fall through to localStorage */ }

        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) return parsePlayerData(stored);
        return null;
    }, []);

    // ── Save ──────────────────────────────────────────────────────────────────
    const savePlayerData = useCallback((installed: string[], order: string[]) => {
        const payload: PlayerData = { v: 2, installed, order };
        const json = JSON.stringify(payload);

        fetchNui<ServerPromiseResp<void>>('npwd:setInstalledApps', json).catch(() => {
            localStorage.setItem(STORAGE_KEY, json);
        });
    }, []);

    // ── Initial Load ──────────────────────────────────────────────────────────
    useEffect(() => {
        const load = async () => {
            try {
                const data = await loadPlayerData();
                if (data) {
                    setInstalledApps([...new Set([...essentialApps, ...data.installed])]);
                    setAppOrder(data.order);
                } else {
                    setInstalledApps([...new Set([...essentialApps, ...preInstalledApps])]);
                    setAppOrder([]);
                }
            } catch {
                setInstalledApps([...new Set([...essentialApps, ...preInstalledApps])]);
                setAppOrder([]);
            } finally {
                setIsLoaded(true);
            }
        };
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loadPlayerData]);

    // ── Persist on change ─────────────────────────────────────────────────────
    useEffect(() => {
        if (!isLoaded) return;
        savePlayerData(installedApps, appOrder);
    }, [installedApps, appOrder, isLoaded, savePlayerData]);

    // ── Re-apply config when ResourceConfig arrives late (dev mode) ───────────
    useEffect(() => {
        if (!isLoaded || configApplied || !ResourceConfig) return;
        setConfigApplied(true);
        setInstalledApps((prev) => [...new Set([...essentialApps, ...preInstalledApps, ...prev])]);
    }, [ResourceConfig, isLoaded, configApplied, essentialApps, preInstalledApps]);

    // ── Selectors ─────────────────────────────────────────────────────────────
    const isInstalled = useCallback(
        (appId: string) => essentialApps.includes(appId) || installedApps.includes(appId),
        [installedApps, essentialApps],
    );

    const isEssential = useCallback(
        (appId: string) => essentialApps.includes(appId),
        [essentialApps],
    );

    const getDownloadState = useCallback(
        (appId: string): 'idle' | 'downloading' | 'installed' => {
            if (isEssential(appId) || installedApps.includes(appId)) return 'installed';
            return downloadStates[appId] ?? 'idle';
        },
        [downloadStates, installedApps, isEssential],
    );

    // ── Actions ───────────────────────────────────────────────────────────────
    const installApp = useCallback(
        (appId: string) => {
            if (isInstalled(appId)) return;
            const duration = Math.floor(Math.random() * 1500) + 1500;
            setDownloadStates((prev) => ({ ...prev, [appId]: 'downloading' }));
            setTimeout(() => {
                setInstalledApps((prev) => [...prev, appId]);
                setDownloadStates((prev) => ({ ...prev, [appId]: 'installed' }));
            }, duration);
        },
        [isInstalled],
    );

    const uninstallApp = useCallback(
        (appId: string) => {
            if (isEssential(appId)) return;
            setInstalledApps((prev) => prev.filter((id) => id !== appId));
            setAppOrder((prev) => prev.filter((id) => id !== appId));
            setDownloadStates((prev) => ({ ...prev, [appId]: 'idle' }));
        },
        [isEssential],
    );

    return {
        installedApps,
        appOrder,
        setAppOrder,
        isInstalled,
        isEssential,
        installApp,
        uninstallApp,
        getDownloadState,
        isLoaded,
    };
};
