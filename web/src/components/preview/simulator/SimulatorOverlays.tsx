import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Info, Shield, Award, CheckCheck, Plus, Send, X, Edit2, Search, User, LogOut, Settings, Bell, Layout, CreditCard, HelpCircle, FileText, ChevronRight, Calendar, Users, ShoppingBag, Video, Gauge, BookOpen, Music, MessageSquare, Menu } from 'lucide-react';
import { NavItem, ThemeConfig } from '@/types/builder';
import { TeamConfig } from '@/constants/teams';
import { useSimulatorStyles } from '@/hooks/useSimulatorStyles';
import { Selectable } from '../../builder/VisualInspector';
import { ComponentMetadata } from '@/types/inspector';

// --- Burger Menu Overlay ---

interface BurgerMenuOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    themeConfig: ThemeConfig;
    isDarkMode: boolean;
    currentTeam: TeamConfig;
    previewPage: string;
    setPreviewPage: (page: string) => void;
    isInspectorActive: boolean;
    activeSelectionId?: string | null;
    onSelect: (metadata: ComponentMetadata) => void;
}

export const BurgerMenuOverlay: React.FC<BurgerMenuOverlayProps> = ({
    isOpen, onClose, themeConfig, isDarkMode, currentTeam, previewPage, setPreviewPage,
    isInspectorActive, activeSelectionId, onSelect
}) => {
    const { getOverride } = useSimulatorStyles(themeConfig, isDarkMode);
    const styling = {
        style: 'sidebar' as const,
        animation: 'slide' as const,
        backgroundColor: currentTeam.colors.primary,
        textColor: '#ffffff',
        accentColor: currentTeam.colors.secondary,
        ...themeConfig.burgerMenuStyling
    };

    const renderIcon = (item: NavItem) => {
        const iconMap: Record<string, React.ElementType> = {
            Layout, Calendar, Users, ShoppingBag, Shield, Video, Gauge,
            Info, BookOpen, Music, Award, Bell, MessageSquare, Menu
        };
        const IconComponent = iconMap[item.icon] || Layout;
        return <IconComponent size={22} />;
    };

    const getAnimationProps = () => {
        switch (styling.animation) {
            case 'fade': return { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } };
            case 'scale': return { initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.8 } };
            case 'liquid': return { initial: { x: '-100%', borderRadius: '0 100% 100% 0' }, animate: { x: 0, borderRadius: 0 }, exit: { x: '-100%', borderRadius: '0 100% 100% 0' } };
            case 'slide':
            default: return { initial: { x: styling.style === 'sidebar' ? '-100%' : '100%' }, animate: { x: 0 }, exit: { x: styling.style === 'sidebar' ? '-100%' : '100%' } };
        }
    };

    const getContainerStyles = () => {
        const base = "absolute inset-0 z-[90] flex flex-col shadow-2xl overflow-hidden";

        switch (styling.style) {
            case 'minimal':
                return `${base} w-[80%] h-[90%] left-[10%] top-[5%] rounded-3xl border border-white/10`;
            case 'sidebar':
                return `${base} w-[280px] right-auto border-r border-white/10 backdrop-blur-2xl`;
            case 'fullscreen':
            default:
                return `${base} w-full`;
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm z-[80]"
                    />

                    <motion.div
                        {...getAnimationProps()}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className={getContainerStyles()}
                        style={{
                            background: `linear-gradient(135deg, ${currentTeam.colors.primary}, ${currentTeam.colors.secondary})`
                        }}
                    >
                        {/* Header */}
                        <div className="pt-14 pb-6 px-8 flex justify-between items-center" style={{ color: styling.textColor }}>
                            <div>
                                <div className="text-[10px] font-bold uppercase tracking-widest opacity-50">Menu</div>
                                <h2 className="text-2xl font-black">Esplora</h2>
                            </div>
                            {styling.style === 'fullscreen' && (
                                <button onClick={onClose} className="p-2 rounded-full hover:bg-black/5">
                                    <X size={24} />
                                </button>
                            )}
                        </div>

                        {/* Menu Grid */}
                        <div className="flex-1 overflow-y-auto px-6 pb-24 custom-scrollbar">
                            <div className="grid grid-cols-1 gap-3">
                                {(themeConfig.navigation || []).filter(item => item.enabled).map((item, idx) => (
                                    <Selectable
                                        key={item.id}
                                        id={`burger_nav_${item.id}`}
                                        type="text"
                                        label={`Menu ${item.label}`}
                                        isInspectorActive={isInspectorActive}
                                        isSelected={activeSelectionId === `burger_nav_${item.id}`}
                                        onSelect={onSelect}
                                        overrides={getOverride(`burger_nav_${item.id}`)}
                                    >
                                        <motion.button
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            onClick={() => {
                                                if (isInspectorActive) return;
                                                setPreviewPage(item.id);
                                                onClose();
                                            }}
                                            className={`w-full p-4 rounded-2xl flex items-center gap-4 group transition-all duration-300 active:scale-[0.98] border border-transparent`}
                                            style={{
                                                backgroundColor: previewPage === item.id ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.03)',
                                                borderColor: previewPage === item.id ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.05)',
                                                color: styling.textColor
                                            }}
                                        >
                                            <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                                                {renderIcon(item)}
                                            </div>
                                            <div className="text-left flex-1">
                                                <div className="font-bold text-base leading-tight">{getOverride(`burger_nav_${item.id}`)?.text || item.label}</div>
                                                <div className="text-[10px] uppercase font-bold tracking-wider opacity-40 mt-0.5">Visita Sezione</div>
                                            </div>
                                            <ChevronRight size={16} className={`opacity-30 group-hover:opacity-100 transition-all group-hover:translate-x-1 ${previewPage === item.id ? 'opacity-100' : ''}`} />
                                        </motion.button>
                                    </Selectable>
                                ))}
                            </div>

                            {/* Footer Actions */}
                            <div className="mt-8 space-y-3 border-t border-black/5 pt-6">
                                <button className="w-full p-4 rounded-2xl flex items-center gap-4 transition-colors hover:bg-black/5" style={{ color: styling.textColor }}>
                                    <Settings size={20} className="opacity-60" />
                                    <span className="font-bold text-sm">Impostazioni App</span>
                                </button>
                                <button className="w-full p-4 rounded-2xl flex items-center gap-4 text-rose-500 transition-colors hover:bg-rose-500/10">
                                    <LogOut size={20} />
                                    <span className="font-bold text-sm">Esci</span>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

