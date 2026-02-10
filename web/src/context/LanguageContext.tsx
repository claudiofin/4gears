'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { it } from '../locales/it';
import { en } from '../locales/en';

type Language = 'it' | 'en';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: keyof typeof it) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguageState] = useState<Language>('it');

    useEffect(() => {
        // 1. Check local storage
        const savedLang = localStorage.getItem('4gears-lang') as Language;
        if (savedLang && (savedLang === 'it' || savedLang === 'en')) {
            setLanguageState(savedLang);
        } else {
            // 2. Browser detection
            const browserLang = navigator.language.split('-')[0];
            if (browserLang === 'en') {
                setLanguageState('en');
            } else {
                setLanguageState('it'); // default to it
            }
        }
    }, []);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('4gears-lang', lang);
    };

    const t = (key: keyof typeof it): string => {
        const translations = language === 'it' ? it : en;
        return translations[key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
