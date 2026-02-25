import React, { useState, useRef, useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { phoneState } from '@os/phone/hooks/state';
import { notifications as notificationsState, unreadNotificationIds } from '@os/new-notifications/state';
import usePhoneTime from '@os/phone/hooks/usePhoneTime';
import { Flashlight, Camera, Lock, Battery } from 'lucide-react';
import { useWallpaper } from '@apps/settings/hooks/useWallpaper';
import { useApp } from '@os/apps/hooks/useApps';
import { useTranslation } from 'react-i18next';

const LockscreenNotificationItem: React.FC<{ id: string }> = ({ id }) => {
    const { appId, content, secondaryTitle } = useRecoilValue(notificationsState(id));
    const app = useApp(appId);
    const [t] = useTranslation();

    const title = secondaryTitle || (app?.nameLocale ? t(app.nameLocale) : 'Notificação');

    return (
        <div className="w-full bg-white/20 backdrop-blur-xl border border-white/10 rounded-[22px] px-4 py-3 flex gap-3 shadow-md active:scale-95 transition-all">
            <div className="w-10 h-10 rounded-[10px] overflow-hidden bg-white/10 flex items-center justify-center shrink-0">
                {app?.icon ? app.icon : <div className="w-5 h-5 bg-white/20 rounded-sm" />}
            </div>
            <div className="flex flex-col justify-center overflow-hidden text-white">
                <span className="font-bold text-[14px] leading-tight truncate">{title}</span>
                <span className="text-white/80 text-[13px] leading-snug line-clamp-2 mt-0.5">
                    {typeof content === 'string' ? content : null}
                </span>
            </div>
        </div>
    );
};


export const Lockscreen: React.FC = () => {
    const [isLocked, setIsLocked] = useRecoilState(phoneState.isLocked);
    const unreadNotiIds = useRecoilValue(unreadNotificationIds);
    const time = usePhoneTime();
    const wallpaper = useWallpaper();

    const [startY, setStartY] = useState<number | null>(null);
    const [currentY, setCurrentY] = useState(0);
    const [isSwiping, setIsSwiping] = useState(false);
    const [showContent, setShowContent] = useState(true);

    const screenRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isLocked) {
            setShowContent(true);
            setCurrentY(0);
        }
    }, [isLocked]);

    const handleStart = (y: number) => {
        setStartY(y);
        setIsSwiping(true);
    };

    const handleMove = (y: number) => {
        if (startY === null) return;
        const diff = y - startY;
        if (diff < 0) {
            setCurrentY(diff);
        }
    };

    const handleEnd = () => {
        if (currentY < -150) {
            unlock();
        } else {
            setCurrentY(0);
        }
        setStartY(null);
        setIsSwiping(false);
    };

    const unlock = () => {
        setShowContent(false);
        setTimeout(() => {
            setIsLocked(false);
        }, 300);
    };

    if (!isLocked) return null;

    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    });

    const swipeStyle = {
        transform: `translateY(${currentY}px)`,
        transition: isSwiping ? 'none' : 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)',
    };

    const opacityStyle = {
        opacity: showContent ? 1 : 0,
        transition: 'opacity 0.3s ease-out',
    };

    return (
        <div
            ref={screenRef}
            className="absolute inset-0 z-[9999] bg-cover bg-center flex flex-col items-center justify-between overflow-hidden select-none"
            style={{ backgroundImage: wallpaper, ...opacityStyle }}
            onMouseDown={(e) => handleStart(e.clientY)}
            onMouseMove={(e) => handleMove(e.clientY)}
            onMouseUp={handleEnd}
            onMouseLeave={handleEnd}
            onTouchStart={(e) => handleStart(e.touches[0].clientY)}
            onTouchMove={(e) => handleMove(e.touches[0].clientY)}
            onTouchEnd={handleEnd}
        >
            <div className="absolute inset-0 bg-black/10 pointer-events-none" />

            {/* Main Content (Movable) */}
            <div className="relative w-full h-full flex flex-col items-center justify-between pointer-events-none" style={swipeStyle}>

                {/* Padding for global status bar icons (px-8 pt-6 in NotificationBar) */}
                <div className="w-full px-8 pt-[80px] flex flex-col items-center">
                    <Lock size={15} className="text-white/80 drop-shadow-md" strokeWidth={3} />
                </div>

                {/* Clock & Date */}
                <div className="flex flex-col items-center mt-7 text-white text-center">
                    <span className="text-[21px] font-semibold tracking-tight opacity-95 drop-shadow-md mb-0.5">
                        {formattedDate}
                    </span>
                    <span className="text-[102px] font-semibold tracking-[-0.04em] leading-[0.85] drop-shadow-2xl font-sans">
                        {time || '00:00'}
                    </span>

                    {/* iOS 18 Widgets */}
                    {/* <div className="flex gap-4 mt-8 px-6 items-center justify-center opacity-90 transition-opacity">
                        <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10 shadow-sm">
                            <span className="text-[11px] font-bold">24°</span>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10 shadow-sm">
                            <Battery size={22} fill="currentColor" strokeWidth={1} className="text-emerald-400/80" />
                        </div>
                    </div> */}
                </div>

                {/* Notifications */}
                <div className="flex-1 w-full px-4 overflow-y-auto flex flex-col justify-start pt-10 pb-28 gap-2.5 no-scrollbar">
                    {unreadNotiIds.length > 0 && unreadNotiIds.map(id => (
                        <LockscreenNotificationItem key={id} id={id} />
                    ))}
                </div>

                {/* Bottom Shortcuts */}
                <div className="w-full px-8 flex justify-between items-end pointer-events-auto mt-auto pb-1">
                    <div className="w-12 h-12 rounded-full mb-3 bg-black/30 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white active:scale-95 active:bg-white/20 transition-all cursor-pointer shadow-lg group">
                        <Flashlight size={22} className="group-active:text-yellow-400 transition-colors" />
                    </div>

                    <div className="flex flex-col items-center gap-0 cursor-pointer group" onClick={unlock}>
                        <span className="text-[13px] font-semibold tracking-tight text-white animate-shimmer drop-shadow-sm mb-4">
                            Swipe up to open
                        </span>
                        <div className="w-[130px] h-[5px] bg-white/40 rounded-full group-hover:bg-white/60 transition-colors shadow-sm mb-1" />
                    </div>

                    <div className="w-12 h-12 rounded-full mb-3 bg-black/30 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white active:scale-90 active:bg-white/20 transition-all cursor-pointer shadow-lg group">
                        <Camera size={22} />
                    </div>
                </div>
            </div>
        </div>
    );
};
