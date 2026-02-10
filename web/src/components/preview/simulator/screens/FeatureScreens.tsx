import React from 'react';
import { InteractiveScreenProps } from './types';
import { SectionHeader } from './SharedComponents';
import { PremiumCard } from '../../ui/PremiumCard';
import { TacticsBoard } from '../../ui/TacticsBoard';
import { Selectable } from '../../builder/VisualInspector';
import { ShoppingBag, Plus, Clock, MapPin, ChevronRight, Newspaper, Calendar } from 'lucide-react';
import { SmartCalendar } from '../../ui/SmartCalendar';

export const NewsScreen: React.FC<InteractiveScreenProps & { getIconProps: any }> = ({
    themeConfig,
    isDarkMode,
    topPaddingValue,
    isInspectorActive,
    activeSelectionId,
    onSelect,
    getOverride,
    getIconProps
}) => {
    return (
        <div className="px-4 pb-24" style={{ paddingTop: `${topPaddingValue}px` }}>
            <SectionHeader id="news_header" label="Titolo News" title="Ultime Notizie" isFirst={true} isDarkMode={isDarkMode} isInspectorActive={isInspectorActive} activeSelectionId={activeSelectionId} onSelect={onSelect} getOverride={getOverride} />
            <div className="space-y-4 mt-4">
                {[1, 2, 3].map(i => (
                    <PremiumCard key={i} themeConfig={themeConfig} isDarkMode={isDarkMode} className="p-0 overflow-hidden" id={`news_card_${i}`} isInspectorActive={isInspectorActive} isSelected={activeSelectionId === `news_card_${i}`} onElementSelect={onSelect}>
                        <div className="flex gap-4 p-3">
                            <div className="w-24 h-24 rounded-2xl bg-slate-200 overflow-hidden shrink-0">
                                <img src={`https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=200&q=80&sig=${i}`} className="w-full h-full object-cover" alt="News" />
                            </div>
                            <div className="flex-1 flex flex-col justify-between py-1">
                                <div>
                                    <div className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">Società</div>
                                    <h4 className="text-sm font-bold leading-tight line-clamp-2">Nuovo accordo commerciale con il main sponsor</h4>
                                </div>
                                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase">
                                    <Clock size={10} /> 2 ore fa
                                </div>
                            </div>
                        </div>
                    </PremiumCard>
                ))}
            </div>
        </div>
    );
};

export const EventsScreen: React.FC<InteractiveScreenProps & { getIconProps: any }> = ({
    themeConfig,
    isDarkMode,
    topPaddingValue,
    isInspectorActive,
    activeSelectionId,
    onSelect,
    getOverride,
    getIconProps,
    mockData
}) => {
    return (
        <div className="px-4 pb-24" style={{ paddingTop: `${topPaddingValue}px` }}>
            <SectionHeader id="events_header" label="Titolo Eventi" title="Prossimi Appuntamenti" isFirst={true} isDarkMode={isDarkMode} isInspectorActive={isInspectorActive} activeSelectionId={activeSelectionId} onSelect={onSelect} getOverride={getOverride} />
            <div className="mt-4">
                <SmartCalendar themeConfig={themeConfig} isDarkMode={isDarkMode} onDateSelect={() => { }} />
            </div>
            <div className="space-y-3 mt-6">
                {(mockData?.events || []).map((event: any) => (
                    <PremiumCard key={event.id} themeConfig={themeConfig} isDarkMode={isDarkMode} className="p-4" id={`event_${event.id}`} isInspectorActive={isInspectorActive} isSelected={activeSelectionId === `event_${event.id}`} onElementSelect={onSelect}>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-500/10 text-orange-600 flex flex-col items-center justify-center font-bold">
                                <span className="text-[10px] uppercase font-black">{event.date.split(' ')[0]}</span>
                                <span className="text-lg leading-none">{event.date.split(' ')[1]}</span>
                            </div>
                            <div className="flex-1">
                                <div className="font-bold text-sm tracking-tight">{event.title}</div>
                                <div className="flex items-center gap-3 mt-1 text-[10px] font-bold text-slate-500 uppercase tracking-tight">
                                    <div className="flex items-center gap-1"><Clock size={10} /> {event.time}</div>
                                    <div className="flex items-center gap-1"><MapPin size={10} /> {event.location}</div>
                                </div>
                            </div>
                            <ChevronRight size={14} className="text-slate-300" />
                        </div>
                    </PremiumCard>
                ))}
            </div>
        </div>
    );
};

export const TacticsScreen: React.FC<InteractiveScreenProps> = ({
    themeConfig,
    isDarkMode,
    topPaddingValue,
    currentTeam
}) => {
    return (
        <div className="px-4 flex flex-col h-full overflow-hidden" style={{ paddingTop: `${topPaddingValue}px`, paddingBottom: '90px' }}>
            <SectionHeader id="tactics_header" label="Titolo Tattica" title="Lavagna Tattica" isFirst={true} isDarkMode={isDarkMode} isInspectorActive={false} onSelect={() => { }} getOverride={() => ({})} />
            <div className="flex-1 min-h-0 py-2">
                <TacticsBoard sportType={currentTeam.sportType} themeConfig={themeConfig} isDarkMode={isDarkMode} />
            </div>
        </div>
    );
};

export const ShopScreen: React.FC<InteractiveScreenProps> = ({
    themeConfig,
    isDarkMode,
    topPaddingValue,
    isInspectorActive,
    activeSelectionId,
    onSelect,
    getOverride,
    mockData,
    setMockData
}) => {
    const shopProducts = [
        { id: 1, name: 'Kit Gara Home 24/25', price: '€89.90', image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=400&q=80' },
        { id: 2, name: 'Sciarpa Ufficiale', price: '€19.90', image: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=400&q=80' },
        { id: 3, name: 'Cappellino Team', price: '€24.90', image: 'https://images.unsplash.com/photo-1534215754734-18e55d13e346?auto=format&fit=crop&w=400&q=80' },
        { id: 4, name: 'Zaino Tecnico', price: '€49.90', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=400&q=80' }
    ];

    const handleAddToCart = (product: any) => {
        if (isInspectorActive) return;
        setMockData?.setCart((prev: any[]) => [...prev, product]);
    };

    return (
        <div className="px-4 pb-24" style={{ paddingTop: `${topPaddingValue}px` }}>
            <SectionHeader id="shop_header" label="Titolo Shop" title="Official Store" isFirst={true} isDarkMode={isDarkMode} isInspectorActive={isInspectorActive} activeSelectionId={activeSelectionId} onSelect={onSelect} getOverride={getOverride} />
            <div className="grid grid-cols-2 gap-4 mt-4">
                {shopProducts.map((product, i) => (
                    <PremiumCard key={product.id} themeConfig={themeConfig} isDarkMode={isDarkMode} className="p-0 overflow-hidden group" id={`shop_item_${i}`} isInspectorActive={isInspectorActive} isSelected={activeSelectionId === `shop_item_${i}`} onElementSelect={onSelect}>
                        <div className="aspect-square bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            <button
                                onClick={() => handleAddToCart(product)}
                                className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white dark:bg-slate-900 shadow-lg flex items-center justify-center text-slate-600 dark:text-slate-300 hover:scale-110 active:scale-95 transition-all"
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                        <div className="p-3">
                            <div className="text-[10px] font-black tracking-tight truncate">{product.name}</div>
                            <div className="text-xs font-black text-indigo-500 mt-0.5">{product.price}</div>
                        </div>
                    </PremiumCard>
                ))}
            </div>
        </div>
    );
};
