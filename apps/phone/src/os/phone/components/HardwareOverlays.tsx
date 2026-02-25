import React from 'react';
import { usePhoneHardware } from '../hooks/usePhoneHardware';
import { Volume2, BellOff, Bell } from 'lucide-react';
import { cn } from '@utils/css';

export const HardwareOverlays = () => {
    const { activeOverlay, volumeLevel, isMuted } = usePhoneHardware();

    return (
        <div className="absolute inset-0 pointer-events-none z-[20000] overflow-hidden select-none">
            {/* SilentModeOverlay (Dynamic Island Style Expansion) */}
            <div className={cn(
                "absolute top-[84px] left-1/2 -translate-x-1/2 bg-black rounded-full flex items-center px-3.5 transition-all duration-500 border-1",
                activeOverlay === 'silent'
                    ? cn("w-[180px] h-[38px] opacity-100 scale-100 ease-[cubic-bezier(0.175,0.885,0.32,1.275)]", isMuted ? "border-red-500" : "border-gray-500")
                    : "w-[120px] h-[38px] opacity-0 scale-90 ease-[cubic-bezier(0.4,0,0.2,1)] border-transparent"
            )}>
                <div className={cn(
                    "flex items-center justify-between w-full transition-opacity duration-200",
                    activeOverlay === 'silent' ? "opacity-100 delay-150" : "opacity-0"
                )}>
                    <div className={cn(
                        "flex items-center gap-3",
                        activeOverlay === 'silent' && "animate-bell-shake"
                    )}>
                        {isMuted ? (
                            <BellOff size={16} className="text-red-500 fill-current" />
                        ) : (
                            <Bell size={16} className="text-white fill-current" />
                        )}
                    </div>
                    <span className={cn(
                        "text-[13px] font-bold tracking-tight",
                        isMuted ? "text-red-500" : "text-white"
                    )}>
                        {isMuted ? "Silencioso" : "Tocar"}
                    </span>
                </div>
            </div>

            {/* VolumeOverlay (Modern iOS Style) - Positioned relative to screen top */}
            <div className={cn(
                "absolute top-[350px] transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]",
                activeOverlay === 'volume' ? "left-[62px] opacity-100" : "left-[45px] opacity-0"
            )}>
                <div className="relative w-[18px] h-[120px] bg-black/40 backdrop-blur-2xl rounded-[8px] border border-white/10 overflow-hidden flex flex-col justify-end p-[3px]">
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 text-white/40">
                        <Volume2 size={12} fill="currentColor" className="opacity-60" />
                    </div>
                    <div
                        className="w-full bg-white rounded-[5px] transition-all duration-100 ease-out"
                        style={{ height: `${volumeLevel}%` }}
                    />
                </div>
            </div>
        </div>
    );
};