// --- Notifications Overlay ---

interface NotificationsOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    notifications: any[];
    isDarkMode: boolean;
}

export const NotificationsOverlay: React.FC<NotificationsOverlayProps> = ({ isOpen, onClose, notifications, isDarkMode }) => (
    <AnimatePresence>
        {isOpen && (
            <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className={`absolute inset-0 z-[90] flex flex-col ${isDarkMode ? 'bg-[#0f172a]' : 'bg-slate-50'}`}
            >
                {/* Header */}
                <div className={`pt-12 pb-4 px-6 flex items-center justify-between border-b backdrop-blur-xl sticky top-0 z-20 ${isDarkMode ? 'bg-[#0f172a]/80 border-white/10' : 'bg-white/80 border-slate-200'}`}>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onClose}
                            className={`p-2 -ml-2 rounded-full transition-all active:scale-90 ${isDarkMode ? 'hover:bg-white/10 text-white' : 'hover:bg-slate-100 text-slate-900'}`}
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h2 className={`font-black text-xl tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Notifiche</h2>
                            <div className="flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{notifications.length} nuovi avvisi</span>
                            </div>
                        </div>
                    </div>
                    <button className={`text-[10px] font-black uppercase tracking-[0.15em] px-3 py-1.5 rounded-lg transition-all active:scale-95 ${isDarkMode ? 'bg-white/5 text-blue-400 hover:bg-white/10' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}>
                        Pulisci
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 custom-scrollbar">
                    {notifications.map((n, idx) => (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            key={n.id}
                            className={`p-4 rounded-3xl border flex gap-4 group transition-all relative overflow-hidden ${isDarkMode ? 'bg-slate-900/50 border-white/5 hover:border-white/10' : 'bg-white border-slate-100 shadow-sm hover:shadow-md'}`}
                        >
                            {/* Status bar */}
                            <div className={`absolute left-0 top-0 bottom-0 w-1 ${n.type === 'info' ? 'bg-blue-500' : n.type === 'warning' ? 'bg-amber-500' : 'bg-emerald-500'}`} />

                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${n.type === 'info' ? 'bg-blue-500/10 text-blue-500' : n.type === 'warning' ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                                {n.type === 'info' ? <Info size={20} /> : n.type === 'warning' ? <Shield size={20} /> : <Award size={20} />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-1">
                                    <div className={`text-sm font-black truncate pr-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{n.title}</div>
                                    <span className="text-[9px] font-bold text-slate-500 uppercase shrink-0 mt-0.5 tracking-wider">{n.time}</span>
                                </div>
                                <p className={`text-[11px] leading-relaxed line-clamp-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                    {n.message}
                                </p>
                                {idx === 0 && (
                                    <div className="mt-3 flex gap-2">
                                        <button className="text-[9px] font-black uppercase tracking-widest bg-blue-500 text-white px-3 py-1.5 rounded-lg shadow-lg shadow-blue-500/20 active:scale-95 transition-all">Dettagli</button>
                                        <button className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg active:scale-95 transition-all ${isDarkMode ? 'bg-white/5 text-slate-400' : 'bg-slate-100 text-slate-600'}`}>Ignora</button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        )}
    </AnimatePresence>
);

// --- Chat Overlay ---

interface ChatOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    conversations: any[];
    activeConversationId: string | null;
    setActiveConversationId: (id: string | null) => void;
    isDarkMode: boolean;
}

export const ChatOverlay: React.FC<ChatOverlayProps> = ({ isOpen, onClose, conversations, activeConversationId, setActiveConversationId, isDarkMode }) => {
    const activeConversation = conversations.find(c => c.id === activeConversationId);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: 0, opacity: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className={`absolute inset-0 z-[90] flex flex-col ${isDarkMode ? 'bg-[#0f172a]' : 'bg-slate-50'}`}
                >
                    {activeConversation ? (
                        // --- CONVERSATION VIEW ---
                        <>
                            {/* Chat Header */}
                            <div className={`pt-12 pb-4 px-6 flex items-center gap-4 border-b backdrop-blur-xl sticky top-0 z-20 ${isDarkMode ? 'bg-slate-900/80 border-white/10' : 'bg-white/80 border-slate-200 shadow-sm'}`}>
                                <button
                                    onClick={() => setActiveConversationId(null)}
                                    className={`p-2 -ml-2 rounded-full transition-all active:scale-90 ${isDarkMode ? 'hover:bg-white/10 text-white' : 'hover:bg-slate-100 text-slate-900'}`}
                                >
                                    <ArrowLeft size={20} />
                                </button>
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-sm shadow-xl ${activeConversation.type === 'admin' ? 'bg-emerald-500 shadow-emerald-500/20' : activeConversation.type === 'shop' ? 'bg-amber-500 shadow-amber-500/20' : 'bg-blue-600 shadow-blue-500/20'}`}>
                                        {activeConversation.avatar}
                                    </div>
                                    <div>
                                        <div className={`text-sm font-black leading-none mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{activeConversation.name}</div>
                                        <div className="flex items-center gap-1.5">
                                            <div className={`w-1.5 h-1.5 rounded-full ${activeConversation.online ? 'bg-emerald-500 animate-pulse' : 'bg-slate-500'}`} />
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${activeConversation.online ? 'text-emerald-500' : 'text-slate-500'}`}>
                                                {activeConversation.online ? 'Online' : 'Offline'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <button className={`ml-auto p-2 rounded-full ${isDarkMode ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}>
                                    <Info size={20} />
                                </button>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar flex flex-col">
                                <div className="flex justify-center uppercase tracking-[0.2em] text-[10px] font-black text-slate-500/50 mb-2">Inizio della conversazione</div>

                                {activeConversation.messages.map((m: any, idx: number) => {
                                    const isMe = m.sender === 'TU';
                                    return (
                                        <motion.div
                                            initial={{ opacity: 0, x: isMe ? 20 : -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            key={m.id}
                                            className={`flex gap-3 max-w-[85%] ${isMe ? 'ml-auto flex-row-reverse' : ''}`}
                                        >
                                            {!isMe && (
                                                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-white shrink-0 border border-white/10 shadow-lg">
                                                    {m.sender}
                                                </div>
                                            )}
                                            <div>
                                                <div className={`p-4 rounded-3xl text-sm leading-relaxed ${isMe ? 'bg-blue-600 text-white rounded-tr-none shadow-xl shadow-blue-500/20' : isDarkMode ? 'bg-slate-800 text-slate-200 rounded-tl-none border border-white/5' : 'bg-white text-slate-700 rounded-tl-none border border-slate-100 shadow-sm'}`}>
                                                    {m.text}
                                                </div>
                                                <div className={`text-[9px] font-bold mt-1.5 flex items-center gap-1 uppercase tracking-widest opacity-40 ${isMe ? 'justify-end pr-1 text-blue-400' : 'pl-1 text-slate-500'}`}>
                                                    {m.time}
                                                    {isMe && <CheckCheck size={10} />}
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>

                            {/* Input Area */}
                            <div className={`p-6 border-t ${isDarkMode ? 'bg-slate-900/50 border-white/10' : 'bg-white border-slate-200'}`}>
                                <div className={`flex gap-2 p-2 rounded-[24px] border items-center transition-all focus-within:ring-2 focus-within:ring-blue-500/20 ${isDarkMode ? 'bg-slate-950 border-white/5 focus-within:border-blue-500/50' : 'bg-slate-50 border-slate-200 focus-within:border-blue-500'}`}>
                                    <div className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-white/5 text-slate-400' : 'hover:bg-slate-200 text-slate-500'}`}>
                                        <Plus size={20} />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Scrivi un messaggio..."
                                        className="flex-1 bg-transparent border-none outline-none px-2 text-sm text-white placeholder:text-slate-600"
                                    />
                                    <button className="w-10 h-10 flex items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/20 active:scale-95 transition-all hover:brightness-110">
                                        <Send size={18} />
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        // --- INBOX VIEW ---
                        <>
                            {/* Inbox Header */}
                            <div className={`pt-12 pb-4 px-6 border-b backdrop-blur-xl sticky top-0 z-20 ${isDarkMode ? 'bg-[#0f172a]/80 border-white/10' : 'bg-white/80 border-slate-200'}`}>
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={onClose}
                                            className={`p-2 -ml-2 rounded-full transition-all active:scale-90 ${isDarkMode ? 'hover:bg-white/10 text-white' : 'hover:bg-slate-100 text-slate-900'}`}
                                        >
                                            <X size={20} />
                                        </button>
                                        <h2 className={`font-black text-2xl tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Messaggi</h2>
                                    </div>
                                    <button className={`p-2.5 rounded-full bg-blue-600 text-white shadow-lg shadow-blue-500/30 active:scale-90 transition-all`}>
                                        <Edit2 size={18} />
                                    </button>
                                </div>

                                <div className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${isDarkMode ? 'bg-slate-900/50 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                                    <Search size={16} className="text-slate-500" />
                                    <input type="text" placeholder="Cerca conversazioni..." className="bg-transparent border-none outline-none text-xs flex-1 text-slate-400 placeholder:text-slate-600" />
                                </div>
                            </div>

                            {/* Inbox Content */}
                            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2 custom-scrollbar">
                                {conversations.map((chat, idx) => (
                                    <motion.button
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        key={chat.id}
                                        onClick={() => setActiveConversationId(chat.id)}
                                        className={`w-full p-4 rounded-[28px] flex gap-4 transition-all active:scale-[0.98] ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-slate-100'}`}
                                    >
                                        <div className="relative">
                                            <div className={`w-14 h-14 rounded-[20px] flex items-center justify-center text-white font-black text-lg shadow-xl ${chat.type === 'admin' ? 'bg-emerald-500 shadow-emerald-500/20' : chat.type === 'shop' ? 'bg-amber-500 shadow-amber-500/20' : 'bg-blue-600 shadow-blue-500/20'}`}>
                                                {chat.avatar}
                                            </div>
                                            {chat.online && (
                                                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#0f172a]" />
                                            )}
                                        </div>
                                        <div className="flex-1 text-left min-w-0 flex flex-col justify-center">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className={`font-black text-base tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{chat.name}</span>
                                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{chat.time}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <p className={`text-xs truncate pr-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                                    {chat.lastMessage}
                                                </p>
                                                {chat.unread > 0 && (
                                                    <div className="bg-blue-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30">
                                                        {chat.unread}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.button>
                                ))}
                            </div>
                        </>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
};
