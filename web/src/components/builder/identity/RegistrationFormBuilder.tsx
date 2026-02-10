
import React, { useState } from 'react';
import { FileText, Check, Plus, Trash2, Edit } from 'lucide-react';
import { ThemeConfig, RegistrationFormConfig } from '@/types/builder';

interface RegistrationFormBuilderProps {
    config: ThemeConfig;
    onUpdate: (config: ThemeConfig | ((prev: ThemeConfig) => ThemeConfig)) => void;
}

export const RegistrationFormBuilder: React.FC<RegistrationFormBuilderProps> = ({ config, onUpdate }) => {
    const defaultFields: { id: string; label: string; type: 'text' | 'number' | 'date' | 'select' | 'checkbox'; required: boolean; }[] = [
        { id: 'f1', label: 'Nome Completo', type: 'text', required: true },
        { id: 'f2', label: 'Email', type: 'text', required: true },
        { id: 'f3', label: 'Data di Nascita', type: 'date', required: true },
        { id: 'f4', label: 'Codice Fiscale', type: 'text', required: true }
    ];

    const formConfig = config.registrationForm || {
        enabled: true,
        fields: defaultFields,
        requiredDocuments: {
            medicalCertificate: true,
            identityDocument: true,
            photoPermissions: true,
            customDocuments: []
        },
        welcomeMessage: 'Benvenuto nel nostro club!'
    };

    const updateFormConfig = (updates: Partial<RegistrationFormConfig>) => {
        onUpdate((prev) => ({
            ...prev,
            registrationForm: {
                ...(prev.registrationForm || formConfig),
                ...updates
            }
        }));
    };

    // Document Toggles
    const toggleDocument = (docKey: keyof typeof formConfig.requiredDocuments) => {
        updateFormConfig({
            requiredDocuments: {
                ...formConfig.requiredDocuments,
                [docKey]: !formConfig.requiredDocuments[docKey]
            }
        });
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-black text-slate-200 tracking-tight">Registration Form</h2>
                    <p className="text-xs text-slate-500 mt-1">Configure member onboarding flow</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500 uppercase">Enable</span>
                    <button
                        onClick={() => updateFormConfig({ enabled: !formConfig.enabled })}
                        className={`w-12 h-6 rounded-full relative transition-colors ${formConfig.enabled ? 'bg-indigo-500' : 'bg-slate-700'}`}
                    >
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm ${formConfig.enabled ? 'left-7' : 'left-1'}`} />
                    </button>
                </div>
            </div>

            {/* Standard Fields (Read-only view mostly) */}
            <section className="space-y-4">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <FileText size={12} /> Standard Fields
                </h3>
                <div className="space-y-2">
                    {formConfig.fields.map(field => (
                        <div key={field.id} className="flex items-center justify-between p-3 bg-slate-800 rounded-lg border border-slate-700">
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-medium text-slate-300">{field.label}</span>
                                <span className="text-[10px] bg-slate-900 px-2 py-0.5 rounded text-slate-500 font-mono uppercase">{field.type}</span>
                            </div>
                            {field.required && (
                                <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-1 rounded">REQUIRED</span>
                            )}
                        </div>
                    ))}
                </div>
                <button className="w-full py-2 border border-dashed border-slate-700 text-slate-500 hover:text-indigo-400 hover:border-indigo-500/50 hover:bg-indigo-500/5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2">
                    <Plus size={14} /> Add Custom Field
                </button>
            </section>

            <div className="h-px bg-slate-800" />

            {/* Required Documents */}
            <section className="space-y-4">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Check size={12} /> Required Documents
                </h3>
                <div className="grid grid-cols-1 gap-2">
                    {[
                        { id: 'medicalCertificate', label: 'Certificato Medico (Sportivo)', required: true },
                        { id: 'identityDocument', label: 'Documento d\'Identità', required: true },
                        { id: 'photoPermissions', label: 'Liberatoria Foto/Video (GDPR)', required: true }
                    ].map((doc) => (
                        <div
                            key={doc.id}
                            onClick={() => toggleDocument(doc.id as any)}
                            className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${formConfig.requiredDocuments[doc.id as keyof typeof formConfig.requiredDocuments]
                                ? 'bg-indigo-500/10 border-indigo-500/50'
                                : 'bg-slate-800 border-slate-700 hover:border-slate-600'
                                }`}
                        >
                            <div>
                                <div className={`text-sm font-bold ${formConfig.requiredDocuments[doc.id as keyof typeof formConfig.requiredDocuments] ? 'text-indigo-300' : 'text-slate-400'}`}>
                                    {doc.label}
                                </div>
                                <div className="text-[10px] text-slate-500 mt-0.5">User must upload PDF/JPG during signup</div>
                            </div>

                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${formConfig.requiredDocuments[doc.id as keyof typeof formConfig.requiredDocuments]
                                ? 'bg-indigo-500 border-indigo-500 text-white'
                                : 'border-slate-600'
                                }`}>
                                {formConfig.requiredDocuments[doc.id as keyof typeof formConfig.requiredDocuments] && <Check size={12} />}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <div className="h-px bg-slate-800" />

            {/* Welcome Message */}
            <section className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">Welcome Message</label>
                <textarea
                    value={formConfig.welcomeMessage}
                    onChange={(e) => updateFormConfig({ welcomeMessage: e.target.value })}
                    className="w-full h-24 bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-indigo-500 resize-none placeholder-slate-600"
                    placeholder="Enter a welcome message for new members..."
                />
            </section>
        </div>
    );
};
