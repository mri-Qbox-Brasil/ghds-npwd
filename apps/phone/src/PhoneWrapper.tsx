import React from 'react';
import { useSettings } from './apps/settings/hooks/useSettings';
import { usePhoneVisibility } from '@os/phone/hooks/usePhoneVisibility';
import { Slide } from '@mui/material';
import { useWallpaper } from './apps/settings/hooks/useWallpaper';
import { useLocation } from 'react-router-dom';

interface PhoneWrapperProps {
  children: React.ReactNode;
}

const PhoneWrapper: React.FC<PhoneWrapperProps> = ({ children }) => {
  const [settings] = useSettings();
  const { bottom, visibility } = usePhoneVisibility();
  const wallpaper = useWallpaper();

  const { pathname } = useLocation();

  return (
    <Slide direction="up" timeout={{ enter: 500, exit: 500 }} in={visibility}>
      <div className="PhoneWrapper">
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
            }}
          >
            {/* iOS 26 Glass Overlay for Apps */}
            {pathname !== '/' && <div className="absolute inset-0 bg-white/10 dark:bg-black/20 backdrop-blur-[2px] z-0" />}
            <div className="relative z-10 w-full h-full flex flex-col">
              {children}
            </div>
          </div>
        </div>
      </div>
    </Slide>
  );
};

export default PhoneWrapper;
