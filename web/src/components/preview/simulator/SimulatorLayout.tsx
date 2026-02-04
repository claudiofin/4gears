import React, { useRef, useEffect, useState } from 'react';
import { DeviceType, NotchStyle, ThemeConfig } from '@/types/builder';
import { TeamConfig } from '@/constants/teams';
import { useSimulatorStyles } from '@/hooks/useSimulatorStyles';

interface SimulatorLayoutProps {
    deviceType: DeviceType;
    notchStyle: NotchStyle;
    isDarkMode: boolean;
    themeConfig: ThemeConfig;
    currentTeam: TeamConfig;
    children: React.ReactNode;
    header?: React.ReactNode;
    bottomNav?: React.ReactNode;
    inspector?: React.ReactNode;
    overlays?: React.ReactNode; // New: For burger menu, chat, notifications inside phone
    onScrollChange?: (isScrolled: boolean) => void;
}

export const SimulatorLayout: React.FC<SimulatorLayoutProps> = ({
    deviceType,
    notchStyle,
    isDarkMode,
    themeConfig,
    currentTeam,
    children,
    header,
    bottomNav,
    inspector,
    overlays,
    onScrollChange
}) => {
    const { getBodyFont, getHeadingFont } = useSimulatorStyles(themeConfig, isDarkMode);
    const scrollRef = useRef<HTMLDivElement>(null);

    const handleScroll = () => {
        if (scrollRef.current) {
            const isScrolled = scrollRef.current.scrollTop > 20;
            onScrollChange?.(isScrolled);
        }
    };

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-8 pb-32 pt-[47px] relative isolate h-full w-full">
            {/* Background Noise/Gradient for the Workspace */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none -z-10"></div>

            {/* Inspector Controls */}
            {inspector && (
                <div className="mb-2 z-40 flex items-center justify-center w-full shrink-0">
                    {inspector}
                </div>
            )}

            {/* Phone Mockup Frame */}
            <div className={`relative w-[375px] h-[812px] bg-black shadow-2xl border-[8px] border-slate-900 ring-1 ring-slate-800 overflow-hidden transform transition-transform shrink-0 ${deviceType === 'IPHONE' ? 'rounded-[50px]' : 'rounded-[24px]'}`}>

                {/* Internal App Content */}
                <div
                    className={`w-full h-full relative transition-colors duration-300 simulator-content ${isDarkMode ? 'dark bg-[#0f172a]' : 'bg-slate-50'}`}
                    style={{
                        fontFamily: getBodyFont(),
                        '--font-heading': getHeadingFont(),
                        fontSize: `${(themeConfig.fontScale || 1) * 100}%`,
                        backgroundImage: currentTeam.branding?.uiBackground ? `url(${currentTeam.branding.uiBackground})` : 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    } as React.CSSProperties}
                >
                    {/* Style Injection for Dynamic Fonts */}
                    <style>{`
                        .simulator-content {
                            --font-scale: ${themeConfig.fontScale || 1};
                        }
                        .simulator-content h1, 
                        .simulator-content h2, 
                        .simulator-content h3, 
                        .simulator-content h4, 
                        .simulator-content h5, 
                        .simulator-content h6 {
                            font-family: var(--font-heading) !important;
                        }
                        /* Tailwind Utility Scaling */
                        .simulator-content .text-\\[9px\\] { font-size: calc(9px * var(--font-scale)) !important; }
                        .simulator-content .text-\\[10px\\] { font-size: calc(10px * var(--font-scale)) !important; }
                        .simulator-content .text-\\[11px\\] { font-size: calc(11px * var(--font-scale)) !important; }
                        .simulator-content .text-xs { font-size: calc(0.75rem * var(--font-scale)) !important; }
                        .simulator-content .text-sm { font-size: calc(0.875rem * var(--font-scale)) !important; }
                        .simulator-content .text-base { font-size: calc(1rem * var(--font-scale)) !important; }
                        .simulator-content .text-lg { font-size: calc(1.125rem * var(--font-scale)) !important; }
                        .simulator-content .text-xl { font-size: calc(1.25rem * var(--font-scale)) !important; }
                        .simulator-content .text-2xl { font-size: calc(1.5rem * var(--font-scale)) !important; }
                        .simulator-content .text-3xl { font-size: calc(1.875rem * var(--font-scale)) !important; }
                    `}</style>

                    {/* Background Overlay */}
                    {currentTeam.branding?.uiBackground && (
                        <div className={`absolute inset-0 z-0 ${isDarkMode ? 'bg-black/40' : 'bg-white/20'}`} />
                    )}

                    {/* Status Bar */}
                    <div className="h-12 w-full bg-transparent absolute top-0 z-[100] flex justify-between items-center px-6 pt-2 pointer-events-none">
                        <span className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-black'} w-10`}>9:41</span>
                        {notchStyle !== 'NONE' && (
                            <div className={`absolute left-1/2 transform -translate-x-1/2 top-0 bg-black z-[100] transition-all duration-300 ${deviceType === 'ANDROID'
                                ? 'w-3 h-3 rounded-full top-4 shadow-sm'
                                : notchStyle === 'FLOATING'
                                    ? 'w-[120px] h-[35px] top-2 rounded-[20px] shadow-xl'
                                    : 'w-[120px] h-[30px] rounded-b-[24px]'
                                }`}></div>
                        )}
                        <div className="flex gap-1.5 w-10 justify-end">
                            <div className={`w-4 h-4 rounded-full border-[1.5px] ${isDarkMode ? 'border-white' : 'border-black'}`}></div>
                            <div className={`w-4 h-4 rounded-full border-[1.5px] ${isDarkMode ? 'border-white' : 'border-black'}`}></div>
                        </div>
                    </div>

                    {/* Liquid Header (Absolute) */}
                    {header}

                    {/* Scrollable Content */}
                    <div
                        ref={scrollRef}
                        onScroll={handleScroll}
                        className="w-full h-full overflow-y-auto relative hide-scrollbar z-10"
                    >
                        {children}
                    </div>

                    {/* Fixed Bottom Navigation */}
                    <div className="absolute bottom-0 w-full z-40">
                        {bottomNav}
                    </div>

                    {/* Overlays (Burger, Chat, etc.) */}
                    {overlays}

                </div>
            </div>
        </div>
    );
};
