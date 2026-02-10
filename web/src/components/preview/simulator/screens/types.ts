import { ThemeConfig, ViewMode, PermissionKey, NavItem, DeviceType } from '@/types/builder';
import { ComponentMetadata } from '@/types/inspector';
import { TeamConfig } from '@/constants/teams';
import { SportConfig } from '@/constants/sports';

export interface BaseScreenProps {
    themeConfig: ThemeConfig;
    isDarkMode: boolean;
    currentTeam: TeamConfig;
    topPaddingValue: number;
    isInspectorActive: boolean;
    activeSelectionId?: string | null;
    onSelect: (metadata: ComponentMetadata) => void;
    getOverride: (id: string) => any;
    getCardClass: (withHover?: boolean) => string;
}

export interface InteractiveScreenProps extends BaseScreenProps {
    setPreviewPage: (page: string) => void;
    mockData: any;
    setMockData: any;
    sportConfig: SportConfig;
    rolePreview?: 'coach' | 'athlete' | 'fan' | 'admin' | null;
}
