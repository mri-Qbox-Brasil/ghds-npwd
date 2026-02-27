import React, { useEffect, useState, useRef } from 'react';
import { cn } from '@utils/cn';
import { ChevronLeft } from 'lucide-react';
import { useHistory } from 'react-router-dom';

interface DynamicHeaderProps {
    title: string;
    scrollRef?: React.RefObject<HTMLDivElement>;
    showBackButton?: boolean;
    variant?: 'pinned' | 'largeTitle' | 'both';
    rightContent?: React.ReactNode;
    leftContent?: React.ReactNode;
    centerContent?: React.ReactNode;
    forceBackdrop?: boolean;
}

export const DynamicHeader: React.FC<DynamicHeaderProps> = ({
    title,
    scrollRef,
    showBackButton = false,
    variant = 'both',
    rightContent,
    leftContent,
    centerContent,
    forceBackdrop = false
}) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const history = useHistory();

    useEffect(() => {
        const handleScroll = () => {
            if (scrollRef?.current) {
                setIsScrolled(scrollRef.current.scrollTop > 20);
            }
        };

        const scrollContainer = scrollRef?.current;
        if (scrollContainer) {
            scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
            return () => scrollContainer.removeEventListener('scroll', handleScroll);
        }
    }, [scrollRef]);

    const PinnedHeader = (
        <div
            className={cn(
                variant === 'pinned' ? "absolute inset-x-0 top-0" : "sticky top-0",
                "z-50 w-full pt-[60px] pb-4 px-4 grid grid-cols-3 items-center transition-colors duration-200 border-b",
                isScrolled || forceBackdrop
                    ? "bg-white/70 dark:bg-[#000000]/70 backdrop-blur-md border-neutral-300 dark:border-white/10"
                    : "bg-transparent border-transparent"
            )}
        >
            {/* Left Side (Back Button or Empty Space) */}
            <div className="flex items-center justify-start z-10 min-w-0">
                {showBackButton && (
                    <button
                        onClick={() => history.goBack()}
                        className="flex items-center gap-1 -ml-2 text-blue-500 hover:text-blue-600 transition-colors cursor-pointer appearance-none bg-transparent border-none"
                    >
                        <ChevronLeft size={24} strokeWidth={2.5} />
                        <span className="text-[17px] font-normal tracking-tight">Voltar</span>
                    </button>
                )}
                {!showBackButton && leftContent}
            </div>

            {/* Center Title (Perfect hardware-centered alignment) */}
            <div
                className={cn(
                    "transition-opacity duration-200 flex items-center justify-center min-w-0",
                    centerContent ? "opacity-100" : (isScrolled ? "opacity-100" : "opacity-0")
                )}
            >
                {centerContent ? (
                    centerContent
                ) : (
                    <span
                        className="text-[17px] font-semibold text-neutral-900 dark:text-white tracking-tight truncate px-2 block m-0 p-0 leading-none"
                        style={{ transform: 'translateZ(0)', WebkitFontSmoothing: 'antialiased' }}
                    >
                        {title}
                    </span>
                )}
            </div>

            {/* Right Side */}
            <div className="flex items-center justify-end z-10 min-w-0">
                {rightContent}
            </div>
        </div>
    );

    const LargeTitle = (
        <div className={cn("px-4 pb-2", variant === 'largeTitle' ? "pt-24" : "pt-1")}>
            <h1
                className={cn(
                    "text-[34px] font-bold text-neutral-900 dark:text-white tracking-tight transition-opacity duration-200",
                    isScrolled ? "opacity-0" : "opacity-100"
                )}
            >
                {title}
            </h1>
        </div>
    );

    if (variant === 'pinned') return PinnedHeader;
    if (variant === 'largeTitle') return LargeTitle;

    return (
        <>
            {PinnedHeader}
            {LargeTitle}
        </>
    );
};
