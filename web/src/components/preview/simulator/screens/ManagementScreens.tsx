import React from 'react';
import { InteractiveScreenProps } from './types';
import { SectionHeader } from './SharedComponents';
import { PremiumCard } from '../../ui/PremiumCard';
import { AlertTriangle, User, FileCheck, Download, Shield, FileText, Clock, Calendar } from 'lucide-react';
import { Selectable } from '../../builder/VisualInspector';

export const SecretariatScreen: React.FC<InteractiveScreenProps> = ({
    themeConfig,
    isDarkMode,
    topPaddingValue,
    isInspectorActive,
    activeSelectionId,
    onSelect,
    getOverride
}) => {
    const expiredcerts = [
        { name: "Marco Bianchi", days: -5, type: "Agonistico" },
        { name: "Luca Verdi", days: 2, type: "Non Agonistico" },
        { name: "Giuseppe Neri", days: 12, type: "Agonistico" },
    ];

    return (
        <div className="p-6 pb-32 space-y-6" style={{ paddingTop: `${topPaddingValue}px` }}>
            <SectionHeader
                id="sec_header"
                label="Titolo Segreteria"
                title="Gestione Segreteria"
                isFirst={true}
                isDarkMode={isDarkMode}
                isInspectorActive={isInspectorActive}
                activeSelectionId={activeSelectionId}
                onSelect={onSelect}
                getOverride={getOverride}
            />

            <PremiumCard
                themeConfig={themeConfig}
                isDarkMode={isDarkMode}
                id="sec_expired_summary"
                isInspectorActive={isInspectorActive}
                isSelected={activeSelectionId === 'sec_expired_summary'}
                onElementSelect={onSelect}
                className="p-6 bg-rose-500/5 border-rose-500/20"
                traits={['background', 'border', 'spacing', 'content']}
            >
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-rose-500/20 rounded-xl text-rose-500">
                        <AlertTriangle size={20} />
                    </div>
                    <div>
                        <div className="text-sm font-black italic tracking-tight uppercase">Certificati Scaduti</div>
                        <div className="text-xs text-rose-500/70 font-bold uppercase tracking-widest">{expiredcerts.filter(c => c.days < 0).length} criticità rilevate</div>
                    </div>
                </div>

                <div className="space-y-2">
                    {expiredcerts.map((cert, i) => (
                        <PremiumCard
                            key={i}
                            themeConfig={themeConfig}
                            isDarkMode={isDarkMode}
                            id={`sec_cert_${i}`}
                            isInspectorActive={isInspectorActive}
                            isSelected={activeSelectionId === `sec_cert_${i}`}
                            onElementSelect={onSelect}
                            className="p-4 flex items-center justify-between"
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${cert.days < 0 ? 'bg-rose-500/10 text-rose-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                    <User size={14} />
                                </div>
                                <div>
                                    <div className="text-sm font-bold">{cert.name}</div>
                                    <div className="text-[10px] text-slate-500 uppercase font-medium">{cert.type}</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className={`text-xs font-black ${cert.days < 0 ? 'text-rose-500' : 'text-amber-500'}`}>
                                    {cert.days < 0 ? `Scaduto da ${Math.abs(cert.days)}gg` : `In scadenza tra ${cert.days}gg`}
                                </div>
                            </div>
                        </PremiumCard>
                    ))}
                </div>
            </PremiumCard>
        </div>
    );
};

export const FederationToolsScreen: React.FC<InteractiveScreenProps> = ({
    themeConfig,
    isDarkMode,
    topPaddingValue,
    isInspectorActive,
    activeSelectionId,
    onSelect,
    getOverride
}) => {
    return (
        <div className="p-6 pb-32 space-y-6" style={{ paddingTop: `${topPaddingValue}px` }}>
            <SectionHeader
                id="fed_header"
                label="Titolo Federazione"
                title="Strumenti Federazione"
                isFirst={true}
                isDarkMode={isDarkMode}
                isInspectorActive={isInspectorActive}
                activeSelectionId={activeSelectionId}
                onSelect={onSelect}
                getOverride={getOverride}
            />

            <PremiumCard
                themeConfig={themeConfig}
                isDarkMode={isDarkMode}
                id="fed_export_card"
                isInspectorActive={isInspectorActive}
                isSelected={activeSelectionId === 'fed_export_card'}
                onElementSelect={onSelect}
                className="p-6"
                traits={['background', 'border', 'spacing']}
            >
                <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-500">
                        <FileCheck size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-black italic tracking-tight uppercase">Liste Gara FIGC/FIP</h3>
                        <p className="text-xs text-slate-500 font-medium">Esporta moduli ufficiali per il match.</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <button className="flex items-center justify-center gap-2 p-3 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-all">
                        <Download size={14} /> PDF FIGC
                    </button>
                    <button className="flex items-center justify-center gap-2 p-3 bg-slate-800 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-700 transition-all">
                        <Download size={14} /> PDF FIP
                    </button>
                </div>
            </PremiumCard>

            <PremiumCard
                themeConfig={themeConfig}
                isDarkMode={isDarkMode}
                id="fed_report_card"
                isInspectorActive={isInspectorActive}
                isSelected={activeSelectionId === 'fed_report_card'}
                onElementSelect={onSelect}
                className="p-6"
                traits={['background', 'border', 'spacing']}
            >
                <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500">
                        <Shield size={24} />
                    </div>
                    <div>
                        <Selectable
                            id="fed_report_title"
                            type="text"
                            label="Titolo Report Federazione"
                            isInspectorActive={isInspectorActive}
                            isSelected={activeSelectionId === 'fed_report_title'}
                            onSelect={onSelect}
                            overrides={getOverride('fed_report_title')}
                            traits={['content', 'typography']}
                        >
                            <h3 className="text-lg font-black italic tracking-tight uppercase">
                                {getOverride('fed_report_title')?.text || 'Report Certificati'}
                            </h3>
                        </Selectable>
                        <p className="text-xs text-slate-500 font-medium">Download analisi globale società.</p>
                    </div>
                </div>

                <div className="mb-6 space-y-3 p-4 bg-slate-800/50 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-2 text-slate-400 mb-1">
                        <Clock size={12} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Periodo Report</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col gap-1">
                            <span className="text-[8px] font-bold text-slate-500 uppercase ml-1">Da</span>
                            <div className="p-2 bg-slate-900 border border-slate-700 rounded-lg text-[10px] font-bold text-white flex justify-between items-center cursor-pointer">
                                01/01/2026 <Calendar size={10} className="text-indigo-400" />
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-[8px] font-bold text-slate-500 uppercase ml-1">A</span>
                            <div className="p-2 bg-slate-900 border border-slate-700 rounded-lg text-[10px] font-bold text-white flex justify-between items-center cursor-pointer">
                                10/02/2026 <Calendar size={10} className="text-indigo-400" />
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                        {['7gg', '30gg', 'Stagione'].map((opt) => (
                            <button key={opt} className={`px-2 py-1 rounded-md text-[8px] font-black uppercase border ${opt === '30gg' ? 'bg-indigo-500 border-indigo-500 text-white' : 'border-slate-700 text-slate-500'}`}>
                                {opt}
                            </button>
                        ))}
                    </div>
                </div>

                <button className="w-full flex items-center justify-center gap-2 p-4 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-emerald-500/20 transition-all">
                    <FileText size={16} /> Scarica Report (CSV/PDF)
                </button>
            </PremiumCard>
        </div>
    );
};
