import { SportType } from "@/constants/sports";

export type AppTier = 'FREE' | 'PREMIUM' | 'ELITE';
export type UserPersona = 'ADMIN' | 'COACH' | 'PLAYER' | 'FAN';
export type ViewMode = 'USER' | 'ADMIN';
export type NotchStyle = 'NONE' | 'STANDARD' | 'FLOATING';
export type DeviceType = 'IPHONE' | 'ANDROID';

export interface FeatureFlag {
    id: string;
    label: string;
    enabled: boolean;
    minTier: string;
    availableTo: UserPersona[]; // New
}

export interface FeatureFlags {
    news: FeatureFlag;
    tactics: FeatureFlag;
    video: FeatureFlag;
    shop: FeatureFlag;
    events: FeatureFlag;
    chat: FeatureFlag;
    lineup: FeatureFlag;
    sponsors: FeatureFlag;
    chants: FeatureFlag;
    staff: FeatureFlag;
}

export type BurgerMenuStyle = 'sidebar' | 'fullscreen' | 'minimal';
export type BurgerMenuAnimation = 'slide' | 'fade' | 'scale' | 'liquid';

export interface BurgerMenuConfig {
    style: BurgerMenuStyle;
    animation: BurgerMenuAnimation;
    backgroundColor?: string;
    textColor?: string;
    accentColor?: string;
    backdropBlur?: string;
}

export type ThemeConfig = {
    fontFamily: string;
    bodyFont?: string; // New: Body font separate from headings
    fontScale?: number; // New: 0.8 to 1.2
    borderRadius: string; // '0px', '4px', '8px', '16px', 'full'
    supportLightMode: boolean;
    supportDarkMode: boolean;
    buttonStyle: 'flat' | 'gradient' | 'outline';
    cardStyle: 'minimal' | 'bordered' | 'glass';
    spacingLevel: 'compact' | 'comfortable' | 'spacious';
    iconStyle: 'outline' | 'filled';
    navStyle: 'classic' | 'modern' | 'glass' | 'liquid';
    navigationType?: 'tabbar' | 'burger' | 'header_tabs';
    header?: {
        showNotifications: boolean;
        showSupport: boolean;
        enableUniversalMenu?: boolean;
        universalMenuItems?: string[]; // IDs with prefix: 'nav:home', 'feature:news', etc.
        customGradientStart?: string; // Custom gradient start color
        customGradientEnd?: string; // Custom gradient end color
        backgroundImage?: string; // URL of background image
    };
    tabBarStyling?: {
        labelColor?: string;
        labelActiveColor?: string;
        iconSpacing?: string; // e.g. '0px', '4px'
        useTeamColorForActive?: boolean;
    };
    burgerMenuStyling?: BurgerMenuConfig;
    navigation: NavItem[];
    componentOverrides: Record<string, ComponentOverride>;
};

export type ComponentOverride = {
    textColor?: string;
    backgroundColor?: string;
    fontSize?: string;
    fontWeight?: string;
    borderColor?: string;
    text?: string; // Content override
    visible?: boolean;
    icon?: string; // Icon override
    customIconUrl?: string; // New: Custom asset override
};

export type NavItem = {
    id: string; // 'home', 'events', 'tactics', 'roster', 'shop', 'video'
    label: string;
    icon: string; // Lucide icon name
    customIconUrl?: string; // New: Custom asset
    enabled: boolean;
    order: number;
};

export type EditorSelection = {
    type: 'global' | 'component' | 'content';
    id: string | null; // e.g. 'header_title', 'primary_button'
};

// Only if we want to serialize the whole state
export type BuilderState = {
    // Brand Identity
    sport: SportType;
    teamName: string;
    primaryColor: string; // Hex

    // App Configuration
    tier: AppTier;
    persona: UserPersona;
    features: Record<string, boolean>; // Simplified features

    // UI State
    activeTab: string;
};
