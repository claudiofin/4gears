import { AppTier, UserPersona } from '@/types/builder';

export type FeatureRequirement = {
    minTier: AppTier;
    roles?: UserPersona[];
};

export const FEATURE_LIMITS: Record<string, FeatureRequirement> = {
    'video_analysis': { minTier: 'PREMIUM', roles: ['PLAYER', 'COACH', 'ADMIN'] },
    'advanced_tactics': { minTier: 'ELITE', roles: ['COACH', 'ADMIN'] },
    'live_chat': { minTier: 'PREMIUM' },
    'medical_upload': { minTier: 'FREE', roles: ['PLAYER', 'ADMIN'] },
    'fan_voting': { minTier: 'PREMIUM', roles: ['FAN', 'ADMIN'] },
    'sponsor_scrolling': { minTier: 'ELITE', roles: ['ADMIN'] },
};

export function isFeatureLocked(featureId: string, currentTier: AppTier, currentRole: UserPersona): boolean {
    const requirement = FEATURE_LIMITS[featureId];
    if (!requirement) return false;

    // Tier check
    const tierPriority: Record<AppTier, number> = {
        'FREE': 0,
        'PREMIUM': 1,
        'ELITE': 2
    };

    if (tierPriority[currentTier] < tierPriority[requirement.minTier]) {
        return true;
    }

    // Role check (if specified)
    if (requirement.roles && !requirement.roles.includes(currentRole)) {
        // Technically not "locked by tier" but "not available for role"
        // For the sake of the simulator, we might treat it similarly
        return true;
    }

    return false;
}
