import React, { useRef, useState, useEffect } from 'react';
import { cn } from '@utils/css';

interface VerticalSliderProps {
    value: number; // 0 to 100
    onChange: (value: number) => void;
    icon: React.ReactNode;
    activeColor?: string; // Cor do ícone quando tem valor > 0
    inactiveColor?: string; // Cor do ícone no zero
}

export const VerticalSlider: React.FC<VerticalSliderProps> = ({
    value,
    onChange,
    icon,
    activeColor = 'text-[#0A84FF]',
    inactiveColor = 'text-white'
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    // Calcula a porcentagem baseada na posição do pointer (mouse/touch)
    const calculateValue = (clientY: number) => {
        if (!containerRef.current) return;
        const { top, height } = containerRef.current.getBoundingClientRect();
        const relativeY = clientY - top;
        // Como 0% é na base e 100% no topo, invertemos a leitura (height - relativeY)
        let percent = ((height - relativeY) / height) * 100;

        if (percent < 0) percent = 0;
        if (percent > 100) percent = 100;

        onChange(Math.round(percent));
    };

    const handlePointerDown = (e: React.PointerEvent) => {
        setIsDragging(true);
        calculateValue(e.clientY);
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!isDragging) return;
        calculateValue(e.clientY);
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        setIsDragging(false);
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    };

    return (
        <div
            ref={containerRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className={cn(
                "w-full h-full bg-[#1C1C1E]/80 backdrop-blur-lg rounded-[38px] relative overflow-hidden flex flex-col justify-end items-center shadow-[0_4px_24px_rgba(0,0,0,0.2)] cursor-pointer touch-none",
                isDragging ? "scale-[0.98] transition-transform" : "transition-transform duration-300"
            )}
        >
            {/* Barra de preenchimento branca */}
            <div
                className="absolute inset-x-0 bottom-0 bg-white pointer-events-none transition-all duration-75 ease-out"
                style={{ height: `${value}%` }}
            />

            {/* Ícone fixo na base que reage à cor invertida (mix-blend-exclusion) */}
            <div className={cn("z-10 absolute bottom-6 mix-blend-exclusion transition-colors", value > 0 ? activeColor : inactiveColor)}>
                {/* Passando uma classe global para o SVG preencher a própria cor recebida */}
                <div className="text-white hover:text-white child-svg:fill-current child-svg:w-full child-svg:h-full">
                    {icon}
                </div>
            </div>
        </div>
    );
};
