import React from 'react';
import { InteractiveScreenProps } from './types';
import { SectionHeader } from './SharedComponents';
import { PremiumCard } from '@/components/ui/PremiumCard';
import { PaymentConstants, ICheckoutService, PaymentIntent } from '@/services/PaymentInterfaces';
import { Plus, Clock, MapPin, ChevronRight, ShieldCheck, AlertCircle, Users, Music } from 'lucide-react';
import { SmartCalendar } from '@/components/ui/SmartCalendar';

export const NewsScreen: React.FC<InteractiveScreenProps & { getIconProps: any }> = ({
    themeConfig,
    isDarkMode,
    topPaddingValue,
    isInspectorActive,
    activeSelectionId,
    onSelect,
    getOverride
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
    mockData,
    viewMode
}) => {
    return (
        <div className="px-4 pb-24" style={{ paddingTop: `${topPaddingValue}px` }}>
            <div className="flex items-center justify-between">
                <SectionHeader id="events_header" label="Titolo Eventi" title="Prossimi Appuntamenti" isFirst={true} isDarkMode={isDarkMode} isInspectorActive={isInspectorActive} activeSelectionId={activeSelectionId} onSelect={onSelect} getOverride={getOverride} />
                {viewMode === 'ADMIN' && (
                    <button className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/20 active:scale-95 transition-all">
                        <Plus size={20} />
                    </button>
                )}
            </div>
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

export const ShopScreen: React.FC<InteractiveScreenProps> = ({
    themeConfig,
    isDarkMode,
    topPaddingValue,
    isInspectorActive,
    activeSelectionId,
    onSelect,
    getOverride
}) => {
    const [isCheckoutLoading, setIsCheckoutLoading] = React.useState(false);
    const [paymentStatus, setPaymentStatus] = React.useState<'idle' | 'success' | 'configured_missing'>('idle');

    const shopProducts = [
        { id: 'p1', name: 'Kit Gara Home 24/25', price: 89.90, image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=400&q=80' },
        { id: 'p2', name: 'Sciarpa Ufficiale', price: 19.90, image: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=400&q=80' },
        { id: 'p3', name: 'Cappellino Team', price: 24.90, image: 'https://images.unsplash.com/photo-1534215754734-18e55d13e346?auto=format&fit=crop&w=400&q=80' },
        { id: 'p4', name: 'Zaino Tecnico', price: 49.90, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=400&q=80' }
    ];

    const mockCheckoutService: ICheckoutService = {
        isConfigured: () => {
            return !PaymentConstants.STRIPE_KEY_PLACEHOLDER.includes("ADD_YOUR");
        },
        getProvider: () => 'STRIPE',
        processPayment: async (productId: string, amount: number): Promise<PaymentIntent> => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve({
                        id: `pi_${Math.random().toString(36).substr(2, 9)}`,
                        amount,
                        currency: 'EUR',
                        status: 'success',
                        provider: 'STRIPE'
                    });
                }, 1500);
            });
        }
    };

    const handleBuyNow = async (product: any) => {
        if (isInspectorActive) return;

        if (!mockCheckoutService.isConfigured()) {
            setPaymentStatus('configured_missing');
            setTimeout(() => setPaymentStatus('idle'), 4000);
            return;
        }

        setIsCheckoutLoading(true);
        try {
            const result = await mockCheckoutService.processPayment(product.id, product.price);
            if (result.status === 'success') {
                setPaymentStatus('success');
                setTimeout(() => setPaymentStatus('idle'), 3000);
            }
        } catch (error) {
            console.error("Payment failed", error);
        } finally {
            setIsCheckoutLoading(false);
        }
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
                                onClick={() => handleBuyNow(product)}
                                disabled={isCheckoutLoading}
                                className={`absolute bottom-3 right-3 px-3 h-8 rounded-full shadow-lg flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${isDarkMode ? 'bg-indigo-600 text-white hover:bg-indigo-500' : 'bg-slate-900 text-white hover:bg-slate-800'
                                    } active:scale-95 disabled:opacity-50`}
                            >
                                {isCheckoutLoading ? '...' : (
                                    <>
                                        <Plus size={12} /> Buy Now
                                    </>
                                )}
                            </button>
                        </div>
                        <div className="p-3">
                            <div className="text-[10px] font-black tracking-tight truncate">{product.name}</div>
                            <div className="text-xs font-black text-indigo-500 mt-0.5">€{product.price.toFixed(2)}</div>
                        </div>
                    </PremiumCard>
                ))}
            </div>

            {paymentStatus === 'configured_missing' && (
                <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-[85%] bg-amber-500 text-white p-4 rounded-2xl shadow-2xl z-50 flex items-start gap-3 animate-in fade-in slide-in-from-bottom-5">
                    <AlertCircle className="shrink-0" size={18} />
                    <div>
                        <div className="text-xs font-black uppercase tracking-widest">Handover Ready</div>
                        <div className="text-[10px] font-bold opacity-90 mt-1">
                            Questo pulsante è già collegato! Per attivarlo nell'app reale, inserisci la tua chiave Stripe in `PaymentInterfaces.ts`.
                        </div>
                    </div>
                </div>
            )}

            {paymentStatus === 'success' && (
                <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-[80%] bg-emerald-500 text-white p-4 rounded-2xl shadow-2xl z-50 flex items-center justify-center gap-3 animate-in fade-in slide-in-from-bottom-5">
                    <ShieldCheck size={20} />
                    <div className="text-xs font-black uppercase tracking-widest">Acquisto Simulato!</div>
                </div>
            )}
        </div>
    );
};

// Generic Placeholder for missing features
const PlaceholderScreen: React.FC<InteractiveScreenProps & { title: string; subtitle: string; icon: React.ReactNode }> = ({
    isDarkMode,
    topPaddingValue,
    title,
    subtitle,
    icon
}) => (
    <div className="px-6 flex flex-col items-center justify-center text-center h-[calc(812px-200px)]" style={{ paddingTop: `${topPaddingValue}px` }}>
        <div className={`w-20 h-20 rounded-[2.5rem] flex items-center justify-center mb-6 shadow-2xl transition-all duration-700 ${isDarkMode ? 'bg-indigo-500/10 text-indigo-400 ring-1 ring-indigo-500/20' : 'bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100'}`}>
            {icon}
        </div>
        <h3 className={`text-xl font-black uppercase tracking-tighter mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{title}</h3>
        <p className={`text-xs font-bold leading-relaxed max-w-[200px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{subtitle}</p>

        <div className="mt-12 w-full max-w-[240px] space-y-3">
            {[1, 2, 3].map(i => (
                <div key={i} className={`h-12 rounded-2xl w-full border border-dashed transition-opacity opacity-20 ${isDarkMode ? 'border-slate-700' : 'border-slate-300'}`} />
            ))}
        </div>
    </div>
);

export const SponsorsScreen: React.FC<InteractiveScreenProps> = (props) => (
    <PlaceholderScreen {...props} title="Sponsor & Partner" subtitle="Vetrina dedicata alle realtà che supportano il club." icon={<ShieldCheck size={32} />} />
);

export const ChantsScreen: React.FC<InteractiveScreenProps> = (props) => (
    <PlaceholderScreen {...props} title="Cori & Tifoseria" subtitle="L'anima del club: inni, cori e contenuti per i tifosi." icon={<Music size={32} />} />
);

export const RosterScreen: React.FC<InteractiveScreenProps> = (props) => (
    <PlaceholderScreen {...props} title="Rosa Atleti" subtitle="Elenco completo degli atleti iscritti e delle statistiche." icon={<Users size={32} />} />
);

