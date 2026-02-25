import React, { useEffect, useState } from 'react';
import { useSettings } from './apps/settings/hooks/useSettings';
import { usePhoneVisibility } from '@os/phone/hooks/usePhoneVisibility';

import { useWallpaper } from './apps/settings/hooks/useWallpaper';
import { useLocation } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { phoneState } from '@os/phone/hooks/state';
import { toggleKeys } from './ui/components/Input';

interface PhoneWrapperProps {
  children: React.ReactNode;
}

const PhoneWrapper: React.FC<PhoneWrapperProps> = ({ children }) => {
  const [settings] = useSettings();
  const { bottom, visibility } = usePhoneVisibility();
  const wallpaper = useWallpaper();
  const { pathname } = useLocation();
  const setIsLocked = useSetRecoilState(phoneState.isLocked);

  return (
    <div
      className={`PhoneWrapper transition-transform duration-500 ease-in-out ${visibility ? "translate-y-0 scale-100 opacity-100" : "translate-y-[120%] scale-95 opacity-0 pointer-events-none"
        }`}
    >
      <div
        className="Phone"
        style={{
          position: 'fixed',
          transformOrigin: 'right bottom',
          transform: `scale(${settings.zoom.value}`,
          bottom,
        }}
      >
        <div
          className="PhoneFrame"
          style={{
            backgroundImage: `url(media/frames/${settings.frame.value})`,
          }}
        />
        <div
          id="phone"
          className="PhoneScreen bg-transparent dark:bg-black overflow-hidden"
          style={{
            backgroundImage: wallpaper,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: `brightness(${Math.max(30, Number(settings.brightness?.value ?? 100))}%)`,
            transition: 'filter 0.3s ease-out'
          }}
        >
          {/* iOS 26 Glass Overlay for Apps */}
          {pathname !== '/' && <div className="absolute inset-0 bg-white/10 dark:bg-black/20 z-0" />}
          {children}
        </div>

        {/* Physical Buttons Area */}
        <div className="absolute inset-0 pointer-events-none z-[1000]">
          {/* Power Button (Right Side) */}
          <div
            className="absolute right-[30px] top-[330px] w-[15px] h-[95px] cursor-pointer pointer-events-auto bg-white/0 hover:bg-white/5 active:scale-x-90 transition-all rounded-l-md"
            onClick={() => setIsLocked(true)}
            title="Lock Phone"
          />

          {/* Action Button (Left Side - Top) */}
          <div className="absolute left-[30px] top-[235px] w-[15px] h-[35px] cursor-pointer pointer-events-auto bg-white/0 hover:bg-white/5 active:scale-x-90 transition-all rounded-r-md" />

          {/* Volume Up (Left Side) */}
          <div className="absolute left-[30px] top-[305px] w-[15px] h-[65px] cursor-pointer pointer-events-auto bg-white/0 hover:bg-white/5 active:scale-x-90 transition-all rounded-r-md" />

          {/* Volume Down (Left Side) */}
          <div className="absolute left-[30px] top-[385px] w-[15px] h-[65px] cursor-pointer pointer-events-auto bg-white/0 hover:bg-white/5 active:scale-x-90 transition-all rounded-r-md" />
        </div>
      </div>
    </div>
  );
};

export default PhoneWrapper;
