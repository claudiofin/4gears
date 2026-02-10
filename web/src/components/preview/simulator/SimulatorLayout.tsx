import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { DeviceType, NotchStyle, ThemeConfig } from '@/types/builder';
import { TeamConfig } from '@/constants/teams';
import { useSimulatorStyles } from '@/hooks/useSimulatorStyles';
import { RoleBasedExperience } from './RoleBasedExperience';

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
    overlays?: React.ReactNode;
    isStandalone?: boolean;
    onScrollChange?: (isScrolled: boolean) => void;
    marketingMode?: boolean;
    marketingQuote?: string;
    marketingBg?: string;
    marketingTemplate?: '3d' | 'front';
    rolePreview?: 'coach' | 'athlete' | 'fan' | 'admin' | null;
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
    isStandalone = false,
    onScrollChange,
    marketingMode = false,
    marketingQuote = "La passione per il gioco, ovunque tu sia.",
    marketingBg = "linear-gradient(135deg, #4f46e5 0%, #1e1b4b 100%)",
    marketingTemplate = '3d',
    rolePreview
}) => {
    const { getBodyFont, getHeadingFont } = useSimulatorStyles(themeConfig, isDarkMode);
    const scrollRef = useRef<HTMLDivElement>(null);

    const handleScroll = () => {
        if (scrollRef.current) {
            const isScrolled = scrollRef.current.scrollTop > 20;
            onScrollChange?.(isScrolled);
        }
    };

    const simulatorContent = (
        <div className={`relative transition-all duration-500 shrink-0 ${isStandalone || marketingMode
            ? 'w-full h-full'
            : `w-[375px] h-[812px] bg-black shadow-2xl border-[8px] border-slate-900 ring-1 ring-slate-800 overflow-hidden ${deviceType === 'IPHONE' ? 'rounded-[50px]' : 'rounded-[24px]'}`
            }`}>

            {/* Internal App Content */}
            <div
                className={`w-full h-full relative transition-colors duration-300 simulator-content ${isDarkMode ? 'dark bg-[#0f172a]' : 'bg-slate-50'} ${marketingMode ? 'rounded-[32px] overflow-hidden' : ''}`}
                style={{
                    fontFamily: getBodyFont(),
                    '--font-heading': getHeadingFont(),
                    fontSize: `${(themeConfig.fontScale || 1) * 100}%`,
                    backgroundImage: currentTeam.branding?.uiBackground ? `url(${currentTeam.branding.uiBackground})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    '--safe-area-top': 'env(safe-area-inset-top)',
                    '--safe-area-bottom': 'env(safe-area-inset-bottom)',
                    '--safe-area-left': 'env(safe-area-inset-left)',
                    '--safe-area-right': 'env(safe-area-inset-right)',
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
                {!isStandalone && (
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
                )}

                {!rolePreview && header}

                <div
                    ref={scrollRef}
                    onScroll={handleScroll}
                    className="w-full h-full overflow-y-auto relative hide-scrollbar z-10"
                >
                    {rolePreview ? (
                        <RoleBasedExperience role={rolePreview} clubName={currentTeam.name} />
                    ) : (
                        children
                    )}
                </div>

                {!rolePreview && (
                    <div className="absolute bottom-0 w-full z-40">
                        {bottomNav}
                    </div>
                )}

                {overlays}

            </div>
        </div>
    );

    if (marketingMode) {
        return (
            <div
                className="relative w-full h-full flex flex-col items-center justify-center p-20 overflow-hidden"
                style={{ background: marketingBg }}
            >
                {/* Visual Flair */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white opacity-5 blur-[120px] rounded-full -mr-32 -mt-32" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500 opacity-10 blur-[100px] rounded-full -ml-20 -mb-20" />

                <div className="relative w-full max-w-4xl flex flex-col items-center gap-12 text-center">
                    <div className="space-y-4">
                        <div className="px-5 py-2 inline-block bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white text-sm font-black uppercase tracking-widest italic leading-none">
                            {currentTeam.name}
                        </div>
                        <h2 className="text-6xl font-black text-white leading-none tracking-tighter uppercase italic drop-shadow-2xl">
                            {marketingQuote}
                        </h2>
                    </div>

                    <div className="relative w-[340px] h-[680px]">
                        <motion.div
                            initial={false}
                            animate={{
                                rotateY: marketingTemplate === '3d' ? -15 : 0,
                                rotateX: marketingTemplate === '3d' ? 5 : 0,
                                scale: 1.1,
                            }}
                            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                            className="w-full h-full bg-slate-900 rounded-[50px] shadow-[0_50px_100px_rgba(0,0,0,0.5)] border-[8px] border-slate-800"
                        >
                            {simulatorContent}
                        </motion.div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`flex-1 flex flex-col items-center justify-center ${isStandalone ? 'p-0' : 'p-4 pb-12 pt-[47px]'} relative isolate h-full w-full`}>
            {inspector && (
                <div className="mb-2 z-40 flex items-center justify-center w-full shrink-0">
                    {inspector}
                </div>
            )}
            {simulatorContent}
        </div>
    );
};
