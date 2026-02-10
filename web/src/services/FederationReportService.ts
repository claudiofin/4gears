export const FederationReportService = {
    exportMatchList: (teamName: string, players: any[]) => {
        const content = players.map(p => `${p.number} - ${p.name} (${p.role})`).join('\n');
        const blob = new Blob([`LISTA GARA: ${teamName}\n\n${content}`], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `lista_gara_${teamName.toLowerCase().replace(/\s+/g, '_')}.txt`;
        a.click();
    },

    exportMedicalCertificates: (players: any[]) => {
        const content = players.map(p => `${p.name}: SCADENZA ${new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toLocaleDateString()}`).join('\n');
        const blob = new Blob([`REPORT CERTIFICATI MEDICI\n\n${content}`], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `report_certificati.txt`;
        a.click();
    }
};
