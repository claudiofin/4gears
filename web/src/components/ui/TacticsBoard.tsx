import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SportField } from './SportField';
import { ThemeConfig } from '../../types/builder';
import {
    Move,
    Type,
    MousePointer2,
    Circle,
    ArrowRight,
    Eraser,
    Plus,
    Minus,
    Shirt,
    Undo2,
    Redo2,
    Trash2
} from 'lucide-react';

interface TacticsBoardProps {
    sportType: string;
    themeConfig?: ThemeConfig;
    isDarkMode?: boolean;
}

interface PlayerToken {
    id: number;
    x: number;
    y: number;
    team: 'home' | 'away'; // 'home' or 'away'
    number: string;
    label?: string;
}

export const TacticsBoard: React.FC<TacticsBoardProps> = ({ sportType, themeConfig, isDarkMode = true }) => {
    // State
    const [tokens, setTokens] = useState<PlayerToken[]>([]);

    useEffect(() => {
        const getInitialTokens = () => {
            const base = [];
            let count = 6;
            if (sportType === 'Calcio') count = 11;
            else if (sportType === 'Basket') count = 5;
            else if (sportType === 'Rugby') count = 15;
            else if (sportType === 'Curling') count = 4;
            else if (sportType === 'Baseball') count = 9;

            const displayCount = Math.min(count, 7);
            for (let i = 0; i < displayCount; i++) {
                base.push({
                    id: i + 1,
                    x: 20 + (i * 10),
                    y: 70 - (Math.abs(30 - (i * 10))),
                    team: 'home' as const,
                    number: String(i + 1)
                });
            }
            base.push({ id: 101, x: 50, y: 20, team: 'away' as const, number: '1' });
            return base;
        };
        setTokens(getInitialTokens());
    }, [sportType]);
    const [selectedTool, setSelectedTool] = useState<'move' | 'draw' | 'text'>('move');
    const [selectedTokenId, setSelectedTokenId] = useState<number | null>(null);

    const containerRef = useRef<HTMLDivElement>(null);

    // Helpers
    const handleAddToken = (team: 'home' | 'away') => {
        const newId = Math.max(...tokens.map(t => t.id), 0) + 1;
        setTokens([...tokens, {
            id: newId,
            x: 50,
            y: 50,
            team,
            number: team === 'home' ? 'H' : 'A'
        }]);
    };

    const handleDeleteToken = () => {
        if (selectedTokenId) {
            setTokens(tokens.filter(t => t.id !== selectedTokenId));
            setSelectedTokenId(null);
        }
    }

    return (
        <div className="flex flex-col h-full w-full select-none">
            {/* Toolbar */}
            <div className={`p-2 mb-2 rounded-xl flex items-center justify-between shadow-sm border
                ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>

                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setSelectedTool('move')}
                        className={`p-2 rounded-lg transition-colors ${selectedTool === 'move' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400'}`}>
                        <Move size={18} />
                    </button>
                    {/* Placeholder for drawing tools (future enhancement) */}
                    <button className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 opacity-50 cursor-not-allowed" title="Coming soon">
                        <ArrowRight size={18} />
                    </button>
                    <div className="w-px h-6 bg-slate-700 mx-1"></div>
                    <button
                        onClick={() => handleAddToken('home')}
                        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-blue-500" title="Add Home Player">
                        <Plus size={18} />
                    </button>
                    <button
                        onClick={() => handleAddToken('away')}
                        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-red-500" title="Add Away Player">
                        <Plus size={18} />
                    </button>
                    {selectedTokenId && (
                        <button
                            onClick={handleDeleteToken}
                            className="p-2 rounded-lg hover:bg-red-900/20 text-red-500 ml-2" title="Delete Selected">
                            <Trash2 size={18} />
                        </button>
                    )}
                </div>

                <div className="flex items-center gap-1">
                    <button className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
                        <Undo2 size={18} />
                    </button>
                    <button className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
                        <Redo2 size={18} />
                    </button>
                </div>
            </div>

            {/* Board Area */}
            <div className="flex-1 relative rounded-xl overflow-hidden border-4 border-slate-800 shadow-2xl bg-black" ref={containerRef}>
                <SportField sportType={sportType} isDarkMode={isDarkMode} themeConfig={themeConfig} />

                {/* Tokens Layer */}
                <div className="absolute inset-0 z-10">
                    {tokens.map(token => (
                        <motion.div
                            key={token.id}
                            drag
                            dragConstraints={containerRef}
                            dragMomentum={false}
                            whileHover={{ scale: 1.1 }}
                            whileDrag={{ scale: 1.2, zIndex: 50 }}
                            initial={{ top: `${token.y}%`, left: `${token.x}%` }}
                            onTap={() => setSelectedTokenId(token.id)}
                            className={`absolute w-8 h-8 rounded-full border-2 shadow-lg flex items-center justify-center font-bold text-xs cursor-move
                                ${token.team === 'home'
                                    ? 'bg-blue-600 border-white text-white'
                                    : 'bg-red-600 border-white text-white'}
                                ${selectedTokenId === token.id ? 'ring-2 ring-yellow-400' : ''}
                            `}
                            style={{
                                // Reset position to allow drag to work from initial definition
                                // In a real app we would update x/y state onDragEnd
                            }}
                        >
                            {token.number}
                        </motion.div>
                    ))}
                </div>
            </div>

            <div className="mt-3 text-center">
                <p className="text-[10px] text-slate-500 uppercase tracking-widest">Tactics Board • v1.0</p>
            </div>
        </div>
    );
};
