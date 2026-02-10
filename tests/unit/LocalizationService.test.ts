import { LocalizationService } from '../../web/src/services/LocalizationService';
import { TeamConfig } from '../../web/src/constants/teams';

const mockTeam: TeamConfig = {
    id: 'test-team',
    name: 'Test FC',
    slug: 'test-fc',
    sportType: 'SOCCER',
    colors: { primary: '#000000', secondary: '#ffffff' }
};

describe('LocalizationService', () => {
    test('should generate translations for IT and EN', () => {
        const translations = LocalizationService.generateAppTranslations(mockTeam, {});
        expect(translations.it).toBeDefined();
        expect(translations.en).toBeDefined();
        expect(translations.it['welcome.message']).toContain('Test FC');
    });

    test('should generate store metadata with team name', () => {
        const metadata = LocalizationService.generateStoreMetadata(mockTeam, {});
        expect(metadata.it.title).toBe('Test FC - App Ufficiale');
        expect(metadata.en.title).toBe('Test FC - Official App');
    });
});
