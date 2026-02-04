import { SportType } from "@/constants/sports";

export type AppTier = 'FREE' | 'PREMIUM' | 'ELITE';
export type UserPersona = 'ADMIN' | 'COACH' | 'PLAYER' | 'FAN';
export type ViewMode = 'USER' | 'ADMIN' | 'SPLASH' | 'LOGIN';
export type NotchStyle = 'NONE' | 'STANDARD' | 'FLOATING';
export type DeviceType = 'IPHONE' | 'ANDROID';
export type MockScenario = 'STANDARD' | 'CROWDED';

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

export interface SplashConfig {
    style: 'minimal' | 'branded' | 'artistic';
    backgroundType: 'solid' | 'gradient' | 'image';
    backgroundColor?: string;
    gradientStart?: string;
    gradientEnd?: string;
    backgroundImage?: string;
    logoSize: 'small' | 'medium' | 'large' | 'huge'; // 64, 96, 128, 160 px
    animationType: 'fade' | 'zoom' | 'slide_up' | 'bounce' | 'none';
    showLoader: boolean;
    loaderStyle: 'dots' | 'spinner' | 'lines';
    customSubtitle?: string; // Overrides team sport type
    poweredByVisible: boolean;
}

export interface LoginConfig {
    viewType: 'classic' | 'modern_card' | 'split_screen';
    heroStyle: 'none' | 'logo' | 'image' | 'illustration';
    heroImageUrl?: string;
    socialProviders: {
        google: boolean;
        apple: boolean;
        facebook: boolean;
        email: boolean;
    };
    formStyle: {
        inputRadius: '0px' | '4px' | '8px' | '12px' | '24px';
        buttonRadius: '0px' | '4px' | '8px' | '12px' | '24px';
        inputBackground: 'white' | 'gray' | 'transparent';
        shadowLevel: 'none' | 'soft' | 'hard';
    };
    texts: {
        welcomeTitle?: string; // e.g. "Bentornato!"
        welcomeSubtitle?: string;
        actionButtonText?: string; // e.g. "ACCEDI"
        forgotPasswordText?: string;
    };
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
    shadowStyle?: 'none' | 'soft' | 'crisp' | 'diffusion'; // New: Global shadow style
    animationSpeed?: 'slow' | 'normal' | 'fast' | 'instant'; // New: Global transition speed
    spacingLevel: 'compact' | 'comfortable' | 'spacious';
    iconStyle: 'outline' | 'filled';
    navStyle: 'classic' | 'modern' | 'glass' | 'liquid';
    glassIntensity?: number; // 0 to 20px
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
    splash?: SplashConfig; // New: Dedicated Splash Settings
    login?: LoginConfig; // New: Dedicated Login Settings
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
    borderRadius?: string;
    // Advanced Styles
    customGradientStart?: string;
    customGradientEnd?: string;
    backgroundImage?: string;
    backdropBlur?: string;
    opacity?: number;
    // Spacing & Layout
    padding?: string;
    margin?: string;
    width?: string;
    height?: string;
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
