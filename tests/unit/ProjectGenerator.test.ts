import { ProjectGeneratorService } from '../../web/src/services/ProjectGeneratorService';
import { TeamConfig } from '../../web/src/constants/teams';

const mockTeam: TeamConfig = {
    id: 'test-team',
    name: 'Test FC',
    slug: 'test-fc',
    sportType: 'SOCCER',
    colors: { primary: '#000000', secondary: '#ffffff' }
};

describe('ProjectGeneratorService', () => {
    test('should generate a full project package', async () => {
        const pkg = await ProjectGeneratorService.generateFullPackage(mockTeam, {});

        expect(pkg.config.team.name).toBe('Test FC');
        expect(pkg.assets).toBeDefined();
        expect(pkg.config.localization.supportedLanguages).toContain('it');
        expect(pkg.config.localization.supportedLanguages).toContain('en');
        expect(pkg.agentInstructions.role).toBe('Senior React Native Developer');
    });
});
