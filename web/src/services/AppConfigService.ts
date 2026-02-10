'use client';

import { supabase } from '@/lib/supabase';

/**
 * Service to map Builder JSON configuration to Mobile Engine optimized format.
 * This bridges Phase 1 (Web Builder) with Phase 3 (Mobile App).
 */
export const AppConfigService = {
    /**
     * Export project config for mobile consumption
     */
    async exportForMobile(projectId: string) {
        const { data: project, error } = await supabase
            .from('projects')
            .select('*')
            .eq('id', projectId)
            .single();

        if (error) throw error;
        if (!project) throw new Error('Project not found');

        const builderConfig = project.config as any;

        // Transform for Mobile Engine
        const mobileConfig = {
            id: project.id,
            name: project.name,
            version: '1.0.0', // This would come from app_releases in prod
            brand: {
                primaryColor: builderConfig.team?.primaryColor || '#000000',
                secondaryColor: builderConfig.team?.secondaryColor || '#ffffff',
                logoUrl: builderConfig.team?.logoUrl,
                fonts: {
                    heading: builderConfig.theme?.fontFamily || 'Inter',
                    body: builderConfig.theme?.fontFamily || 'Inter'
                }
            },
            navigation: {
                tabs: builderConfig.theme?.navigation?.filter((n: any) => n.enabled) || [],
                menu: builderConfig.theme?.burgerMenuStyling || {}
            },
            features: builderConfig.features || {},
            monetization: {
                tier: builderConfig.simulator?.appTier || 'FREE',
                sponsors: builderConfig.team?.sponsors || []
            }
        };

        return mobileConfig;
    },

    /**
     * Create a new release entry in the database
     */
    async createRelease(projectId: string, version: string, notes: string) {
        const { data, error } = await supabase
            .from('app_releases' as any)
            .insert({
                project_id: projectId,
                version,
                status: 'PROCESSING',
                notes
            } as any)
            .select()
            .single();

        if (error) throw error;
        return data;
    }
};
