import { useState, useEffect, useCallback } from 'react';
import fetchNui from '@utils/fetchNui';
import { ServerPromiseResp } from '@typings/common';
import { usePhone } from '@os/phone/hooks';

const ESSENTIAL_APPS_FALLBACK = ['DIALER', 'CONTACTS', 'MESSAGES', 'SETTINGS', 'STORE'];

// Mirrors config.default.json store.preInstalledApps — used before ResourceConfig loads
const DEFAULT_PREINSTALLED_APPS = [
    'CALCULATOR', 'BROWSER', 'NOTES', 'BANK', 'MAIL', 'WEATHER', 'CAMERA',
];

export interface AppDownloadState {
    [appId: string]: 'idle' | 'downloading' | 'installed';
}

export const useAppStore = () => {
    const { ResourceConfig } = usePhone();

    const storeConfig = (ResourceConfig as any)?.store ?? {};
    const essentialApps: string[] = storeConfig.essentialApps ?? ESSENTIAL_APPS_FALLBACK;
    const preInstalledApps: string[] = storeConfig.preInstalledApps ?? DEFAULT_PREINSTALLED_APPS;

    const [installedApps, setInstalledApps] = useState<string[]>([]);
    const [downloadStates, setDownloadStates] = useState<AppDownloadState>({});
    const [isLoaded, setIsLoaded] = useState(false);
    const [configApplied, setConfigApplied] = useState(false);

    const loadInstalledApps = useCallback(async (): Promise<string[] | null> => {
        try {
            const resp = await fetchNui<ServerPromiseResp<string | null>>('npwd:getInstalledApps');
            if (resp?.status === 'ok' && resp.data) {
                return JSON.parse(resp.data);
            }
        } catch (e) {
            console.error('Failed to fetch installed apps from NUI, falling back to localStorage:', e);
        }

        // Fallback to localStorage for dev mode
        const stored = localStorage.getItem('npwd:installedApps');
        if (stored) {
            return JSON.parse(stored);
        }
        return null;
    }, []);

    const saveInstalledApps = useCallback(async (apps: string[]) => {
        try {
            await fetchNui<ServerPromiseResp<void>>('npwd:setInstalledApps', JSON.stringify(apps));
        } catch (e) {
            console.error('Failed to save installed apps to NUI, falling back to localStorage:', e);
            localStorage.setItem('npwd:installedApps', JSON.stringify(apps));
        }
    }, []);

    // Load from server on mount
    useEffect(() => {
        const load = async () => {
            try {
                const saved = await loadInstalledApps();
                if (saved) {
                    setInstalledApps([...new Set([...essentialApps, ...saved])]);
                } else {
                    // First time: initialize with essentials + config preInstalled
                    setInstalledApps([...new Set([...essentialApps, ...preInstalledApps])]);
                }
            } catch {
                setInstalledApps([...new Set([...essentialApps, ...preInstalledApps])]);
            } finally {
                setIsLoaded(true);
            }
        };
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loadInstalledApps]);

    // Persist whenever installedApps changes (after initial load)
    useEffect(() => {
        if (!isLoaded) return;
        saveInstalledApps(installedApps);
    }, [installedApps, isLoaded, saveInstalledApps]);

    const isInstalled = useCallback(
        (appId: string) => essentialApps.includes(appId) || installedApps.includes(appId),
        [installedApps, essentialApps],
    );

    const isEssential = useCallback(
        (appId: string) => essentialApps.includes(appId),
        [essentialApps],
    );

    // Re-apply essentials if ResourceConfig loads after hook initialization
    useEffect(() => {
        if (!isLoaded || configApplied || !ResourceConfig) return;
        setConfigApplied(true);
        setInstalledApps((prev) => [...new Set([...essentialApps, ...preInstalledApps, ...prev])]);
    }, [ResourceConfig, isLoaded, configApplied, essentialApps, preInstalledApps]);

    const installApp = useCallback(
        (appId: string) => {
            if (isInstalled(appId)) return;

            // Simulate download (1.5s - 3s random)
            const downloadDuration = Math.floor(Math.random() * 1500) + 1500;

            setDownloadStates((prev) => ({ ...prev, [appId]: 'downloading' }));

            setTimeout(() => {
                setInstalledApps((prev) => [...prev, appId]);
                setDownloadStates((prev) => ({ ...prev, [appId]: 'installed' }));
            }, downloadDuration);
        },
        [isInstalled],
    );

    const uninstallApp = useCallback(
        (appId: string) => {
            if (isEssential(appId)) return;
            setInstalledApps((prev) => prev.filter((id) => id !== appId));
            setDownloadStates((prev) => ({ ...prev, [appId]: 'idle' }));
        },
        [isEssential],
    );

    const getDownloadState = useCallback(
        (appId: string): 'idle' | 'downloading' | 'installed' => {
            if (isEssential(appId) || installedApps.includes(appId)) return 'installed';
            return downloadStates[appId] ?? 'idle';
        },
        [downloadStates, installedApps, isEssential],
    );

    return {
        installedApps,
        isInstalled,
        isEssential,
        installApp,
        uninstallApp,
        getDownloadState,
        isLoaded,
    };
};
