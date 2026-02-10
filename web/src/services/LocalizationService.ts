import { TeamConfig } from "@/constants/teams";

export interface AppTranslations {
    [key: string]: {
        [key: string]: string;
    };
}

export const LocalizationService = {
    /**
     * Genera le traduzioni per l'interfaccia dell'app basandosi sulle feature attive.
     */
    generateAppTranslations: (team: TeamConfig, features: any): AppTranslations => {
        return {
            it: {
                "nav.home": "Home",
                "nav.news": "Notizie",
                "nav.events": "Eventi",
                "nav.shop": "Shop",
                "nav.chat": "Chat",
                "nav.tactics": "Tattiche",
                "nav.staff": "Staff",
                "team.players": "Giocatori",
                "team.stats": "Statistiche",
                "shop.buy": "Acquista ora",
                "shop.cart": "Carrello",
                "common.loading": "Caricamento...",
                "common.error": "Qualcosa è andato storto",
                "welcome.message": `Benvenuto nell'app ufficiale di ${team.name}!`
            },
            en: {
                "nav.home": "Home",
                "nav.news": "News",
                "nav.events": "Events",
                "nav.shop": "Shop",
                "nav.chat": "Chat",
                "nav.tactics": "Tactics",
                "nav.staff": "Staff",
                "team.players": "Players",
                "team.stats": "Statistics",
                "shop.buy": "Buy Now",
                "shop.cart": "Cart",
                "common.loading": "Loading...",
                "common.error": "Something went wrong",
                "welcome.message": `Welcome to the official app of ${team.name}!`
            }
        };
    },

    /**
     * Genera metadati multilingua per gli store (App Store / Play Store).
     */
    generateStoreMetadata: (team: TeamConfig, features: any) => {
        return {
            it: {
                title: `${team.name} - App Ufficiale`,
                description: `Segui la tua squadra del cuore ovunque. Risultati live, news esclusive e store ufficiale del ${team.name}.`,
                keywords: ["Calcio", "Sport", team.name, "4Gears"]
            },
            en: {
                title: `${team.name} - Official App`,
                description: `Follow your favorite team everywhere. Live scores, exclusive news, and official shop of ${team.name}.`,
                keywords: ["Soccer", "Sports", team.name, "4Gears"]
            }
        };
    }
};
