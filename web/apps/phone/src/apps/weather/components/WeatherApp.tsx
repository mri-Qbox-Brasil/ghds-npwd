import React, { useRef } from 'react';
import { AppWrapper, AppContent } from '@ui/components';
import { DynamicHeader } from '@ui/components/DynamicHeader';
import { useTranslation } from 'react-i18next';
import { useWeather } from '../hooks/useWeather';
import { LoadingSpinner } from '@ui/components/LoadingSpinner';
import { Cloud, CloudDrizzle, CloudLightning, CloudRain, CloudSnow, Sun } from 'lucide-react';

const WeatherIconMap: Record<string, any> = {
    CLEAR: Sun,
    EXTRASUNNY: Sun,
    CLOUDS: Cloud,
    OVERCAST: Cloud,
    RAIN: CloudRain,
    CLEARING: CloudRain,
    THUNDER: CloudLightning,
    SMOG: Cloud,
    FOGGY: Cloud,
    XMAS: CloudSnow,
    SNOWLIGHT: CloudSnow,
    BLIZZARD: CloudSnow,
};

const WeatherColorMap: Record<string, string> = {
    CLEAR: 'linear-gradient(180deg, #3B82F6 0%, #1E3A8A 100%)', // Blue 500 to Blue 900
    EXTRASUNNY: 'linear-gradient(180deg, #3B82F6 0%, #1E3A8A 100%)',
    CLOUDS: 'linear-gradient(180deg, #9CA3AF 0%, #4B5563 100%)', // Gray 400 to Gray 600
    OVERCAST: 'linear-gradient(180deg, #6B7280 0%, #374151 100%)', // Gray 500 to Gray 700
    RAIN: 'linear-gradient(180deg, #1E3A8A 0%, #111827 100%)', // Blue 900 to Gray 900
    CLEARING: 'linear-gradient(180deg, #2563EB 0%, #374151 100%)', // Blue 600 to Gray 700
    THUNDER: 'linear-gradient(180deg, #312E81 0%, #111827 100%)', // Indigo 900 to Gray 900
    SMOG: 'linear-gradient(180deg, #9CA3AF 0%, #6B7280 100%)', // Gray 400 to Gray 500
    FOGGY: 'linear-gradient(180deg, #D1D5DB 0%, #6B7280 100%)', // Gray 300 to Gray 500
    XMAS: 'linear-gradient(180deg, #BFDBFE 0%, #60A5FA 100%)', // Blue 200 to Blue 400
    SNOWLIGHT: 'linear-gradient(180deg, #BFDBFE 0%, #93C5FD 100%)', // Blue 200 to Blue 300
    BLIZZARD: 'linear-gradient(180deg, #D1D5DB 0%, #6B7280 100%)', // Gray 300 to Gray 500
};

const WeatherTranslationMap: Record<string, string> = {
    CLEAR: 'Ponto Claro',
    EXTRASUNNY: 'Ensolarado',
    CLOUDS: 'Nublado',
    OVERCAST: 'Encoberto',
    RAIN: 'Chuva',
    CLEARING: 'Limpando',
    THUNDER: 'Tempestade',
    SMOG: 'Nevoeiro',
    FOGGY: 'Neblina',
    XMAS: 'Neve',
    SNOWLIGHT: 'Neve Leve',
    BLIZZARD: 'Nevasca',
};

