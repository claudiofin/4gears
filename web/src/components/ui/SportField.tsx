import React from 'react';
import { ThemeConfig } from '../../types/builder';

interface SportFieldProps {
    sportType: string;
    themeConfig?: ThemeConfig;
    isDarkMode?: boolean;
}

export const SportField: React.FC<SportFieldProps> = ({ sportType, isDarkMode = true }) => {
    // Common styles
    const lineStyle = "absolute border-white/60";
    const centerAbsolute = "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2";

    const renderField = () => {
        switch (sportType) {
            case 'Calcio':
                return (
                    <div className="w-full h-full bg-[#2e8b57] relative overflow-hidden shadow-inner border-2 border-white/20">
                        {/* Grass Texture Effect */}
                        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/grass.png')]"></div>

                        {/* Outer Lines */}
                        <div className={`absolute inset-4 border-2 ${lineStyle} rounded-sm`}></div>

                        {/* Center Line */}
                        <div className={`absolute top-1/2 left-4 right-4 h-0.5 bg-white/60`}></div>

                        {/* Center Circle */}
                        <div className={`${centerAbsolute} w-24 h-24 border-2 ${lineStyle} rounded-full`}></div>
                        <div className={`${centerAbsolute} w-1 h-1 bg-white rounded-full`}></div>

                        {/* Penalty Areas - Top */}
                        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-48 h-24 border-2 border-t-0 ${lineStyle}"></div>
                        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-20 h-8 border-2 border-t-0 ${lineStyle} bg-transparent"></div>

                        {/* Penalty Areas - Bottom */}
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-48 h-24 border-2 border-b-0 ${lineStyle}"></div>
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-20 h-8 border-2 border-b-0 ${lineStyle} bg-transparent"></div>

                        {/* Corners */}
                        <div className="absolute top-4 left-4 w-4 h-4 border-b-2 border-r-2 border-white/60 rounded-br-full"></div>
                        <div className="absolute top-4 right-4 w-4 h-4 border-b-2 border-l-2 border-white/60 rounded-bl-full"></div>
                        <div className="absolute bottom-4 left-4 w-4 h-4 border-t-2 border-r-2 border-white/60 rounded-tr-full"></div>
                        <div className="absolute bottom-4 right-4 w-4 h-4 border-t-2 border-l-2 border-white/60 rounded-tl-full"></div>
                    </div>
                );

            case 'Basket':
                return (
                    <div className="w-full h-full bg-[#d2a679] relative overflow-hidden shadow-inner border-2 border-[#1a1a1a]">
                        {/* Hardwood Texture Effect */}
                        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]"></div>

                        {/* Court Lines (Black/Dark for Basket usually, or White on dark) */}
                        <div className="absolute inset-4 border-2 border-white/70"></div>

                        {/* Center Line */}
                        <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-white/70"></div>
                        <div className={`${centerAbsolute} w-20 h-20 border-2 border-white/70 rounded-full`}></div>

                        {/* 3 Point Line & Key - Top */}
                        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-full h-[35%] max-w-[80%] border-2 border-t-0 border-white/70 rounded-b-full"></div>
                        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-32 h-36 border-2 border-t-0 border-white/70 bg-black/10"></div>
                        <div className="absolute top-36 left-1/2 transform -translate-x-1/2 w-32 h-16 border-2 border-white/70 rounded-full"></div>

                        {/* 3 Point Line & Key - Bottom */}
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-full h-[35%] max-w-[80%] border-2 border-b-0 border-white/70 rounded-t-full"></div>
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-36 border-2 border-b-0 border-white/70 bg-black/10"></div>
                        <div className="absolute bottom-36 left-1/2 transform -translate-x-1/2 w-32 h-16 border-2 border-white/70 rounded-full"></div>
                    </div>
                );

            case 'Volley':
                return (
                    <div className="w-full h-full bg-[#fde047] relative overflow-hidden border-2 border-white">
                        {/* Court Colors - classic Orange/Blue usually but let's do a modern stylized one*/}
                        <div className="absolute inset-4 bg-[#f97316] border-2 border-white">
                            {/* Attack Lines */}
                            <div className="absolute top-[33%] left-0 right-0 h-0.5 bg-white/80"></div>
                            <div className="absolute bottom-[33%] left-0 right-0 h-0.5 bg-white/80"></div>

                            {/* Center Line / Net */}
                            <div className="absolute top-1/2 left-[-10%] right-[-10%] h-1 bg-white shadow-lg z-10"></div>
                        </div>
                    </div>
                );
            case 'Rugby':
                return (
                    <div className="w-full h-full bg-[#2e8b57] relative overflow-hidden shadow-inner border-2 border-white/20">
                        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/grass.png')]"></div>
                        <div className={`absolute inset-4 border-2 ${lineStyle}`}></div>

                        {/* Try Lines */}
                        <div className="absolute top-[15%] left-4 right-4 h-0.5 bg-white/60"></div>
                        <div className="absolute bottom-[15%] left-4 right-4 h-0.5 bg-white/60"></div>

                        {/* 22m Lines (Approx) */}
                        <div className="absolute top-[35%] left-4 right-4 h-0.5 bg-white/40 dashed"></div>
                        <div className="absolute bottom-[35%] left-4 right-4 h-0.5 bg-white/40 dashed"></div>

                        {/* Halfway */}
                        <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-white/60"></div>

                        {/* 10m Dashed */}
                        <div className="absolute top-[45%] left-4 right-4 border-t-2 border-dashed border-white/30"></div>
                        <div className="absolute bottom-[45%] left-4 right-4 border-t-2 border-dashed border-white/30"></div>
                    </div>
                );

            case 'Tennis':
                return (
                    <div className="w-full h-full bg-[#4ade80] p-6 relative overflow-hidden flex items-center justify-center">
                        {/* Court */}
                        <div className="w-[80%] h-[90%] bg-[#ef4444] border-2 border-white relative">
                            {/* Singles Lines */}
                            <div className="absolute inset-y-0 left-[10%] w-[80%] border-x-2 border-white"></div>

                            {/* Service Boxes */}
                            <div className="absolute top-[20%] bottom-[20%] left-[10%] right-[10%] border-y-2 border-white">
                                {/* Center Service Line */}
                                <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white transform -translate-x-1/2"></div>
                            </div>

                            {/* Net */}
                            <div className="absolute top-1/2 left-[-5%] right-[-5%] h-1 bg-white/90 shadow z-10 transform -translate-y-1/2 flex items-center justify-center">
                                <div className="w-full h-hull bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-50"></div>
                            </div>
                        </div>
                    </div>
                );

            case 'Hockey Prato':
                return (
                    <div className="w-full h-full bg-[#34d399] relative overflow-hidden shadow-inner border-2 border-white/40">
                        {/* Turf texture */}
                        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]"></div>

                        {/* Outer Lines */}
                        <div className="absolute inset-4 border-2 border-white/60"></div>

                        {/* Center Line */}
                        <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-white/60"></div>
                        <div className={`${centerAbsolute} w-16 h-16 border-2 border-white/60 rounded-full`}></div>

                        {/* Shooting Circles (D-shaped) */}
                        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-48 h-32 border-2 border-white/60 rounded-b-full"></div>
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-48 h-32 border-2 border-white/60 rounded-t-full"></div>
                    </div>
                );

            case 'Pallanuoto':
                return (
                    <div className="w-full h-full bg-blue-500 relative overflow-hidden shadow-inner border-2 border-blue-300">
                        {/* Water effect */}
                        <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/water.png')]"></div>

                        {/* Pool Boundary */}
                        <div className="absolute inset-2 border-2 border-white/40"></div>

                        {/* 2m Lines (Red) */}
                        <div className="absolute top-[10%] left-2 right-2 h-0.5 bg-red-500/60"></div>
                        <div className="absolute bottom-[10%] left-2 right-2 h-0.5 bg-red-500/60"></div>

                        {/* 5m Lines (Yellow) */}
                        <div className="absolute top-[25%] left-2 right-2 h-0.5 bg-yellow-400/60"></div>
                        <div className="absolute bottom-[25%] left-2 right-2 h-0.5 bg-yellow-400/60"></div>

                        {/* Midline (White) */}
                        <div className="absolute top-1/2 left-2 right-2 h-0.5 bg-white/60"></div>
                    </div>
                );

            case 'Baseball':
                return (
                    <div className="w-full h-full bg-[#166534] relative overflow-hidden">
                        {/* Dirt Diamond */}
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-80 h-80 bg-[#a16207] rotate-45 translate-y-1/2 rounded-sm border-2 border-white/30"></div>

                        {/* Grass Infield */}
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-40 h-40 bg-[#15803d] rotate-45 translate-y-1/2 border-2 border-white/30"></div>

                        {/* Bases */}
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white rotate-45 shadow-md"></div> {/* Home */}
                        <div className="absolute bottom-40 left-1/2 transform -translate-x-1/2 -translate-y-40 w-4 h-4 bg-white rotate-45 shadow-md"></div> {/* 2nd */}
                        <div className="absolute bottom-40 left-1/2 transform -translate-x-[100px] -translate-y-[100px] w-4 h-4 bg-white rotate-45 shadow-md"></div> {/* 1st */}
                        <div className="absolute bottom-40 left-1/2 transform translate-x-[80px] -translate-y-[100px] w-4 h-4 bg-white rotate-45 shadow-md"></div> {/* 3rd */}
                    </div>
                );

            case 'Curling':
                return (
                    <div className="w-full h-full bg-slate-100 relative overflow-hidden shadow-inner border-2 border-slate-300">
                        {/* Ice texture */}
                        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

                        {/* The House (Target) */}
                        <div className={`${centerAbsolute} transform -translate-y-[110%] w-48 h-48 rounded-full border-[10px] border-blue-500`}></div>
                        <div className={`${centerAbsolute} transform -translate-y-[110%] w-32 h-32 rounded-full border-[10px] border-white`}></div>
                        <div className={`${centerAbsolute} transform -translate-y-[110%] w-16 h-16 rounded-full border-[10px] border-red-500 bg-white`}></div>

                        {/* Center Line */}
                        <div className="absolute inset-y-0 left-1/2 w-0.5 bg-blue-500/30"></div>

                        {/* Hog Line */}
                        <div className="absolute top-[60%] left-0 right-0 h-1 bg-red-600/50"></div>
                    </div>
                );

            default:
                // Generic Green Field
                return (
                    <div className="w-full h-full bg-[#15803d] relative overflow-hidden shadow-inner border-2 border-white/20">
                        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/grass.png')]"></div>
                        <div className="absolute inset-4 border-2 border-white/50 rounded-lg"></div>
                        <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-white/30"></div>
                        <div className={`${centerAbsolute} w-20 h-20 border-2 border-white/30 rounded-full`}></div>
                    </div>
                );
        }
    };

    return (
        <div className="w-full h-full rounded-lg overflow-hidden select-none">
            {renderField()}
        </div>
    );
};
