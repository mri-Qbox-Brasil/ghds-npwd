import React, { useEffect, useState } from 'react';
import { useSettings } from './apps/settings/hooks/useSettings';
import { usePhoneVisibility } from '@os/phone/hooks/usePhoneVisibility';

import { useWallpaper } from './apps/settings/hooks/useWallpaper';
import { useLocation } from 'react-router-dom';
import { toggleKeys } from './ui/components/Input';

interface PhoneWrapperProps {
  children: React.ReactNode;
}

const PhoneWrapper: React.FC<PhoneWrapperProps> = ({ children }) => {
  const [settings] = useSettings();
  const { bottom, visibility } = usePhoneVisibility();
  const wallpaper = useWallpaper();
  const { pathname } = useLocation();

  const [keepGameFocus, setKeepGameFocus] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Alt' && visibility) {
        // Intercepta a tecla Alt para liberar/restringir movimentação do player no FiveM
        e.preventDefault();
        const newState = !keepGameFocus;
        setKeepGameFocus(newState);
        toggleKeys(newState);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [keepGameFocus, visibility]);

  // Se o celular fechar, garante que o foco volte ao normal para a próxima abertura
  useEffect(() => {
    if (!visibility && keepGameFocus) {
      setKeepGameFocus(false);
    }
  }, [visibility]);

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
          }}
        >
          {/* iOS 26 Glass Overlay for Apps */}
          {pathname !== '/' && <div className="absolute inset-0 bg-white/10 dark:bg-black/20 z-0" />}

          {children}
        </div>
      </div>
    </div>
  );
};

export default PhoneWrapper;