export const WeatherApp: React.FC = () => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [t] = useTranslation();
    const { data, loading } = useWeather();

    const currentWeatherType = data?.current?.weather || 'CLEAR';
    const bgGradient = WeatherColorMap[currentWeatherType] || 'linear-gradient(180deg, #60A5FA 0%, #2563EB 100%)';
    const CurrentIcon = WeatherIconMap[currentWeatherType] || Sun;

    return (
        <AppWrapper>
            {/* iOS Dynamic Background Wrapper usando Inline Styles para bypass JIT do Tailwind */}
            <div
                className="absolute inset-0 transition-all duration-1000 -z-10"
                style={{ background: bgGradient }}
            />

            {/* Texto Título Fake estilo DynamicHeader large*/}
            <div className="pt-[44px] pb-2 px-5 sticky top-0 z-20">
                <h1 className="text-white text-[32px] font-bold tracking-tight drop-shadow-md">
                    {t('APPS_WEATHER') as string || 'Clima'}
                </h1>
            </div>

            <AppContent
                ref={scrollRef}
                className="flex flex-col grow pb-24 scrollbar-hide h-full relative !bg-transparent"
            >
                {loading ? (
                    <div className="flex-1 flex justify-center items-center">
                        <LoadingSpinner />
                    </div>
                ) : (
                    <div className="flex flex-col px-5 text-white mt-8 gap-3">

                        {/* Apple Weather Header Block */}
                        <div className="flex flex-col items-center justify-center mb-10">
                            <h2 className="text-[34px] font-normal tracking-tight drop-shadow-sm leading-none mb-1">
                                Los Santos
                            </h2>
                            {/* Temperatura Falsa p/ Design Apple */}
                            <h1 className="text-[96px] font-thin tracking-tighter drop-shadow-sm leading-none ml-4 mb-2">
                                22°
                            </h1>
                            <h3 className="text-[20px] font-medium tracking-wide drop-shadow-sm opacity-90 mb-1">
                                {WeatherTranslationMap[currentWeatherType] || currentWeatherType}
                            </h3>
                            <span className="text-[20px] font-medium opacity-90 drop-shadow-sm">
                                Máx.: 25° Mín.: 16°
                            </span>
                        </div>

                        {/* Hourly Forecast Mock (Rolagem Horizontal) */}
                        <div className="w-full bg-black/20 backdrop-blur-xl rounded-3xl p-4 border border-white/20 shadow-lg">
                            <div className="text-white/80 text-[13px] font-medium border-b border-white/10 pb-3 mb-3 pl-1">
                                PREVISÃO POR HORA
                            </div>
                            <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-2 px-1">
                                {[
                                    { time: 'Agora', temp: '22°', Icon: CurrentIcon },
                                    { time: '13:00', temp: '23°', Icon: Sun },
                                    { time: '14:00', temp: '24°', Icon: Cloud },
                                    { time: '15:00', temp: '25°', Icon: CloudRain },
                                    { time: '16:00', temp: '23°', Icon: CloudRain },
                                    { time: '17:00', temp: '21°', Icon: Cloud },
                                ].map((item, i) => (
                                    <div key={i} className="flex flex-col items-center gap-3">
                                        <span className={`text-[15px] font-medium ${i === 0 ? 'text-white' : 'text-white/90'}`}>{item.time}</span>
                                        <item.Icon size={24} className="text-white drop-shadow-sm" />
                                        <span className="text-[17px] font-semibold text-white">{item.temp}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Daily Forecast Mock (Lista Vertical) */}
                        <div className="w-full bg-black/20 backdrop-blur-xl rounded-3xl p-4 border border-white/20 shadow-lg mt-2 mb-6">
                            <div className="text-white/80 text-[13px] font-medium border-b border-white/10 pb-3 mb-3 pl-1">
                                PREVISÃO P/ 5 DIAS
                            </div>
                            <div className="flex flex-col gap-4 px-1">
                                {[
                                    { day: 'Hoje', min: '16', max: '25', Icon: CurrentIcon },
                                    { day: 'Ter', min: '15', max: '28', Icon: Sun },
                                    { day: 'Qua', min: '18', max: '22', Icon: CloudRain },
                                    { day: 'Qui', min: '14', max: '20', Icon: Cloud },
                                    { day: 'Sex', min: '17', max: '26', Icon: Sun },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between text-white border-b border-white/5 pb-4 last:border-0 last:pb-1">
                                        <span className="text-[20px] font-medium w-12">{item.day}</span>
                                        <item.Icon size={24} className="text-white drop-shadow-sm" />
                                        <div className="flex items-center gap-3 font-medium text-[17px]">
                                            <span className="text-white/50">{item.min}°</span>
                                            {/* Barra de progresso falsa */}
                                            <div className="w-24 h-1.5 rounded-full bg-black/30 overflow-hidden">
                                                <div className="h-full bg-gradient-to-r from-blue-400 to-orange-400 w-3/4 rounded-full" />
                                            </div>
                                            <span className="text-white">{item.max}°</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                )}
            </AppContent>
        </AppWrapper>
    );
};
