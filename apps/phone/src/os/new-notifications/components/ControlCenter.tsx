import React from 'react';
import { useTranslation } from 'react-i18next';
import {
    Plane,
    Wifi,
    Bluetooth,
    Radio,
    Sun,
    Volume2,
    Flashlight,
    Camera,
    Calculator,
    Moon,
    Battery,
    Music
} from 'lucide-react';
import { cn } from '@utils/css';
import { useControlCenterOpen, useNavigationBarStyle } from '../state';
import { useSettings } from '../../../apps/settings/hooks/useSettings';

export const ControlCenter = () => {
    const [t] = useTranslation();
    const [isOpen, setIsOpen] = useControlCenterOpen();

    const [airplane, setAirplane] = React.useState(false);
    const [wifi, setWifi] = React.useState(true);
    const [bluetooth, setBluetooth] = React.useState(true);
    const [radio, setRadio] = React.useState(true);

    const [navStyle] = useNavigationBarStyle();

    const [settings, setSettings] = useSettings();
    const isDarkMode = settings.theme.value === 'taso-dark';

    const toggleTheme = () => {
        const newThemeValue = isDarkMode ? 'default-light' : 'taso-dark';
        const newThemeLabel = isDarkMode ? 'Light' : 'Dark';

        setSettings({
            ...settings,
            theme: { ...settings.theme, value: newThemeValue, label: newThemeLabel }
        });

        if (newThemeValue === 'taso-dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    return (
        <div
            className={cn(
                "absolute inset-0 z-[98]",
                isOpen ? "pointer-events-auto" : "pointer-events-none delay-500" // delay para pointer actions acabarem depois q a animação acaba
            )}
            data-ignore-brightness="true"
        >
            {/* Background with heavy blur */}
            <div
                className={cn(
                    "absolute inset-0 bg-black/10 backdrop-blur-md transition-opacity duration-500",
                    isOpen ? "opacity-100" : "opacity-0"
                )}
                onClick={() => setIsOpen(false)}
                data-ignore-brightness="true"
            />

            {/* Control Center Content Container with Slide Animation */}
            <div
                className={cn(
                    "absolute inset-0 w-full h-full pt-[68px] px-6 flex flex-col transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1)",
                    isOpen ? "translate-y-0" : "-translate-y-full"
                )}
            >
                <div
                    className="grid grid-cols-4 gap-4 w-full flex-1 max-w-[360px] mx-auto auto-rows-[76px] overflow-y-auto no-scrollbar pb-10"
                >
                    {/* Linha 1 e 2 (Topo): Conectividade (2x2) e Música (2x2) */}

                    {/* Conectividade */}
                    <div className="col-span-2 row-span-2 bg-[#1C1C1E]/80 backdrop-blur-3xl rounded-[36px] p-[14px] grid grid-cols-2 gap-2 shadow-[0_4px_24px_rgba(0,0,0,0.2)] place-items-center">
                        <button
                            className="flex items-center justify-center active:scale-95 transition-transform w-[62px] h-[62px]"
                            onClick={() => setAirplane(!airplane)}
                        >
                            <div className={cn("w-full h-full rounded-full flex items-center justify-center text-white transition-colors duration-300", airplane ? "bg-[#FF9500]" : "bg-white/15")}>
                                <Plane size={24} className={airplane ? "fill-current" : ""} />
                            </div>
                        </button>
                        <button className="flex items-center justify-center active:scale-95 transition-transform w-[62px] h-[62px]">
                            <div className="w-full h-full rounded-full flex items-center justify-center text-white transition-colors duration-300 bg-[#34C759]">
                                <Radio size={24} /> {/* Airdrop Mock */}
                            </div>
                        </button>

                        <button
                            className="flex items-center justify-center active:scale-95 transition-transform w-[62px] h-[62px]"
                            onClick={() => setWifi(!wifi)}
                        >
                            <div className={cn("w-full h-full rounded-full flex items-center justify-center text-white transition-colors duration-300", wifi && !airplane ? "bg-[#0A84FF]" : "bg-white/15")}>
                                <Wifi size={24} strokeWidth={2.5} />
                            </div>
                        </button>

                        <button
                            className="flex items-center justify-center active:scale-95 transition-transform w-[62px] h-[62px]"
                            onClick={() => setBluetooth(!bluetooth)}
                        >
                            <div className={cn("w-full h-full rounded-full flex items-center justify-center text-white transition-colors duration-300", bluetooth ? "bg-[#0A84FF]" : "bg-white/15")}>
                                <Bluetooth size={24} />
                            </div>
                        </button>
                    </div>

                    {/* Música */}
                    <div className="col-span-2 row-span-2 bg-[#1C1C1E]/80 backdrop-blur-3xl rounded-[36px] p-4 flex flex-col justify-between shadow-[0_4px_24px_rgba(0,0,0,0.2)] text-white relative">
                        <div className="flex items-start justify-between">
                            <span className="text-[13px] font-medium opacity-60">Não Reproduzin...</span>
                            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0 ml-1">
                                <Radio size={12} className="opacity-80" />
                            </div>
                        </div>

                        <div className="flex justify-between items-center opacity-90 px-2 mt-2">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="19 20 9 12 19 4 19 20"></polygon><line x1="5" y1="19" x2="5" y2="5"></line></svg>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" y1="5" x2="19" y2="19"></line></svg>
                        </div>

                        <div className="flex justify-between items-center opacity-30">
                            <span className="text-[10px] tracking-widest">-:--</span>
                            <span className="text-[10px] tracking-widest">--:--</span>
                        </div>
                    </div>

                    {/* Linha 3: Trava Rotação, Espelhar Tela e Início dos Sliders de Brilho/Volume (que são col-span-1 e row-span-2 cada) */}
                    <button className="col-span-1 row-span-1 bg-white text-[#FF3B30] rounded-[22px] flex items-center justify-center shadow-[0_4px_24px_rgba(0,0,0,0.2)] active:scale-95 transition-transform">
                        <div className="w-[44px] h-[44px] rounded-[14px] flex items-center justify-center p-0.5">
                            <Radio size={24} className="opacity-90 stroke-[2] ml-1 mt-1" /> {/* Mock Trava Rotação */}
                        </div>
                    </button>
                    <button
                        className={cn(
                            "col-span-1 row-span-1 rounded-[22px] flex items-center justify-center shadow-[0_4px_24px_rgba(0,0,0,0.2)] active:scale-95 transition-all duration-300",
                            isDarkMode ? "bg-white text-black" : "bg-[#1C1C1E]/80 backdrop-blur-3xl text-white"
                        )}
                        onClick={toggleTheme}
                    >
                        <div className="w-[44px] h-[44px] rounded-[14px] flex items-center justify-center p-0.5">
                            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="10.5" cy="13.5" r="5" fill="currentColor" />
                                <circle cx="14.5" cy="9.5" r="5" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2.5 2" />
                            </svg>
                        </div>
                    </button>

                    {/* Sliders (Brilho e Volume, ocupam a Linha 3 e Linha 4 na direita) */}
                    <div className="col-span-1 row-span-2 bg-[#1C1C1E]/80 backdrop-blur-3xl rounded-[38px] relative overflow-hidden flex flex-col justify-end items-center shadow-[0_4px_24px_rgba(0,0,0,0.2)] cursor-pointer active:scale-[0.98] transition-transform">
                        <div className="absolute inset-x-0 bottom-0 bg-white h-[65%] pointer-events-none transition-all duration-300 ease-out" />
                        <div className="z-10 absolute bottom-6 text-[#FFCC00] mix-blend-exclusion">
                            <Sun size={26} className="fill-current text-white" />
                        </div>
                    </div>

                    <div className="col-span-1 row-span-2 bg-[#1C1C1E]/80 backdrop-blur-3xl rounded-[38px] relative overflow-hidden flex flex-col justify-end items-center shadow-[0_4px_24px_rgba(0,0,0,0.2)] cursor-pointer active:scale-[0.98] transition-transform">
                        <div className="absolute inset-x-0 bottom-0 bg-white h-[40%] pointer-events-none transition-all duration-300 ease-out" />
                        <div className="z-10 absolute bottom-6 text-[#0A84FF] mix-blend-exclusion">
                            <Volume2 size={26} className="fill-current text-white" />
                        </div>
                    </div>

                    {/* Linha 4: Foco (2x1 no lado esquerdo, colado abaixo da Rotação e Espelhar) */}
                    <button className="col-span-2 row-span-1 bg-[#1C1C1E]/80 backdrop-blur-3xl rounded-[28px] flex items-center justify-start px-4 shadow-[0_4px_24px_rgba(0,0,0,0.2)] text-white active:scale-95 transition-transform cursor-pointer">
                        <div className="w-[30px] h-[30px] rounded-full bg-white/15 flex items-center justify-center mr-3 shrink-0">
                            <Moon size={16} className="fill-current text-purple-400" />
                        </div>
                        <span className="text-[15px] font-medium opacity-90 tracking-wide">Foco</span>
                    </button>

                    {/* Linha 5: Atalhos 1x1 (Lanterna, Timer, Calculadora, Câmera) */}
                    <button className="col-span-1 row-span-1 bg-[#1C1C1E]/80 backdrop-blur-3xl text-white rounded-full flex items-center justify-center shadow-[0_4px_24px_rgba(0,0,0,0.2)] active:scale-95 transition-transform">
                        <Flashlight size={28} className="opacity-90 fill-current" />
                    </button>
                    <button className="col-span-1 row-span-1 bg-[#1C1C1E]/80 backdrop-blur-3xl rounded-full flex items-center justify-center text-white active:scale-95 transition-transform shadow-[0_4px_24px_rgba(0,0,0,0.2)]">
                        <Radio size={28} className="opacity-80" /> {/* Timer Mock */}
                    </button>
                    <button className="col-span-1 row-span-1 bg-[#1C1C1E]/80 backdrop-blur-3xl rounded-full flex items-center justify-center text-white active:scale-95 transition-transform shadow-[0_4px_24px_rgba(0,0,0,0.2)]">
                        <Calculator size={28} className="opacity-80" />
                    </button>
                    <button className="col-span-1 row-span-1 bg-[#1C1C1E]/80 backdrop-blur-3xl rounded-full flex items-center justify-center text-white active:scale-95 transition-transform shadow-[0_4px_24px_rgba(0,0,0,0.2)]">
                        <Camera size={28} className="opacity-80" />
                    </button>

                    {/* Linha 6 (Opcional): Mais Atalhos 1x1... */}
                    <button className="col-span-1 row-span-1 bg-[#1C1C1E]/80 backdrop-blur-3xl rounded-full flex items-center justify-center text-white active:scale-95 transition-transform shadow-[0_4px_24px_rgba(0,0,0,0.2)]">
                        <Radio size={28} className="opacity-80" />
                    </button>
                    <button className="col-span-1 row-span-1 bg-[#1C1C1E]/80 backdrop-blur-3xl rounded-full flex items-center justify-center text-white active:scale-95 transition-transform shadow-[0_4px_24px_rgba(0,0,0,0.2)]">
                        <Radio size={28} className="opacity-80" />
                    </button>
                    <button className="col-span-1 row-span-1 bg-[#1C1C1E]/80 backdrop-blur-3xl rounded-full flex items-center justify-center text-white active:scale-95 transition-transform shadow-[0_4px_24px_rgba(0,0,0,0.2)]">
                        <Music size={28} className="opacity-80" /> {/* Shazam Mock */}
                    </button>
                    <button className="col-span-1 row-span-1 bg-[#1C1C1E]/80 backdrop-blur-3xl rounded-full flex items-center justify-center text-white active:scale-95 transition-transform shadow-[0_4px_24px_rgba(0,0,0,0.2)]">
                        <Battery size={28} className="opacity-80" />
                    </button>
                </div>

                {/* Deslize para Cima Button */}
                <div className="flex justify-center mt-auto pb-8 pt-4">
                    <button
                        className={cn(
                            "mx-auto cursor-pointer appearance-none bg-transparent border-none p-2 rounded-full active:scale-90 transition-all font-semibold",
                            navStyle === 'light' ? "text-white/60 hover:text-white" : "text-black/60 hover:text-black"
                        )}
                        onClick={() => setIsOpen(false)}
                    >
                        Deslize para Cima
                    </button>
                </div>
            </div>
        </div>
    );
};
