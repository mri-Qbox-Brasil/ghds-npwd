import React from 'react';
import { IApp } from '../config/apps';
import { ExternalAppBoundary } from './externalAppBoundary';
import { useTranslation } from 'react-i18next';
import { LoadingSpinner } from '@ui/components/LoadingSpinner';

const colorShade = (col: any, amt: number) => {
  col = col.replace(/^#/, '');
  if (col.length === 3) col = col[0] + col[0] + col[1] + col[1] + col[2] + col[2];

  let [r, g, b] = col.match(/.{2}/g);
  [r, g, b] = [parseInt(r, 16) + amt, parseInt(g, 16) + amt, parseInt(b, 16) + amt];

  r = Math.max(Math.min(255, r), 0).toString(16);
  g = Math.max(Math.min(255, g), 0).toString(16);
  b = Math.max(Math.min(255, b), 0).toString(16);

  const rr = (r.length < 2 ? '0' : '') + r;
  const gg = (g.length < 2 ? '0' : '') + g;
  const bb = (b.length < 2 ? '0' : '') + b;

  return `#${rr}${gg}${bb}`;
};

const generateBackground = (bg: string) => {
  if (!bg) return 'linear-gradient(45deg, #121212, #1a1a1a)';
  const light = colorShade(bg, 30);
  const dark = colorShade(bg, -30);
  return `linear-gradient(45deg, ${light}, ${dark}, ${light}, ${dark}, ${dark})`;
};

const SplashScreen = (props: IApp) => {
  const { backgroundColor, icon } = props;
  const background = generateBackground(backgroundColor);

  return (
    <div
      className="h-full w-full flex flex-col items-center justify-center animate-in fade-in duration-500"
      style={{ background, backgroundSize: '400% 400%' }}
    >
      <div className="animate-breath scale-110 mb-8 opacity-90">
        <div className="w-20 h-20 flex items-center justify-center">
          {icon}
        </div>
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 scale-75 opacity-50">
        <LoadingSpinner />
      </div>

      <style>{`
        @keyframes breath {
            0% { transform: scale(1); opacity: 0.7; }
            100% { transform: scale(1.1); opacity: 1; }
        }
        .animate-breath {
            animation: breath 2s ease-in-out infinite alternate;
        }
      `}</style>
    </div>
  );
};

export function createExternalAppProvider(config: IApp) {
  return ({ children }: { children: React.ReactNode }) => {
    const { t } = useTranslation();
    const background = generateBackground(config.backgroundColor ?? '#222');

    return (
      <ExternalAppBoundary background={background} color={config.color} t={t}>
        <React.Suspense fallback={<SplashScreen {...config} />}>
          {children}
        </React.Suspense>
      </ExternalAppBoundary>
    );
  };
}
