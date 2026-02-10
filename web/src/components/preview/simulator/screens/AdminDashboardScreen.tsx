import React from 'react';
import { Users, ShoppingBag, Plus, ChevronRight, Edit2, Trash2, Shield, FileText, Calendar } from 'lucide-react';
import { InteractiveScreenProps } from './types';
import { SectionHeader } from './SharedComponents';
import { PremiumCard } from '@/components/ui/PremiumCard';
import { Selectable } from '@/components/builder/VisualInspector';

export const AdminDashboardScreen: React.FC<InteractiveScreenProps> = ({
    themeConfig,
    isDarkMode,
    currentTeam,
    topPaddingValue,
    isInspectorActive,
    activeSelectionId,
    onSelect,
    getOverride,
    getCardClass,
    mockData,
    rolePreview,
    setPreviewPage
}) => {
    const primaryColor = currentTeam.colors.primary;
    const secondaryColor = currentTeam.colors.secondary;
    const gridCols = rolePreview === 'admin' ? 'grid-cols-4' : 'grid-cols-2';

    return (
        <div className="p-6 pb-32 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500" style={{ paddingTop: `${topPaddingValue}px` }}>
            <SectionHeader
                id="admin_header"
                label="Titolo Dashboard"
                title="Statistiche Generali"
                isFirst={true}
                isDarkMode={isDarkMode}
                isInspectorActive={isInspectorActive}
                activeSelectionId={activeSelectionId}
                onSelect={onSelect}
                getOverride={getOverride}
            />

            {/* KPI Stats Grid */}
            <div className={`grid ${gridCols} gap-3`}>
                <PremiumCard
                    themeConfig={themeConfig}
                    isDarkMode={isDarkMode}
                    id="admin_kpi_fans"
                    isInspectorActive={isInspectorActive}
                    isSelected={activeSelectionId === 'admin_kpi_fans'}
                    onElementSelect={onSelect}
                    className="p-4"
                    traits={['background', 'border', 'spacing', 'content']}
                >
                    <div className="flex items-center gap-2 mb-2">
                        <div
                            className="p-1.5 rounded-lg w-fit transition-all duration-300"
                            style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}
                        >
                            <Users size={14} />
                        </div>
                        <Selectable
                            id="admin_kpi_fans_label"
                            type="text"
                            label="Etichetta KPI Fan"
                            isInspectorActive={isInspectorActive}
                            isSelected={activeSelectionId === 'admin_kpi_fans_label'}
                            onSelect={onSelect}
                            overrides={getOverride('admin_kpi_fans_label')}
                            traits={['content', 'typography']}
                        >
                            <span className={`text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} `}>
                                {getOverride('admin_kpi_fans_label')?.text || 'Fan Coin'}
                            </span>
                        </Selectable>
                    </div>
                    <div className={`text-2xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'} `}>{getOverride('admin_kpi_fans')?.text || mockData?.adminData?.stats?.fans || '45.2K'}</div>
                    <div className="text-emerald-500 text-[9px] font-black flex items-center gap-1 mt-2 tracking-wide">
                        <Plus size={10} /> +12% VS IERI
                    </div>
                </PremiumCard>

                <PremiumCard
                    themeConfig={themeConfig}
                    isDarkMode={isDarkMode}
                    id="admin_kpi_revenue"
                    isInspectorActive={isInspectorActive}
                    isSelected={activeSelectionId === 'admin_kpi_revenue'}
                    onElementSelect={onSelect}
                    className="p-4"
                    traits={['background', 'border', 'spacing', 'content']}
                >
                    <div className="flex items-center gap-2 mb-2">
                        <div
                            className="p-1.5 rounded-lg w-fit"
                            style={{ backgroundColor: `${secondaryColor}20`, color: secondaryColor }}
                        >
                            <ShoppingBag size={14} />
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} `}>Entrate</span>
                    </div>
                    <div className={`text-2xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'} `}>{getOverride('admin_kpi_revenue')?.text || mockData?.adminData?.stats?.revenue || '€8.2K'}</div>
                    <div className="text-emerald-500 text-[9px] font-black flex items-center gap-1 mt-2 tracking-wide">
                        <Plus size={10} /> +5% VS TARGET
                    </div>
                </PremiumCard>
            </div>

            {/* Admin Modules Quick Access */}
            <div className="grid grid-cols-2 gap-3">
                <button
                    onClick={() => setPreviewPage('admin_secretariat')}
                    className={`p-4 rounded-[2rem] border flex flex-col items-center gap-2 transition-all active:scale-95 ${isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}
                >
                    <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-500">
                        <FileText size={20} />
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-slate-900'}`}>Segreteria</span>
                </button>
                <button
                    onClick={() => setPreviewPage('admin_personas')}
                    className={`p-4 rounded-[2rem] border flex flex-col items-center gap-2 transition-all active:scale-95 ${isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}
                >
                    <div className="p-2 bg-amber-500/10 rounded-xl text-amber-500">
                        <Shield size={20} />
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-slate-900'}`}>Ruoli</span>
                </button>
                <button
                    onClick={() => setPreviewPage('events')}
                    className={`p-4 rounded-[2rem] border flex flex-col items-center gap-2 transition-all active:scale-95 ${isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}
                >
                    <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400">
                        <Calendar size={20} />
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-slate-900'}`}>Eventi</span>
                </button>
                <button
                    onClick={() => setPreviewPage('admin_federation')}
                    className={`p-4 rounded-[2rem] border flex flex-col items-center gap-2 transition-all active:scale-95 ${isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}
                >
                    <div className="p-2 bg-rose-500/10 rounded-xl text-rose-500">
                        <Users size={20} />
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-slate-900'}`}>Federazione</span>
                </button>
            </div>

            {/* Shop Orders List */}
            <Selectable
                id="admin_orders_list"
                type="card"
                label="Lista Ordini"
                isInspectorActive={isInspectorActive}
                isSelected={activeSelectionId === 'admin_orders_list'}
                onSelect={onSelect}
                overrides={getOverride('admin_orders_list')}
                traits={['background', 'border', 'spacing', 'interaction']}
                className={`p-4 ${getCardClass(true)} `}
            >
                <div className="flex justify-between items-center mb-4">
                    <h3 className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'} `}>Gestione Ordini</h3>
                    <button className="text-indigo-500 text-[10px] font-extrabold hover:underline flex items-center gap-1">
                        VEDI TUTTI <ChevronRight size={10} />
                    </button>
                </div>
                <div className="space-y-2">
                    {(mockData?.adminData?.orders || [1, 2, 3]).map((order: any, i: number) => (
                        <div key={order.id || i} className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${isDarkMode ? 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/60' : 'bg-slate-50 border-slate-100 hover:bg-slate-100/50'} `}>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-emerald-600 flex items-center justify-center text-white text-[10px] font-bold shadow-lg shadow-indigo-500/20">
                                    #{order.id || 1000 + i}
                                </div>
                                <div>
                                    <div className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} `}>{order.customer || `Cliente #${i}`}</div>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <div className={`w-1.5 h-1.5 rounded-full ${order.status === 'Spedito' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tight">{order.status || 'In elaborazione'}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className={`text-xs font-black ${isDarkMode ? 'text-white' : 'text-slate-900'} `}>{order.amount || `€${(45.50 * i).toFixed(2)}`}</div>
                                <div className="text-[8px] text-slate-500 font-medium">{order.time || 'Oggi, 12:45'}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </Selectable>

            {/* Sponsor Management */}
            <Selectable
                id="admin_sponsor_mgmt"
                type="card"
                label="Gestione Sponsor"
                isInspectorActive={isInspectorActive}
                isSelected={activeSelectionId === 'admin_sponsor_mgmt'}
                onSelect={onSelect}
                overrides={getOverride('admin_sponsor_mgmt')}
                traits={['background', 'border', 'spacing', 'interaction']}
                className={`p-4 ${getCardClass(true)} `}
            >
                <div className="flex justify-between items-center mb-4">
                    <h3 className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'} `}>Gestione Sponsor</h3>
                    <button
                        className="p-2 rounded-lg transition-colors hover:brightness-110"
                        style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
                    >
                        <Plus size={14} />
                    </button>
                </div>
                <div className="space-y-3">
                    {mockData?.sponsors?.slice(0, 3).map((s: any) => (
                        <div key={s.id} className="flex items-center gap-3 p-2 rounded-xl bg-slate-100/10 border border-white/5">
                            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center p-1">
                                <img src={s.image} alt={s.name} className="max-h-full max-w-full grayscale" />
                            </div>
                            <div className="flex-1">
                                <div className="text-xs font-bold">{s.name}</div>
                                <div className="text-[9px] text-blue-500 font-bold uppercase">{s.tier}</div>
                            </div>
                            <div className="flex gap-1">
                                <button className="p-1.5 rounded-md hover:bg-white/10 text-slate-400">
                                    <Edit2 size={12} />
                                </button>
                                <button className="p-1.5 rounded-md hover:bg-rose-500/10 text-rose-500">
                                    <Trash2 size={12} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </Selectable>
        </div>
    );
};
