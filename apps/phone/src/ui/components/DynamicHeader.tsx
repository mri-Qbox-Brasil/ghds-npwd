import React, { useEffect, useState, useRef } from 'react';
import { cn } from '@utils/cn';
import { ChevronLeft } from 'lucide-react';
import { useHistory } from 'react-router-dom';

interface DynamicHeaderProps {
    title: string;
    scrollRef?: React.RefObject<HTMLDivElement>;
    showBackButton?: boolean;
}

export const DynamicHeader: React.FC<DynamicHeaderProps> = ({
    title,
    scrollRef,
    showBackButton = false
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
            scrollContainer.addEventListener('scroll', handleScroll);
            return () => scrollContainer.removeEventListener('scroll', handleScroll);
        }
    }, [scrollRef]);

    return (
        <>
            {/* Pinned Inline Header + Status Bar Protector */}
            <div
                className={cn(
                    "sticky top-0 z-50 w-full pt-14 pb-2 px-4 flex items-center justify-between transition-all duration-300",
                    isScrolled
                        ? "bg-[#F2F2F7]/85 dark:bg-black/85 backdrop-blur-md border-b border-neutral-300 dark:border-white/10"
                        : "bg-transparent border-transparent"
                )}
            >
                {/* Left Side (Back Button or Empty Space) */}
                <div className="flex-1 min-w-[60px]">
                    {showBackButton && (
                        <button
                            onClick={() => history.goBack()}
                            className="flex items-center gap-1 -ml-2 text-blue-500 hover:text-blue-600 transition-colors"
                        >
                            <ChevronLeft size={24} strokeWidth={2.5} />
                            <span className="text-[17px] font-normal tracking-tight">Voltar</span>
                        </button>
                    )}
                </div>

                {/* Center Title (Inline) */}
                <div
                    className={cn(
                        "flex-[2] text-center transition-opacity duration-300",
                        isScrolled ? "opacity-100" : "opacity-0"
                    )}
                >
                    <span className="text-[16px] font-semibold text-neutral-900 dark:text-white tracking-tight truncate block">
                        {title}
                    </span>
                </div>

                {/* Right Side (Future Actions or Empty Space) */}
                <div className="flex-1 min-w-[60px]" />
            </div>

            {/* Large Title Area (Scrolls Naturally) */}
            <div className="px-4 pt-1 pb-2">
                <h1
                    className={cn(
                        "text-[34px] font-bold text-neutral-900 dark:text-white tracking-tight transition-opacity duration-200",
                        isScrolled ? "opacity-0" : "opacity-100"
                    )}
                >
                    {title}
                </h1>
            </div>
        </>
    );
};
