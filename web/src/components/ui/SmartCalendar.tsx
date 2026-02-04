import React, { useState, useMemo } from 'react';
import {
    format,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameDay,
    isBefore,
    startOfDay,
    addMonths
} from 'date-fns';
import { it } from 'date-fns/locale'; // Italian locale as per request context
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getDesignTokens } from '@/styles/design-system';
import { ThemeConfig } from '@/types/builder';
import { Selectable } from '../builder/VisualInspector';
import { ComponentMetadata } from '@/types/inspector';

interface SmartCalendarProps {
    selectedDate?: Date;
    onDateSelect: (date: Date) => void;
    eventDates?: Date[];
    themeConfig: ThemeConfig;
    isDarkMode?: boolean;
    isInspectorActive?: boolean;
    activeSelectionId?: string | null;
    onElementSelect?: (metadata: ComponentMetadata) => void;
}

export const SmartCalendar: React.FC<SmartCalendarProps> = ({
    selectedDate,
    onDateSelect,
    eventDates = [],
    themeConfig,
    isDarkMode = false,
    isInspectorActive = false,
    activeSelectionId,
    onElementSelect
}) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const tokens = getDesignTokens(isDarkMode ? 'dark' : 'light', themeConfig);

    // --- CALENDAR LOGIC ---
    const days = useMemo(() => {
        const start = startOfWeek(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1), { weekStartsOn: 1 });
        const endDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
        const end = endOfWeek(endDayOfMonth, { weekStartsOn: 1 });
        return eachDayOfInterval({ start, end });
    }, [currentMonth]);

    const changeMonth = (increment: number) => {
        setCurrentMonth(prev => addMonths(prev, increment));
    };

    // --- STYLES ---
    const isFloating = themeConfig.cardStyle === 'glass' || themeConfig.cardStyle === 'minimal';

    return (
        <Selectable
            id="smart_calendar"
            type="card"
            label="Calendario"
            isInspectorActive={isInspectorActive}
            isSelected={activeSelectionId === 'smart_calendar'}
            onSelect={onElementSelect || (() => { })}
            className={`w-full p-4 transition-all duration-300 relative overflow-hidden
                ${isFloating ? 'shadow-sm' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm'}
                ${themeConfig.borderRadius === 'full' ? 'rounded-3xl' :
                    themeConfig.borderRadius === 'none' ? 'rounded-none' :
                        themeConfig.borderRadius === 'sm' ? 'rounded-sm' :
                            themeConfig.borderRadius === 'md' ? 'rounded-md' :
                                themeConfig.borderRadius === 'lg' ? 'rounded-lg' :
                                    'rounded-xl'}
                ${themeConfig.cardStyle === 'glass' ? 'backdrop-blur-md bg-white/40 dark:bg-slate-900/40 border border-white/20' : ''}
            `}
            style={{
                fontFamily: themeConfig.fontFamily
            }}
            traits={['background', 'border', 'spacing', 'glass']}
        >
            {/* Header */}
            <div className="flex justify-between items-center mb-6 px-2">
                <Selectable
                    id="calendar_prev_month"
                    type="icon"
                    label="Mese Precedente"
                    isInspectorActive={isInspectorActive}
                    isSelected={activeSelectionId === 'calendar_prev_month'}
                    onSelect={onElementSelect || (() => { })}
                    overrides={themeConfig.componentOverrides?.['calendar_prev_month']}
                    traits={['interaction', 'icon']}
                >
                    {(themeConfig.componentOverrides?.['calendar_prev_month']?.visible !== false || isInspectorActive) && (
                        <button
                            onClick={(e) => { e.stopPropagation(); changeMonth(-1); }}
                            className={`p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${themeConfig.componentOverrides?.['calendar_prev_month']?.visible === false ? 'opacity-30 grayscale' : ''}`}
                            style={{ color: themeConfig.componentOverrides?.['calendar_prev_month']?.textColor || tokens.colors.text }}
                        >
                            <ChevronLeft size={20} />
                        </button>
                    )}
                </Selectable>

                <Selectable
                    id="calendar_month_title"
                    type="text"
                    label="Titolo Mese"
                    isInspectorActive={isInspectorActive}
                    isSelected={activeSelectionId === 'calendar_month_title'}
                    onSelect={onElementSelect || (() => { })}
                    overrides={themeConfig.componentOverrides?.['calendar_month_title']}
                    traits={['content', 'typography', 'interaction']}
                >
                    {(themeConfig.componentOverrides?.['calendar_month_title']?.visible !== false || isInspectorActive) && (
                        <h3
                            className={`text-lg font-bold capitalize ${themeConfig.componentOverrides?.['calendar_month_title']?.fontSize || ''} ${themeConfig.componentOverrides?.['calendar_month_title']?.visible === false ? 'opacity-30 grayscale' : ''}`}
                            style={{ color: themeConfig.componentOverrides?.['calendar_month_title']?.textColor || tokens.colors.text }}
                        >
                            {themeConfig.componentOverrides?.['calendar_month_title']?.text || format(currentMonth, 'MMMM yyyy', { locale: it })}
                        </h3>
                    )}
                </Selectable>

                <Selectable
                    id="calendar_next_month"
                    type="icon"
                    label="Prossimo Mese"
                    isInspectorActive={isInspectorActive}
                    isSelected={activeSelectionId === 'calendar_next_month'}
                    onSelect={onElementSelect || (() => { })}
                    overrides={themeConfig.componentOverrides?.['calendar_next_month']}
                    traits={['interaction', 'icon']}
                >
                    {(themeConfig.componentOverrides?.['calendar_next_month']?.visible !== false || isInspectorActive) && (
                        <button
                            onClick={(e) => { e.stopPropagation(); changeMonth(1); }}
                            className={`p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${themeConfig.componentOverrides?.['calendar_next_month']?.visible === false ? 'opacity-30 grayscale' : ''}`}
                            style={{ color: themeConfig.componentOverrides?.['calendar_next_month']?.textColor || tokens.colors.text }}
                        >
                            <ChevronRight size={20} />
                        </button>
                    )}
                </Selectable>
            </div>

            {/* Week Days */}
            <div className="flex mb-4">
                {['LUN', 'MAR', 'MER', 'GIO', 'VEN', 'SAB', 'DOM'].map((day) => (
                    <div key={day} className="flex-1 text-center text-[10px] font-bold tracking-wider">
                        <Selectable
                            id={`calendar_day_label_${day}`}
                            type="text"
                            label={`Etichetta Giorno ${day}`}
                            isInspectorActive={isInspectorActive}
                            isSelected={activeSelectionId === `calendar_day_label_${day}`}
                            onSelect={onElementSelect || (() => { })}
                            overrides={themeConfig.componentOverrides?.[`calendar_day_label_${day}`]}
                            traits={['content', 'typography', 'interaction']}
                        >
                            {(themeConfig.componentOverrides?.[`calendar_day_label_${day}`]?.visible !== false || isInspectorActive) && (
                                <span
                                    className={`${themeConfig.componentOverrides?.[`calendar_day_label_${day}`]?.fontSize || ''} ${themeConfig.componentOverrides?.[`calendar_day_label_${day}`]?.visible === false ? 'opacity-30 grayscale' : ''}`}
                                    style={{ color: themeConfig.componentOverrides?.[`calendar_day_label_${day}`]?.textColor || tokens.colors.textSecondary }}
                                >
                                    {themeConfig.componentOverrides?.[`calendar_day_label_${day}`]?.text || day}
                                </span>
                            )}
                        </Selectable>
                    </div>
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-7 gap-y-4">
                {days.map((day, idx) => {
                    const isSelected = selectedDate && isSameDay(day, selectedDate);
                    const isToday = isSameDay(day, new Date());
                    const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
                    const hasEvent = eventDates.some(d => isSameDay(d, day));
                    const isPast = isBefore(day, startOfDay(new Date()));

                    // Determine State Colors
                    let bgColor = 'transparent';
                    let textColor = isCurrentMonth ? tokens.colors.text : tokens.colors.textTertiary;
                    let borderColor = 'transparent';
                    let opacity = 1;

                    // Event Logic
                    if (hasEvent) {
                        bgColor = isPast ? tokens.colors.warning : tokens.colors.success;
                        textColor = '#ffffff'; // Always white for contrast on colored dots
                        if (isSelected) {
                            // If selected AND has event, we typically want to show selection ring + event fill?
                            // usage in provided snippet: "backgroundColor only for events (not selected)"
                            // Let's adapt: Selection is a Ring. Event is a Fill.
                            // If selected, we don't hide the event fill, we just add the ring.
                        }
                    }

                    // Selection Logic (Ring)
                    if (isSelected) {
                        borderColor = tokens.colors.primary;
                        textColor = hasEvent ? '#ffffff' : tokens.colors.primary;
                    } else if (isToday && !hasEvent) {
                        borderColor = tokens.colors.borderHighlight;
                    }

                    return (
                        <div key={idx} className="flex flex-col items-center justify-center relative aspect-square">
                            <button
                                onClick={() => onDateSelect(day)}
                                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 relative z-10
                                    ${hasEvent ? 'shadow-sm' : ''}
                                `}
                                style={{
                                    backgroundColor: hasEvent ? bgColor : 'transparent',
                                    border: `2px solid ${isSelected ? borderColor : (isToday && !hasEvent ? borderColor : 'transparent')}`,
                                    opacity: !isCurrentMonth ? 0.3 : 1
                                }}
                            >
                                <span className="text-sm font-medium" style={{ color: textColor }}>
                                    {format(day, 'd')}
                                </span>
                            </button>

                            {/* Dot indicator for selected state if we want to separate it? 
                                No, the snippet used a Ring. I implemented the Ring above. 
                            */}
                        </div>
                    );
                })}
            </div>

        </Selectable>
    );
};
