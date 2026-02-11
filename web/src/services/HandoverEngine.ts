import { ThemeConfig } from "@/types/builder";
import { TeamConfig } from "@/constants/teams";

/**
 * HandoverEngine
 * Responsabile dell'estrazione dello stato visivo del simulatore
 * per passarlo all'agente di sviluppo mobile.
 */
export const HandoverEngine = {
    /**
     * Estrae un'istantanea completa dell'identità visiva e dei design tokens.
     */
    generateIdentitySnapshot: (team: TeamConfig, themeConfig: ThemeConfig) => {
        console.log("📸 Estrazione Identity Snapshot per Handover...");

        return {
            club: {
                id: team.id,
                name: team.name,
                sport: team.sportType,
                colors: {
                    primary: team.colors?.primary || "#3b82f6",
                    secondary: team.colors?.secondary || "#1e293b",
                },
                logo: team.logo
            },
            designBox: {
                tokens: {
                    fontFamily: themeConfig.fontFamily,
                    borderRadius: themeConfig.borderRadius,
                    spacing: themeConfig.spacingLevel,
                    shadows: themeConfig.shadowStyle || 'soft',
                    animations: themeConfig.animationSpeed || 'normal'
                },
                navigation: {
                    type: themeConfig.navigationType || 'tabbar',
                    style: themeConfig.navStyle || 'classic',
                    items: themeConfig.navigation.filter(n => n.enabled)
                },
                header: {
                    style: themeConfig.header?.headerStyle || 'minimal',
                    unified: themeConfig.header?.headerStyle === 'unified',
                    hasUniversalMenu: themeConfig.header?.enableUniversalMenu,
                    universalMenuPlacement: themeConfig.header?.universalMenuPlacement || 'header'
                },
                overrides: themeConfig.componentOverrides || {}
            },
            metadata: {
                generatedAt: new Date().toISOString(),
                version: "1.0.0",
                platform: "4GearsHandover"
            }
        };
    },

    /**
     * Genera le istruzioni tecniche specifiche per l'agente Mobile
     * basate sulla configurazione attuale.
     */
    generateAgentTechnicalSheet: (themeConfig: ThemeConfig) => {
        const rules = [
            "Use NativeWind for styled components to match web Tailwind utility classes.",
            "Replicate the 'Glassmorphism' effect using Expo Blur View where glass cardStyle is used.",
            `Follow the ${themeConfig.spacingLevel} spacing scale strictly (Compact=4px, Comfortable=8px, Spacious=12px base).`,
            `Implement ${themeConfig.borderRadius} border radius globally.`,
            themeConfig.buttonStyle === 'gradient' ? "Use LinearGradient for all primary action buttons." : ""
        ].filter(Boolean);

        return {
            technicalRole: "Senior React Native Developer",
            targetStack: "Expo + NativeWind + Supabase",
            coreDirectives: rules
        };
    }
};
