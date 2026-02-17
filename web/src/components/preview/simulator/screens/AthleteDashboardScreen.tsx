import React from 'react';
import { InteractiveScreenProps } from './types';
import { SectionHeader } from './SharedComponents';
import { PremiumCard } from '@/components/ui/PremiumCard';
import { SmartText } from '../SmartElements';
import { Award, Target, Zap, Heart, TrendingUp, ChevronRight, MapPin, Clock, Shirt, MessageSquare, FileText, Bus, PlayCircle, Video, Calendar, Swords, Shield, Users, ArrowUpRight } from 'lucide-react';

export const AthleteDashboardScreen: React.FC<InteractiveScreenProps> = ({
    themeConfig,
    isDarkMode,
    topPaddingValue,
    isInspectorActive,
    activeSelectionId,
    onSelect,
    getOverride,
    currentScenario,
    initialTab
}) => {
    const [activeTab, setActiveTab] = React.useState<'overview' | 'training' | 'nutrition' | 'locker' | 'tactics'>(
        (initialTab as 'overview' | 'training' | 'nutrition' | 'locker' | 'tactics') || 'overview'
    );

    // Sync activeTab when initialTab prop changes
    React.useEffect(() => {
        if (initialTab) {
            setActiveTab(initialTab as 'overview' | 'training' | 'nutrition' | 'locker' | 'tactics');
        }
    }, [initialTab]);
    // MATCHDAY MODE
    if (currentScenario === 'LIVE_MATCH') {
        return (
            <div className="p-6 pb-32 space-y-6" style={{ paddingTop: `${topPaddingValue}px` }}>
                <SectionHeader
                    id="athlete_match_header"
                    label="Header Matchday"
                    title="Match Day"
                    isFirst={true}
                    isDarkMode={isDarkMode}
                    isInspectorActive={isInspectorActive}
                    activeSelectionId={activeSelectionId}
                    onSelect={onSelect}
                    getOverride={getOverride}
                />

                {/* CALL UP & LOGISTICS */}
                <PremiumCard
                    themeConfig={themeConfig}
                    isDarkMode={isDarkMode}
                    id="athlete_logistics"
                    label="Logistica Match"
                    isInspectorActive={isInspectorActive}
                    isSelected={activeSelectionId === 'athlete_logistics'}
                    onElementSelect={onSelect}
                    className="p-5 bg-gradient-to-br from-slate-900 to-slate-800 text-white"
                    traits={['background', 'border', 'spacing']}
                >
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Convocazione</div>
                            <div className="text-xl font-black italic">Titolare</div>
                        </div>
                        <div className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest border border-emerald-500/30">
                            Confirmed
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                            <Clock size={18} className="text-white opacity-60" />
                            <div>
                                <div className="text-[9px] font-bold text-slate-400 uppercase">Ritrovo</div>
                                <div className="text-sm font-bold">14:30</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                            <MapPin size={18} className="text-white opacity-60" />
                            <div>
                                <div className="text-[9px] font-bold text-slate-400 uppercase">Luogo</div>
                                <div className="text-sm font-bold">Locker Room</div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center border-2 border-indigo-400 shadow-lg shadow-indigo-500/30">
                                <Shirt size={18} />
                            </div>
                            <div>
                                <div className="text-[9px] font-bold text-slate-400 uppercase">Kit Gara</div>
                                <div className="text-sm font-bold">Home (Blue)</div>
                            </div>
                        </div>
                    </div>
                </PremiumCard>

                {/* CURRENT MATCH STATUS */}
                <SectionHeader
                    id="athlete_live_header"
                    label="Header Live Status"
                    title="Live Status"
                    isDarkMode={isDarkMode}
                    isInspectorActive={isInspectorActive}
                    activeSelectionId={activeSelectionId}
                    onSelect={onSelect}
                    getOverride={getOverride}
                />

                <PremiumCard
                    themeConfig={themeConfig}
                    isDarkMode={isDarkMode}
                    id="athlete_live_stats"
                    isInspectorActive={isInspectorActive}
                    isSelected={activeSelectionId === 'athlete_live_stats'}
                    onElementSelect={onSelect}
                    className="p-5 border-emerald-500/20 bg-emerald-500/5 relative overflow-hidden"
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full border-4 border-emerald-500 flex items-center justify-center bg-emerald-500/20 text-emerald-500 font-black text-xs">
                            7.8
                        </div>
                        <div>
                            <div className="text-lg font-black italic">Ottima Prestazione</div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase">Live Rating</div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between text-xs font-bold border-b border-slate-200 dark:border-slate-700 pb-2">
                            <span className="text-slate-500">Km Percorsi</span>
                            <span>9.2 km</span>
                        </div>
                        <div className="flex justify-between text-xs font-bold border-b border-slate-200 dark:border-slate-700 pb-2">
                            <span className="text-slate-500">Sprint</span>
                            <span>12</span>
                        </div>
                        <div className="flex justify-between text-xs font-bold pt-1">
                            <span className="text-slate-500">Passaggi Riusciti</span>
                            <span>88%</span>
                        </div>
                    </div>
                </PremiumCard>
            </div>
        )
    }

    return (
        <div className="p-6 pb-32 space-y-6" style={{ paddingTop: `${topPaddingValue}px` }}>
            <SectionHeader
                id="athlete_header"
                label="Titolo Dashboard Atleta"
                title="Il Mio Stato"
                isFirst={true}
                isDarkMode={isDarkMode}
                isInspectorActive={isInspectorActive}
                activeSelectionId={activeSelectionId}
                onSelect={onSelect}
                getOverride={getOverride}
            />

            {/* TAB SELECTOR */}
            <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-6 overflow-x-auto no-scrollbar">
                {['Overview', 'Training', 'Tactics', 'Nutrition', 'Locker'].map((tab) => {
                    const isActive = activeTab === tab.toLowerCase();
                    return (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab.toLowerCase() as any)}
                            className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${isActive ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                                }`}
                        >
                            {tab}
                        </button>
                    );
                })}
            </div>

            {activeTab === 'overview' && (
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-3">
                        <PremiumCard
                            themeConfig={themeConfig}
                            isDarkMode={isDarkMode}
                            id="athlete_form_card"
                            isInspectorActive={isInspectorActive}
                            isSelected={activeSelectionId === 'athlete_form_card'}
                            onElementSelect={onSelect}
                            className="p-4"
                            traits={['background', 'border', 'spacing']}
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <Zap size={16} className="text-amber-500" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Forma</span>
                            </div>
                            <SmartText
                                id="athlete_form_val"
                                label="Stato Forma"
                                fallback="OTTIMA"
                                type="text"
                                traits={['typography', 'content']}
                                isInspectorActive={isInspectorActive}
                                isSelected={activeSelectionId === 'athlete_form_val'}
                                onSelect={onSelect}
                                overrides={getOverride('athlete_form_val')}
                                className="text-2xl font-black italic"
                            />
                        </PremiumCard>

                        <PremiumCard
                            themeConfig={themeConfig}
                            isDarkMode={isDarkMode}
                            id="athlete_heart_card"
                            isInspectorActive={isInspectorActive}
                            isSelected={activeSelectionId === 'athlete_heart_card'}
                            onElementSelect={onSelect}
                            className="p-4"
                            traits={['background', 'border', 'spacing']}
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <Heart size={16} className="text-rose-500" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Recupero</span>
                            </div>
                            <SmartText
                                id="athlete_recovery_val"
                                label="Valore Recupero"
                                fallback="88%"
                                type="text"
                                traits={['typography', 'content']}
                                isInspectorActive={isInspectorActive}
                                isSelected={activeSelectionId === 'athlete_recovery_val'}
                                onSelect={onSelect}
                                overrides={getOverride('athlete_recovery_val')}
                                className="text-2xl font-black italic"
                            />
                        </PremiumCard>
                    </div>

                    <SectionHeader
                        id="athlete_wellness_header"
                        label="Header Wellness"
                        title="Wellness Di Giornata"
                        isDarkMode={isDarkMode}
                        isInspectorActive={isInspectorActive}
                        activeSelectionId={activeSelectionId}
                        onSelect={onSelect}
                        getOverride={getOverride}
                    />

                    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                        {[
                            { id: 'sleep', label: 'Sonno', val: '7.5h', color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
                            { id: 'stress', label: 'Stress', val: 'Basso', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                            { id: 'soreness', label: 'Dolore', val: '2/10', color: 'text-amber-500', bg: 'bg-amber-500/10' }
                        ].map((item) => (
                            <PremiumCard
                                key={item.id}
                                themeConfig={themeConfig}
                                isDarkMode={isDarkMode}
                                id={`wellness_card_${item.id}`}
                                label={`Card ${item.label}`}
                                isInspectorActive={isInspectorActive}
                                isSelected={activeSelectionId === `wellness_card_${item.id}`}
                                onElementSelect={onSelect}
                                className="min-w-[100px] p-3"
                                traits={['background', 'border', 'spacing']}
                            >
                                <div className={`w-8 h-8 rounded-lg ${item.bg} ${item.color} flex items-center justify-center mb-2 font-black text-[10px]`}>
                                    {item.id === 'sleep' ? '💤' : item.id === 'stress' ? '🧘' : '💪'}
                                </div>
                                <div className="text-[10px] font-bold text-slate-500 uppercase leading-none mb-1">{item.label}</div>
                                <SmartText
                                    id={`wellness_val_${item.id}`}
                                    label={`Valore ${item.label}`}
                                    fallback={item.val}
                                    type="text"
                                    traits={['typography', 'content']}
                                    isInspectorActive={isInspectorActive}
                                    isSelected={activeSelectionId === `wellness_val_${item.id}`}
                                    onSelect={onSelect}
                                    overrides={getOverride(`wellness_val_${item.id}`)}
                                    className="text-sm font-black italic"
                                />
                            </PremiumCard>
                        ))}
                    </div>

                    <SectionHeader
                        id="athlete_stats_header"
                        label="Header Statistiche"
                        title="Performance"
                        isDarkMode={isDarkMode}
                        isInspectorActive={isInspectorActive}
                        activeSelectionId={activeSelectionId}
                        onSelect={onSelect}
                        getOverride={getOverride}
                    />

                    <PremiumCard
                        themeConfig={themeConfig}
                        isDarkMode={isDarkMode}
                        id="athlete_stats_card"
                        isInspectorActive={isInspectorActive}
                        isSelected={activeSelectionId === 'athlete_stats_card'}
                        onElementSelect={onSelect}
                        className="p-5"
                        traits={['background', 'border', 'spacing']}
                    >
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                                <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">Gol</div>
                                <SmartText
                                    id="athlete_stat_gol"
                                    label="Stat Gol"
                                    fallback="12"
                                    type="text"
                                    traits={['typography', 'content']}
                                    isInspectorActive={isInspectorActive}
                                    isSelected={activeSelectionId === 'athlete_stat_gol'}
                                    onSelect={onSelect}
                                    overrides={getOverride('athlete_stat_gol')}
                                    className="text-xl font-black"
                                />
                            </div>
                            <div>
                                <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">Assist</div>
                                <SmartText
                                    id="athlete_stat_assist"
                                    label="Stat Assist"
                                    fallback="8"
                                    type="text"
                                    traits={['typography', 'content']}
                                    isInspectorActive={isInspectorActive}
                                    isSelected={activeSelectionId === 'athlete_stat_assist'}
                                    onSelect={onSelect}
                                    overrides={getOverride('athlete_stat_assist')}
                                    className="text-xl font-black"
                                />
                            </div>
                            <div>
                                <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">Rating</div>
                                <SmartText
                                    id="athlete_stat_rating"
                                    label="Stat Rating"
                                    fallback="7.4"
                                    type="text"
                                    traits={['typography', 'content']}
                                    isInspectorActive={isInspectorActive}
                                    isSelected={activeSelectionId === 'athlete_stat_rating'}
                                    onSelect={onSelect}
                                    overrides={getOverride('athlete_stat_rating')}
                                    className="text-xl font-black"
                                />
                            </div>
                        </div>
                    </PremiumCard>

                    <SectionHeader
                        id="athlete_mentoring_header"
                        label="Header Mentoring"
                        title="Obiettivi Stagionali"
                        isDarkMode={isDarkMode}
                        isInspectorActive={isInspectorActive}
                        activeSelectionId={activeSelectionId}
                        onSelect={onSelect}
                        getOverride={getOverride}
                    />
                    <div className="space-y-3">
                        {[
                            { id: "migliora_forza", title: "Migliora Forza", progress: 65, icon: TrendingUp },
                            { id: "precisione_tiri", title: "Precisione Tiri", progress: 40, icon: Target },
                            { id: "leadership", title: "Leadership", progress: 85, icon: Award }
                        ].map((goal, i) => (
                            <PremiumCard
                                key={goal.id}
                                themeConfig={themeConfig}
                                isDarkMode={isDarkMode}
                                id={`goal_card_${goal.id}`}
                                isInspectorActive={isInspectorActive}
                                isSelected={activeSelectionId === `goal_card_${goal.id}`}
                                onElementSelect={onSelect}
                                className="p-4"
                                onClick={() => { }}
                                traits={['background', 'border', 'spacing']}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                                        <goal.icon size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center mb-1.5">
                                            <SmartText
                                                id={`goal_title_${goal.id}`}
                                                label={`Titolo Obiettivo ${i + 1}`}
                                                fallback={goal.title}
                                                type="text"
                                                traits={['typography', 'content']}
                                                isInspectorActive={isInspectorActive}
                                                isSelected={activeSelectionId === `goal_title_${goal.id}`}
                                                onSelect={onSelect}
                                                overrides={getOverride(`goal_title_${goal.id}`)}
                                                className="text-xs font-bold"
                                            />
                                            <span className="text-[10px] font-bold text-slate-500">{goal.progress}%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${goal.progress}%` }} />
                                        </div>
                                    </div>
                                    <ChevronRight size={14} className="text-slate-300" />
                                </div>
                            </PremiumCard>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'training' && (
                <div className="space-y-6">
                    <SectionHeader
                        id="training_today_header"
                        label="Header Training"
                        title="Programma Oggi"
                        isDarkMode={isDarkMode}
                        isInspectorActive={isInspectorActive}
                        activeSelectionId={activeSelectionId}
                        onSelect={onSelect}
                        getOverride={getOverride}
                    />

                    {/* VIDEO ANALYSIS CARD (NEW) */}
                    <PremiumCard
                        themeConfig={themeConfig}
                        isDarkMode={isDarkMode}
                        id="training_video_card"
                        isInspectorActive={isInspectorActive}
                        isSelected={activeSelectionId === 'training_video_card'}
                        onElementSelect={onSelect}
                        className="p-0 overflow-hidden relative group"
                        traits={['background', 'border', 'spacing']}
                    >
                        <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-slate-900/30 transition-colors z-10" />
                        <img
                            src="https://images.unsplash.com/photo-1526232761682-d26e03ac148e?q=80&w=2629&auto=format&fit=crop"
                            alt="Video Analysis"
                            className="w-full h-32 object-cover opacity-80"
                        />
                        <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-2 border border-white/30 group-hover:scale-110 transition-transform">
                                <PlayCircle size={20} className="text-white fill-white/20" />
                            </div>
                            <span className="text-xs font-black text-white uppercase tracking-widest shadow-sm">Video Feedback Mister</span>
                        </div>
                        <div className="absolute top-2 right-2 z-20 px-2 py-0.5 rounded-md bg-indigo-500 text-white text-[9px] font-bold uppercase tracking-wider">
                            Nuovo
                        </div>
                    </PremiumCard>

                    <div className="flex justify-between items-start mb-4 px-1">
                        <div>
                            <div className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mb-1">Focus</div>
                            <div className="text-xl font-black italic text-slate-900 dark:text-white">Forza Esplosiva</div>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800">
                            <Clock size={14} className="text-slate-400" />
                            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">60 min</span>
                        </div>
                    </div>

                    <PremiumCard
                        themeConfig={themeConfig}
                        isDarkMode={isDarkMode}
                        id="training_plan_card"
                        isInspectorActive={isInspectorActive}
                        isSelected={activeSelectionId === 'training_plan_card'}
                        onElementSelect={onSelect}
                        className="p-4"
                        traits={['background', 'border', 'spacing']}
                    >
                        <div className="space-y-3">
                            {[
                                { name: 'Squat Jump', sets: '4x6', load: 'BW' },
                                { name: 'Box Jump', sets: '4x5', load: '60cm' },
                                { name: 'Power Clean', sets: '3x5', load: '40kg' },
                                { name: 'Sled Push', sets: '3x20m', load: '80kg' }
                            ].map((ex, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 flex items-center justify-center font-black text-xs text-slate-400">
                                            {i + 1}
                                        </div>
                                        <div>
                                            <div className="font-bold text-sm">{ex.name}</div>
                                            <div className="text-[10px] font-bold text-slate-400 uppercase">Video Tutorial</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-black text-sm">{ex.sets}</div>
                                        <div className="text-[10px] font-bold text-slate-400 uppercase">{ex.load}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </PremiumCard>
                </div>
            )}

            {activeTab === 'nutrition' && (
                <div className="space-y-6">
                    <SectionHeader
                        id="nutrition_today_header"
                        label="Header Nutrition"
                        title="Piano Alimentare"
                        isDarkMode={isDarkMode}
                        isInspectorActive={isInspectorActive}
                        activeSelectionId={activeSelectionId}
                        onSelect={onSelect}
                        getOverride={getOverride}
                    />

                    {/* MACROS CHART MOCK */}
                    <PremiumCard
                        themeConfig={themeConfig}
                        isDarkMode={isDarkMode}
                        id="nutrition_macros_card"
                        isInspectorActive={isInspectorActive}
                        isSelected={activeSelectionId === 'nutrition_macros_card'}
                        onElementSelect={onSelect}
                        className="p-6 flex items-center justify-between"
                        traits={['background', 'border', 'spacing']}
                    >
                        <div className="relative w-24 h-24 flex items-center justify-center">
                            <div className="absolute inset-0 rounded-full border-4 border-slate-100 dark:border-slate-800" />
                            <div className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent border-l-transparent -rotate-45" />
                            <div className="flex flex-col items-center">
                                <span className="text-xs font-black">2400</span>
                                <span className="text-[8px] font-bold text-slate-400 uppercase">Kcal</span>
                            </div>
                        </div>
                        <div className="space-y-2 flex-1 pl-6">
                            {[
                                { label: 'Carboidrati', val: '320g', color: 'bg-amber-400' },
                                { label: 'Proteine', val: '180g', color: 'bg-emerald-500' },
                                { label: 'Grassi', val: '65g', color: 'bg-rose-500' }
                            ].map((m) => (
                                <div key={m.label} className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${m.color}`} />
                                        <span className="font-bold text-slate-500">{m.label}</span>
                                    </div>
                                    <span className="font-black">{m.val}</span>
                                </div>
                            ))}
                        </div>
                    </PremiumCard>

                    <div className="space-y-3">
                        {[
                            { time: '08:00', type: 'Colazione', meal: 'Porridge Avena e Frutta', cal: 450 },
                            { time: '13:00', type: 'Pranzo', meal: 'Riso Basmati, Pollo e Verdure', cal: 850 },
                            { time: '16:00', type: 'Snack', meal: 'Yogurt Greco e Noci', cal: 220 },
                            { time: '20:00', type: 'Cena', meal: 'Salmone e Patate Dolci', cal: 750 }
                        ].map((meal, i) => (
                            <PremiumCard
                                key={i}
                                themeConfig={themeConfig}
                                isDarkMode={isDarkMode}
                                id={`meal_card_${i}`}
                                label={`Meal ${meal.type}`}
                                isInspectorActive={isInspectorActive}
                                isSelected={activeSelectionId === `meal_card_${i}`}
                                onElementSelect={onSelect}
                                className="p-4"
                                traits={['background', 'border', 'spacing']}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="flex flex-col items-center min-w-[40px]">
                                        <span className="text-xs font-black">{meal.time}</span>
                                    </div>
                                    <div className="flex-1 border-l border-slate-100 dark:border-slate-800 pl-4">
                                        <div className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-0.5">{meal.type}</div>
                                        <div className="font-bold text-sm mb-1">{meal.meal}</div>
                                        <div className="text-xs font-medium text-slate-400">{meal.cal} kcal</div>
                                    </div>
                                </div>
                            </PremiumCard>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'locker' && (
                <div className="space-y-6">
                    <SectionHeader
                        id="locker_logistics_header"
                        label="Header Locker Logistics"
                        title="Prossima Trasferta"
                        isDarkMode={isDarkMode}
                        isInspectorActive={isInspectorActive}
                        activeSelectionId={activeSelectionId}
                        onSelect={onSelect}
                        getOverride={getOverride}
                    />

                    {/* LOGISTICS CARD */}
                    <PremiumCard
                        themeConfig={themeConfig}
                        isDarkMode={isDarkMode}
                        id="locker_logistics_card"
                        isInspectorActive={isInspectorActive}
                        isSelected={activeSelectionId === 'locker_logistics_card'}
                        onElementSelect={onSelect}
                        className="p-5"
                        traits={['background', 'border', 'spacing']}
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                                <Bus size={24} />
                            </div>
                            <div>
                                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Partenza</div>
                                <div className="text-lg font-black italic">Sabato, 14:30</div>
                                <div className="text-xs text-slate-400">Piazzale Stadio</div>
                            </div>
                        </div>

                        <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-3">
                            <div className="flex justify-between items-center text-xs">
                                <span className="font-medium text-slate-500">Destinazione</span>
                                <span className="font-bold">Firenze (FI)</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="font-medium text-slate-500">Dress Code</span>
                                <span className="font-bold">Tuta Rappresentanza</span>
                            </div>
                        </div>
                    </PremiumCard>

                    <SectionHeader
                        id="locker_messages_header"
                        label="Header Locker Messages"
                        title="Comunicazioni"
                        isDarkMode={isDarkMode}
                        isInspectorActive={isInspectorActive}
                        activeSelectionId={activeSelectionId}
                        onSelect={onSelect}
                        getOverride={getOverride}
                    />

                    {/* MESSAGES LIST */}
                    <div className="space-y-3">
                        {[
                            { from: 'Mister Rossi', msg: 'Cambio orario allenamento domani: tutti in campo alle 15:00.', time: '10:30', urgent: true },
                            { from: 'Segreteria', msg: 'Ricordate di firmare il modulo privacy entro stasera.', time: 'Ieri', urgent: false },
                            { from: 'Staff Medico', msg: 'Visite mediche prenotate per il gruppo B.', time: 'Ieri', urgent: false }
                        ].map((msg, i) => (
                            <PremiumCard
                                key={i}
                                themeConfig={themeConfig}
                                isDarkMode={isDarkMode}
                                id={`locker_msg_${i}`}
                                label={`Message ${i}`}
                                isInspectorActive={isInspectorActive}
                                isSelected={activeSelectionId === `locker_msg_${i}`}
                                onElementSelect={onSelect}
                                className="p-4"
                                traits={['background', 'border', 'spacing']}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${msg.urgent ? 'bg-rose-500 animate-pulse' : 'bg-slate-300'}`} />
                                        <span className="text-xs font-black uppercase text-slate-700 dark:text-slate-200">{msg.from}</span>
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-400">{msg.time}</span>
                                </div>
                                <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-2">
                                    {msg.msg}
                                </p>
                            </PremiumCard>
                        ))}
                    </div>

                    <SectionHeader
                        id="locker_docs_header"
                        label="Header Locker Docs"
                        title="Documenti"
                        isDarkMode={isDarkMode}
                        isInspectorActive={isInspectorActive}
                        activeSelectionId={activeSelectionId}
                        onSelect={onSelect}
                        getOverride={getOverride}
                    />

                    {/* DOCUMENTS */}
                    <PremiumCard
                        themeConfig={themeConfig}
                        isDarkMode={isDarkMode}
                        id="locker_doc_card"
                        label="Medical Certificate"
                        isInspectorActive={isInspectorActive}
                        isSelected={activeSelectionId === 'locker_doc_card'}
                        onElementSelect={onSelect}
                        className="p-4 border-amber-500/20 bg-amber-500/5"
                        traits={['background', 'border', 'spacing']}
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                                <FileText size={20} />
                            </div>
                            <div className="flex-1">
                                <div className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-0.5">In Scadenza</div>
                                <div className="font-bold text-sm">Certificato Medico</div>
                                <div className="text-[10px] text-slate-400">Scade il 15 Maggio 2024</div>
                            </div>
                            <button className="px-3 py-1.5 rounded-lg bg-amber-500 text-white text-[10px] font-bold uppercase hover:bg-amber-600 transition-colors">
                                Rinnova
                            </button>
                        </div>
                    </PremiumCard>
                </div>
            )}
            {activeTab === 'tactics' && (
                <div className="space-y-6">
                    <SectionHeader
                        id="tactics_header"
                        label="Header Tactics"
                        title="Lavagna Tattica"
                        isDarkMode={isDarkMode}
                        isInspectorActive={isInspectorActive}
                        activeSelectionId={activeSelectionId}
                        onSelect={onSelect}
                        getOverride={getOverride}
                    />

                    {/* TACTICAL BOARD MAIN */}
                    <PremiumCard
                        themeConfig={themeConfig}
                        isDarkMode={isDarkMode}
                        id="tactics_board_card"
                        isInspectorActive={isInspectorActive}
                        isSelected={activeSelectionId === 'tactics_board_card'}
                        onElementSelect={onSelect}
                        className="p-0 overflow-hidden relative aspect-[4/3] bg-emerald-600"
                        traits={['background', 'border', 'spacing']}
                    >
                        {/* Soccer Field Pattern using CSS */}
                        <div className="absolute inset-0 opacity-30 flex">
                            {[...Array(10)].map((_, i) => (
                                <div key={i} className={`flex-1 ${i % 2 === 0 ? 'bg-emerald-800' : 'bg-transparent'}`} />
                            ))}
                        </div>
                        <div className="absolute inset-0 border-2 border-white/30 m-4 rounded-sm" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border-2 border-white/30" />
                        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-2 h-2 rounded-full bg-white/50" />

                        {/* Players */}
                        <div className="absolute top-1/3 left-1/3 w-4 h-4 rounded-full bg-red-500 border-2 border-white shadow-lg flex items-center justify-center text-[8px] font-bold text-white z-10">9</div>
                        <div className="absolute top-1/2 left-1/2 w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-lg flex items-center justify-center text-[8px] font-bold text-white z-10">10</div>
                        <div className="absolute bottom-1/3 left-2/3 w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-lg flex items-center justify-center text-[8px] font-bold text-white z-10">7</div>

                        {/* Arrows */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none">
                            <path d="M 130 110 Q 160 80 190 130" fill="none" stroke="white" strokeWidth="2" strokeDasharray="4 2" markerEnd="url(#arrowhead)" />
                            <defs>
                                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                                    <polygon points="0 0, 10 3.5, 0 7" fill="white" />
                                </marker>
                            </defs>
                        </svg>

                        <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                            <div className="text-white font-black text-sm uppercase italic">Schema Offensivo A</div>
                            <div className="text-white/70 text-[10px] font-bold">Uscita palla dal basso</div>
                        </div>
                    </PremiumCard>

                    {/* SET PIECES */}
                    <div className="grid grid-cols-2 gap-3">
                        <PremiumCard
                            themeConfig={themeConfig}
                            isDarkMode={isDarkMode}
                            id="tactics_corners"
                            isInspectorActive={isInspectorActive}
                            isSelected={activeSelectionId === 'tactics_corners'}
                            onElementSelect={onSelect}
                            className="p-4 bg-slate-50 dark:bg-slate-800/50"
                            traits={['background', 'border', 'spacing']}
                        >
                            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500 mb-2">
                                <ArrowUpRight size={18} />
                            </div>
                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Angoli</div>
                            <div className="font-black text-sm">Schema "Torre"</div>
                            <div className="mt-2 text-[10px] text-slate-400 font-medium">
                                4 saltatori in area piccola
                            </div>
                        </PremiumCard>

                        <PremiumCard
                            themeConfig={themeConfig}
                            isDarkMode={isDarkMode}
                            id="tactics_freekicks"
                            isInspectorActive={isInspectorActive}
                            isSelected={activeSelectionId === 'tactics_freekicks'}
                            onElementSelect={onSelect}
                            className="p-4 bg-slate-50 dark:bg-slate-800/50"
                            traits={['background', 'border', 'spacing']}
                        >
                            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500 mb-2">
                                <Target size={18} />
                            </div>
                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Punizioni</div>
                            <div className="font-black text-sm">Schema "Velo"</div>
                            <div className="mt-2 text-[10px] text-slate-400 font-medium">
                                2 uomini in barriera
                            </div>
                        </PremiumCard>
                    </div>

                    <SectionHeader
                        id="tactics_opponent_header"
                        label="Header Opponent"
                        title="Analisi Avversario"
                        isDarkMode={isDarkMode}
                        isInspectorActive={isInspectorActive}
                        activeSelectionId={activeSelectionId}
                        onSelect={onSelect}
                        getOverride={getOverride}
                    />

                    {/* OPPONENT CARD */}
                    <PremiumCard
                        themeConfig={themeConfig}
                        isDarkMode={isDarkMode}
                        id="tactics_opponent_card"
                        isInspectorActive={isInspectorActive}
                        isSelected={activeSelectionId === 'tactics_opponent_card'}
                        onElementSelect={onSelect}
                        className="p-5 border-rose-500/20 bg-rose-500/5"
                        traits={['background', 'border', 'spacing']}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border-2 border-rose-500 shadow-sm">
                                    <Swords size={18} className="text-rose-500" />
                                </div>
                                <div>
                                    <div className="text-[10px] font-bold text-rose-500 uppercase tracking-widest mb-1">Next Match</div>
                                    <div className="text-lg font-black italic">Virtus Milano</div>
                                </div>
                            </div>
                            <div className="px-2 py-1 rounded bg-white/50 dark:bg-black/20 text-[10px] font-bold border border-rose-500/10">
                                4-3-3
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-start gap-3 p-3 rounded-xl bg-white/60 dark:bg-black/20 border border-border/50">
                                <Shield size={16} className="text-rose-500 mt-0.5" />
                                <div>
                                    <div className="text-xs font-bold mb-1">Punti Deboli Difesa</div>
                                    <p className="text-[10px] text-slate-500 leading-relaxed">
                                        Soffrono le palle alte sul secondo palo. Il terzino sinistro spinge molto e lascia spazi.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 rounded-xl bg-white/60 dark:bg-black/20 border border-border/50">
                                <Zap size={16} className="text-amber-500 mt-0.5" />
                                <div>
                                    <div className="text-xs font-bold mb-1">Pericolo Numero 1</div>
                                    <div className="flex items-center justify-between">
                                        <p className="text-[10px] text-slate-500">Mario Rossi (Attaccante)</p>
                                        <span className="text-[9px] font-bold bg-amber-500/10 text-amber-600 px-1.5 py-0.5 rounded">12 Gol</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </PremiumCard>
                </div>
            )}
        </div>
    );
};
