import React from 'react';
import { Selectable } from '../../builder/VisualInspector';
import { ThemeConfig, ComponentOverride } from '@/types/builder';
import { TeamConfig } from '@/constants/teams';
import { SportConfig } from '@/constants/sports';
import { ComponentMetadata } from '@/types/inspector';
import { useSimulatorStyles } from '@/hooks/useSimulatorStyles';

import { motion } from 'framer-motion';

interface SimulatorHeroProps {
    themeConfig: ThemeConfig;
    currentTeam: TeamConfig;
    sportConfig: SportConfig;
    isInspectorActive: boolean;
    activeSelectionId?: string | null;
    onSelect: (metadata: ComponentMetadata) => void;
    getOverride: (id: string) => ComponentOverride;
    isDarkMode: boolean;
}

export const SimulatorHero: React.FC<SimulatorHeroProps> = ({
    themeConfig,
    currentTeam,
    sportConfig,
    isInspectorActive,
    activeSelectionId,
    onSelect,
    getOverride,
    isDarkMode
}) => {
    const { getIconProps } = useSimulatorStyles(themeConfig, isDarkMode);
    const welcomeOverride = getOverride('welcome_text');
    const teamNameOverride = getOverride('team_name');

    const Icon = sportConfig.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative pt-12 pb-8 px-6 -mx-4 -mt-4 mb-6 rounded-b-[40px] shadow-sm overflow-hidden isolate"
        >

            {/* Dynamic Gradient Background */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    background: `linear-gradient(135deg, ${currentTeam.colors.primary}, ${currentTeam.colors.secondary})`
                }}
            />

            {/* Noise Texture */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none z-0"></div>

            {/* Content */}
            <div className="relative z-10 flex justify-between items-end">
                <div>
                    <Selectable
                        id="welcome_text"
                        type="text"
                        label="Welcome Text"
                        isInspectorActive={isInspectorActive}
                        isSelected={activeSelectionId === 'welcome_text'}
                        onSelect={onSelect}
                        overrides={welcomeOverride}
                        traits={['content', 'typography', 'interaction']}
                    >
                        {(welcomeOverride?.visible !== false || isInspectorActive) && (
                            <motion.h2
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                                className={`text-xs font-bold uppercase tracking-widest mb-1 ${welcomeOverride?.fontSize || ''} ${welcomeOverride?.visible === false ? 'opacity-30 grayscale' : 'opacity-90'}`}
                                style={{ color: welcomeOverride?.textColor || 'rgba(255,255,255,0.8)' }}
                            >
                                {welcomeOverride?.text || 'Benvenuto'}
                            </motion.h2>
                        )}
                    </Selectable>

                    <Selectable
                        id="team_name"
                        type="text"
                        label="Team Name"
                        isInspectorActive={isInspectorActive}
                        isSelected={activeSelectionId === 'team_name'}
                        onSelect={onSelect}
                        overrides={teamNameOverride}
                        traits={['content', 'typography', 'interaction']}
                    >
                        {(teamNameOverride?.visible !== false || isInspectorActive) && (
                            <motion.h1
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className={`text-4xl font-black leading-tight tracking-tight ${teamNameOverride?.fontSize || ''} ${teamNameOverride?.visible === false ? 'opacity-30 grayscale' : ''}`}
                                style={{ color: teamNameOverride?.textColor || '#ffffff' }}
                            >
                                {teamNameOverride?.text || currentTeam.name}
                            </motion.h1>
                        )}
                    </Selectable>
                </div>

                <motion.div
                    whileHover={{ scale: 1.1, rotate: 6 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 shadow-inner transform rotate-3 transition-all cursor-pointer"
                >
                    <Icon {...getIconProps(28, "text-white")} />
                </motion.div>
            </div>
        </motion.div>
    );
};
