import { SportType } from "@/constants/sports";

export type TeamConfig = {
    id: string;
    name: string;
    slug: string;
    sportType: SportType;
    colors: {
        primary: string;
        secondary: string;
    };
    logo?: string;
    branding?: {
        customHeroImage?: string;
        splashImage?: string;
        appIcon?: string;
        uiBackground?: string;
        watermark?: string;
        logoPosition?: 'top' | 'center' | 'bottom';
        glassIntensity?: number; // 0 to 20px
    };
    sportOverrides?: {
        roles?: string[];
        scoring?: {
            term: string;
            points: number;
            period: string;
        };
        clock?: {
            periods: number;
            durationMinutes: number;
        };
    };
    modules: {
        liveScoring: boolean;
        payments: boolean;
        sponsors: boolean;
    };
};

export const DEFAULT_TEAMS: TeamConfig[] = [
    {
        id: "1",
        name: "4Gears Calcio",
        slug: "4gears-calcio",
        sportType: "Calcio",
        colors: { primary: "#2563eb", secondary: "#0f172a" },
        modules: { liveScoring: true, payments: true, sponsors: true }
    },
    {
        id: "2",
        name: "4Gears Basket",
        slug: "4gears-basket",
        sportType: "Basket",
        colors: { primary: "#ea580c", secondary: "#1e1b4b" },
        modules: { liveScoring: true, payments: false, sponsors: true }
    },
    {
        id: "3",
        name: "4Gears Volley",
        slug: "4gears-volley",
        sportType: "Volley",
        colors: { primary: "#4f46e5", secondary: "#312e81" },
        modules: { liveScoring: false, payments: true, sponsors: true }
    },
    {
        id: "4",
        name: "4Gears Rugby",
        slug: "4gears-rugby",
        sportType: "Rugby",
        colors: { primary: "#0f172a", secondary: "#1e293b" },
        modules: { liveScoring: true, payments: true, sponsors: false }
    },
    {
        id: "5",
        name: "4Gears Baseball",
        slug: "4gears-baseball",
        sportType: "Baseball",
        colors: { primary: "#b91c1c", secondary: "#7f1d1d" },
        modules: { liveScoring: true, payments: true, sponsors: true }
    },
    {
        id: "6",
        name: "4Gears Tennis",
        slug: "4gears-tennis",
        sportType: "Tennis",
        colors: { primary: "#65a30d", secondary: "#365314" },
        modules: { liveScoring: true, payments: true, sponsors: true }
    },
    {
        id: "7",
        name: "4Gears Hockey",
        slug: "4gears-hockey",
        sportType: "Hockey Prato",
        colors: { primary: "#0d9488", secondary: "#134e4a" },
        modules: { liveScoring: true, payments: true, sponsors: true }
    },
    {
        id: "8",
        name: "4Gears Waterpolo",
        slug: "4gears-waterpolo",
        sportType: "Pallanuoto",
        colors: { primary: "#0284c7", secondary: "#0c4a6e" },
        modules: { liveScoring: true, payments: false, sponsors: true }
    },
    {
        id: "9",
        name: "4Gears Curling",
        slug: "4gears-curling",
        sportType: "Curling",
        colors: { primary: "#475569", secondary: "#0f172a" },
        modules: { liveScoring: true, payments: true, sponsors: true }
    }
];
