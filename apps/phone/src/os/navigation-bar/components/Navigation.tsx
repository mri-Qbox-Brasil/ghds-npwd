import React, { useEffect, useState, useRef } from 'react';
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom';
import { usePhone } from '@os/phone/hooks/usePhone';
import { useNavigationBarStyle, useControlCenterOpen } from '@os/new-notifications/state';
import { getAmbientBrightness } from '@utils/getBrightness';
import { useSettings } from '../../../apps/settings/hooks/useSettings';
import { useWallpaper } from '../../../apps/settings/hooks/useWallpaper';
import { cn } from '@utils/cn';

export const Navigation: React.FC = () => {
  const containerRef = useRef<HTMLButtonElement>(null);
  const [isVisible, setisVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isBrieflyVisible, setIsBrieflyVisible] = useState(false);
  const [isOverIframe, setIsOverIframe] = useState(false);
  const [navBarStyle, setNavigationBarStyle] = useNavigationBarStyle();
  const [isOpen] = useControlCenterOpen();
  const [settings] = useSettings();
  const wallpaper = useWallpaper();
  const history = useHistory();
  const { isExact } = useRouteMatch('/');
  const { closePhone } = usePhone();
  const location = useLocation();

  // Transient visibility when entering an app
  useEffect(() => {
    if (location.pathname !== '/') {
      setIsBrieflyVisible(true);
      const timer = setTimeout(() => setIsBrieflyVisible(false), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsBrieflyVisible(false);
      setIsHovered(false);
    }
  }, [location.pathname]);

  // Ambient Sensor detection
  useEffect(() => {
    const detectBrightness = async () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;

      const elements = document.elementsFromPoint(x, y);
      const overIframe = elements.some((el) => el.tagName.toLowerCase() === 'iframe');
      setIsOverIframe(overIframe);

      if (overIframe) return; // Skip Canvas reading if over Iframe

      const style = await getAmbientBrightness(
        x,
        y,
        containerRef.current,
        wallpaper
      );

      setNavigationBarStyle(style);
    };

    // Run detection with a slight delay to ensure content is settled
    const timeout = setTimeout(detectBrightness, 300);
    return () => clearTimeout(timeout);
  }, [location.pathname, wallpaper, settings.theme.value, isOpen, setNavigationBarStyle]);

  // const handleGoBackInHistory = () => {
  //   history.goBack();
  // };

  const handleGoToMenu = () => {
    if (isExact) return;
    setIsHovered(false);
    setIsBrieflyVisible(false);
    history.push('/');
  };

  useEffect(() => {
    if (location.pathname == '/') {
      setisVisible(false)
      setIsHovered(false);
      setIsBrieflyVisible(false);
    } else {
      setisVisible(true)
    }

  }, [location.pathname])

  return (
    <div
      className={cn(
        "absolute bottom-0 left-1/2 -translate-x-1/2 w-[200px] h-4 z-[1000] pointer-events-auto flex items-end justify-center pb-2",
        isOverIframe && "mix-blend-difference"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isVisible &&
        <button
          ref={containerRef}
          className={cn(
            "cursor-pointer appearance-none bg-transparent border-none p-2 transition-all duration-500 ease-in-out",
            (isHovered || isBrieflyVisible) ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95"
          )}
          onClick={handleGoToMenu}
        >
          <div className={cn(
            "w-[145px] h-[5px] rounded-[0.5rem] transition-colors duration-500",
            isOverIframe
              ? "bg-white"
              : cn("shadow-[0_1px_4px_rgba(0,0,0,0.1)]", navBarStyle === 'light' ? "bg-white/80" : "bg-black/80")
          )} />
        </button>
      }
    </div>
  );
};
