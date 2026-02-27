import { useRecoilState, useRecoilValue } from 'recoil';
import { phoneState } from './state';
import { useSettings } from '../../../apps/settings/hooks/useSettings';
import { useRef, useEffect } from 'react';

export const usePhoneHardware = () => {
    const [activeOverlay, setActiveOverlay] = useRecoilState(phoneState.activeHardwareOverlay);
    const [settings, setSettings] = useSettings();
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Limpeza do timer ao desmontar
    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    const triggerOverlay = (type: 'volume' | 'silent') => {
        if (timerRef.current) clearTimeout(timerRef.current);

        // Pequeno delay caso já esteja aberto para resetar animação se necessário
        setActiveOverlay(type);

        timerRef.current = setTimeout(() => {
            setActiveOverlay(null);
        }, 2000);
    };

    const setVolume = (newVolume: number) => {
        const clampedVolume = Math.max(0, Math.min(100, newVolume));
        setSettings({
            ...settings,
            volume: { ...settings.volume, value: clampedVolume }
        });
        triggerOverlay('volume');
    };

    const increaseVolume = () => {
        const currentVolume = Number(settings.volume?.value ?? 50);
        setVolume(currentVolume + 6.25); // iOS tem 16 níveis (100/16 = 6.25)
    };

    const decreaseVolume = () => {
        const currentVolume = Number(settings.volume?.value ?? 50);
        setVolume(currentVolume - 6.25);
    };

    const [isMuted, setIsMuted] = useRecoilState(phoneState.isMuted);

    const toggleMute = () => {
        setIsMuted(!isMuted);
        triggerOverlay('silent');
    };

    return {
        increaseVolume,
        decreaseVolume,
        toggleMute,
        activeOverlay,
        volumeLevel: Number(settings.volume?.value ?? 50),
        isMuted
    };
};
