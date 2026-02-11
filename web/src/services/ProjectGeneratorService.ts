import { TeamConfig } from "@/constants/teams";
import { LocalizationService } from "./LocalizationService";
import { BrandIdentityService } from "./BrandIdentityService";
import { HandoverEngine } from "./HandoverEngine";

export const ProjectGeneratorService = {
    /**
     * Simula la generazione del pacchetto di handover completo
     */
    generateFullPackage: async (team: TeamConfig, features: any) => {
        console.log(`🚀 Avvio generazione pacchetto finale per ${team.name}...`);

        // 1. Generazione Traduzioni App & Store
        const appTranslations = LocalizationService.generateAppTranslations(team, features);
        const storeMetadata = LocalizationService.generateStoreMetadata(team, features);

        // 2. Generazione Brand Assets (AI) & Handover Snapshot
        const brandingAssets = await BrandIdentityService.generateFullIdentity(team);
        const identitySnapshot = HandoverEngine.generateIdentitySnapshot(team, features.themeConfig || {});
        const agentTechnicalSheet = HandoverEngine.generateAgentTechnicalSheet(features.themeConfig || {});

        // 3. Struttura del progetto finale
        const projectPackage = {
            id: team.id,
            timestamp: new Date().toISOString(),
            config: {
                team,
                features,
                localization: {
                    defaultLanguage: 'it',
                    supportedLanguages: ['it', 'en'],
                    translations: appTranslations
                }
            },
            assets: brandingAssets,
            identitySnapshot,
            metadata: storeMetadata,
            agentInstructions: {
                ...agentTechnicalSheet,
                context: `Questo è un progetto professionale per il club ${team.name}.`,
                rules: [
                    ...agentTechnicalSheet.coreDirectives,
                    "Mantieni la coerenza con il design system NativeWind.",
                    "Usa i DataProvider per switchare tra Mock e Real data.",
                    "Usa i18n per ogni stringa visualizzata."
                ]
            }
        };

        console.log("✅ Pacchetto generato con successo!");
        return projectPackage;
    }
};
