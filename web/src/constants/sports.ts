import {
    Activity,
    Trophy,
    Shield,
    Snowflake
} from "lucide-react";

export interface SportConfigType {
    roles: string[];
    roleFilters: string[]; // Plural versions for filters
    scoring: {
        term: string;
        format: string;
        period: string; // "90'", "4 x 10'", etc.
    };
    events: string[];
    icon: React.ElementType; // Lucide icon component
    bgGradient: string;
    heroImage: string;
    federation?: string;
    primaryColor: string;
}

export type SportConfig = SportConfigType;

export const SPORT_CONFIG: Record<string, SportConfigType> = {
    'Calcio': {
        roles: ['Portiere', 'Difensore', 'Centrocampista', 'Attaccante'],
        roleFilters: ['Tutti', 'Portieri', 'Difensori', 'Centrocampisti', 'Attaccanti'],
        scoring: { term: 'Goal', format: '2 - 1', period: "90'" },
        events: ['Match', 'Allenamento', 'Tattica'],
        icon: Activity,
        bgGradient: 'from-emerald-900 to-green-900',
        heroImage: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80',
        federation: 'FIGC',
        primaryColor: '#10B981'
    },
    'Basket': {
        roles: ['Playmaker', 'Guardia', 'Ala Piccola', 'Ala Grande', 'Centro'],
        roleFilters: ['Tutti', 'Playmaker', 'Guardie', 'Ali', 'Centri'],
        scoring: { term: 'Punti', format: '86 - 82', period: '4 x 10\'' },
        events: ['Game', 'Shooting Session', 'Palestra'],
        icon: Trophy,
        bgGradient: 'from-orange-900 to-amber-900',
        heroImage: 'https://images.unsplash.com/photo-1546519638-68e109498ee2?auto=format&fit=crop&w=800&q=80',
        federation: 'FIP',
        primaryColor: '#F59E0B'
    },
    'Volley': {
        roles: ['Palleggiatore', 'Schiacciatore', 'Centrale', 'Opposto', 'Libero'],
        roleFilters: ['Tutti', 'Palleggiatori', 'Attaccanti', 'Centrali', 'Liberi'],
        scoring: { term: 'Set', format: '3 - 1', period: '3/5 Set' },
        events: ['Gara', 'Tecnica', 'Fisica'],
        icon: Activity,
        bgGradient: 'from-blue-900 to-indigo-900',
        heroImage: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=800&q=80',
        federation: 'FIPAV',
        primaryColor: '#3B82F6'
    },
    'Rugby': {
        roles: ['Pilone', 'Tallonatore', 'Mediano', 'Tre quarti', 'Estremo'],
        roleFilters: ['Tutti', 'Avanti', 'Mediani', 'Tre Quarti'],
        scoring: { term: 'Mete', format: '24 - 17', period: "80'" },
        events: ['Match', 'Mischia', 'Video Analisi'],
        icon: Shield,
        bgGradient: 'from-red-900 to-rose-900',
        heroImage: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80',
        federation: 'FIR',
        primaryColor: '#EF4444'
    },
    'Tennis': {
        roles: ['Singolarista', 'Doppista', 'Maestro', 'Preparatore'],
        roleFilters: ['Tutti', 'Giocatori', 'Staff Tecnico'],
        scoring: { term: 'Game', format: '6-4, 6-3', period: 'Finale' },
        events: ['Torneo', 'Lezione Privata', 'Preparazione'],
        icon: Activity,
        bgGradient: 'from-yellow-900 to-orange-900',
        heroImage: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=800&q=80',
        federation: 'FITP',
        primaryColor: '#EAB308'
    },
    'Baseball': {
        roles: ['Lanciatore', 'Ricevitore', 'Prima Base', 'Esterno', 'Interbase'],
        roleFilters: ['Tutti', 'Lanciatori', 'Interni', 'Esterni'],
        scoring: { term: 'Run', format: '5 - 3', period: '9 Inning' },
        events: ['Partita', 'Bullpen', 'Battuta'],
        icon: Trophy,
        bgGradient: 'from-red-900 to-orange-900',
        heroImage: 'https://images.unsplash.com/photo-1589801258579-18e091f43dde?auto=format&fit=crop&w=800&q=80',
        federation: 'FIBS',
        primaryColor: '#F97316'
    },
    'Hockey Prato': {
        roles: ['Portiere', 'Difensore', 'Centrocampista', 'Attaccante'],
        roleFilters: ['Tutti', 'Portiere', 'Difesa', 'Centrocampo', 'Attacco'],
        scoring: { term: 'Goal', format: '3 - 2', period: '4 x 15\'' },
        events: ['Gara', 'Tecnica', 'Atletica'],
        icon: Activity,
        bgGradient: 'from-green-900 to-teal-900',
        heroImage: 'https://images.unsplash.com/photo-1581235955620-6f0270d50730?auto=format&fit=crop&w=800&q=80',
        federation: 'FIH',
        primaryColor: '#14B8A6'
    },
    'Pallamano': {
        roles: ['Portiere', 'Ala', 'Terzino', 'Centrale', 'Pivot'],
        roleFilters: ['Tutti', 'Ali/Perni', 'Terzini', 'Portieri'],
        scoring: { term: 'Goal', format: '28 - 25', period: '2 x 30\'' },
        events: ['Match', 'Allenamento', 'Video'],
        icon: Activity,
        bgGradient: 'from-blue-900 to-cyan-900',
        heroImage: 'https://images.unsplash.com/photo-1577471488278-16eec37ffcc2?auto=format&fit=crop&w=800&q=80',
        federation: 'FIGH',
        primaryColor: '#06B6D4'
    },
    'Pallanuoto': {
        roles: ['Portiere', 'Difensore', 'Attaccante', 'Centroboa'],
        roleFilters: ['Tutti', 'Portiere', 'Difensori', 'Attaccanti', 'Centroboa'],
        scoring: { term: 'Goal', format: '10 - 8', period: '4 x 8\'' },
        events: ['Partita', 'Nuoto', 'Tattica'],
        icon: Activity,
        bgGradient: 'from-blue-800 to-sky-900',
        heroImage: 'https://images.unsplash.com/photo-1544298621-e37456d9ce15?auto=format&fit=crop&w=800&q=80',
        federation: 'FIN',
        primaryColor: '#0EA5E9'
    },
    'Hockey Ghiaccio': {
        roles: ['Portiere', 'Difensore', 'Ala', 'Centro'],
        roleFilters: ['Tutti', 'Attacco', 'Difesa', 'Portiere'],
        scoring: { term: 'Goal', format: '4 - 1', period: '3 x 20\'' },
        events: ['Gara', 'Ghiaccio', 'Off-Ice'],
        icon: Snowflake,
        bgGradient: 'from-cyan-900 to-slate-900',
        heroImage: 'https://images.unsplash.com/photo-1580748141549-71748dbe0bdc?auto=format&fit=crop&w=800&q=80',
        federation: 'FISG',
        primaryColor: '#22D3EE'
    },
    'Curling': {
        roles: ['Skip', 'Vice-Skip', 'Lead', 'Second'],
        roleFilters: ['Tutti', 'Skip', 'Lead/Second'],
        scoring: { term: 'Punti', format: '7 - 5', period: '10 End' },
        events: ['Match', 'Allenamento', 'Tattica'],
        icon: Snowflake,
        bgGradient: 'from-slate-700 to-slate-900',
        heroImage: 'https://images.unsplash.com/photo-1516008892416-0498b3687399?auto=format&fit=crop&w=800&q=80',
        federation: 'FISG',
        primaryColor: '#CBD5E1'
    }
};

export type SportType = keyof typeof SPORT_CONFIG;

export const generatePlayers = (sport: SportType, isCrowded: boolean = false) => {
    const config = SPORT_CONFIG[sport] || SPORT_CONFIG['Calcio'];
    const count = isCrowded ? 40 : 12;
    return Array.from({ length: count }).map((_, i) => {
        const stats: Record<string, any> = {
            presenze: Math.floor(Math.random() * 20) + 1,
            performance: Math.floor(Math.random() * 10)
        };

        // Add sport-specific stat
        if (config.scoring.term === 'Goal') stats.gol = Math.floor(Math.random() * 10);
        else if (config.scoring.term === 'Punti') stats.punti = Math.floor(Math.random() * 200) + 50;
        else if (config.scoring.term === 'Mete') stats.mete = Math.floor(Math.random() * 5);
        else if (config.scoring.term === 'Run') stats.run = Math.floor(Math.random() * 15);
        else if (config.scoring.term === 'Set') stats.aces = Math.floor(Math.random() * 20);

        return {
            id: i,
            name: i < 12 ? ['Alessandro Rossi', 'Marco Banchi', 'Luca Sarti', 'Davide Moro', 'Giuseppe Verdi', 'Andrea Conti', 'Matteo Longo', 'Francesco Totti', 'Luigi Riva', 'Paolo Maldini', 'Roberto Baggio', 'Filippo Inzaghi'][i] : `Giocatore ${i + 1}`,
            role: config.roles[i % config.roles.length],
            number: Math.floor(Math.random() * 99) + 1,
            stats,
            image: `https://i.pravatar.cc/150?u=${i}`
        };
    });
};

export const generateEvents = (sport: SportType, isCrowded: boolean = false) => {
    const config = SPORT_CONFIG[sport] || SPORT_CONFIG['Calcio'];
    const standardEvents = [
        { id: 1, title: 'Big Match vs Rivali', type: 'match', date: 'Dom, 12 Mag', time: '15:00', location: 'Stadio Comunale', opponent: 'Real Rival' },
        { id: 2, title: config.events[1] || 'Allenamento', type: 'training', date: 'Mar, 14 Mag', time: '18:30', location: 'Centro Sportivo' },
        { id: 3, title: 'Evento Societario', type: 'event', date: 'Ven, 17 Mag', time: '20:00', location: 'Club House' },
        { id: 4, title: config.events[2] || 'Tattica', type: 'training', date: 'Lun, 20 Mag', time: '19:00', location: 'Palestra' }
    ];

    if (!isCrowded) return standardEvents;

    const extraEvents = Array.from({ length: 15 }).map((_, i) => ({
        id: i + 5,
        title: `Extra ${config.events[i % config.events.length] || 'Event'} ${i + 1}`,
        type: i % 3 === 0 ? 'match' : i % 3 === 1 ? 'training' : 'event',
        date: `Giu, ${i + 1}`,
        time: '18:00',
        location: 'Campo B'
    }));

    return [...standardEvents, ...extraEvents];
};

export const generateStaff = () => {
    return [
        { id: 'pres', name: 'Mario Draghi', role: 'Presidente', image: 'https://i.pravatar.cc/150?u=pres' },
        { id: 'ds', name: 'Giuseppe Rossi', role: 'Direttore Sportivo', image: 'https://i.pravatar.cc/150?u=ds' },
        { id: 'coach', name: 'Antonio Conte', role: 'Allenatore', image: 'https://i.pravatar.cc/150?u=coach' },
        { id: 'vice', name: 'Matteo Salvini', role: 'Vice Allenatore', image: 'https://i.pravatar.cc/150?u=vice' },
        { id: 'doc', name: 'Luca Ward', role: 'Medico Sociale', image: 'https://i.pravatar.cc/150?u=doc' },
    ];
};

export const generateChants = () => {
    return [
        { id: 1, title: 'Sempre con te', duration: '1:45', lyric: 'Sempre con te sarò, non ti lascerò mai...' },
        { id: 2, title: 'Cuore Gialloblu', duration: '2:10', lyric: 'Il cuore batte forte per questa maglia...' },
        { id: 3, title: 'Fino alla fine', duration: '1:30', lyric: 'Lottiamo insieme fino alla fine...' },
    ];
};

export const generateSponsors = () => {
    return [
        { id: 1, name: 'Main Sponsor', tier: 'Gold', image: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=100&fit=crop&q=80', url: '#' },
        { id: 2, name: 'Technical Partner', tier: 'Silver', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=100&fit=crop&q=80', url: '#' },
        { id: 3, name: 'Local Bank', tier: 'Silver', image: 'https://images.unsplash.com/photo-1614028674026-a65e31bfd27c?w=200&h=100&fit=crop&q=80', url: '#' },
        { id: 4, name: 'Food & Drink', tier: 'Bronze', image: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=200&h=100&fit=crop&q=80', url: '#' },
    ];
};

export const generateNotifications = (sport: SportType, isCrowded: boolean = false) => {
    const config = SPORT_CONFIG[sport] || SPORT_CONFIG['Calcio'];
    const standardInfos = [
        { id: 1, title: 'Nuovo Risultato', message: `La squadra ha concluso il match con un ${config.scoring.format}.`, time: '2h fa', type: 'info' },
        { id: 2, title: 'Cambio Allenamento', message: `L'allenamento di ${config.events[1] || 'domani'} è stato posticipato alle 19:00.`, time: '5h fa', type: 'warning' },
        { id: 3, title: 'Nuovo Kit Disponibile', message: 'La nuova maglia è ora disponibile nello shop!', time: '1g fa', type: 'success' },
    ];

    if (!isCrowded) return standardInfos;

    const extraInfos = Array.from({ length: 10 }).map((_, i) => ({
        id: i + 4,
        title: `Notifica ${i + 1}`,
        message: 'Questa è una notifica extra per testare la densità dei contenuti.',
        time: `${i + 2}g fa`,
        type: i % 2 === 0 ? 'info' : 'success'
    }));

    return [...standardInfos, ...extraInfos];
};

export const generateHistory = () => {
    return {
        founded: '1945',
        story: 'Il team nasce nel dopoguerra con l\'obiettivo di unire la comunità attraverso lo sport. Da allora abbiamo collezionato successi e trofei, diventando un punto di riferimento per la città.',
        achievements: [
            { year: '1982', title: 'Prima Promozione' },
            { year: '1995', title: 'Coppa Italia Dilettanti' },
            { year: '2020', title: 'Campionato Eccellenza' }
        ]
    };
};
export const generateConversations = (sport: SportType) => {
    const config = SPORT_CONFIG[sport] || SPORT_CONFIG['Calcio'];
    return [
        {
            id: 'support',
            name: 'Supporto 4Gears',
            lastMessage: 'Ciao! Come possiamo aiutarti oggi?',
            time: '10:45',
            unread: 1,
            online: true,
            avatar: 'RC',
            type: 'admin',
            messages: [
                { id: 1, text: 'Ciao! Come possiamo aiutarti oggi?', sender: 'RC', time: '10:45' }
            ]
        },
        {
            id: 'coach',
            name: 'Mister Antonio',
            lastMessage: `Non dimenticate l'attrezzatura per il ${config.events[1] || 'prossimo match'}.`,
            time: '09:30',
            unread: 0,
            online: false,
            avatar: 'AC',
            type: 'coach',
            messages: [
                { id: 1, text: 'Buongiorno a tutti.', sender: 'AC', time: '09:00' },
                { id: 2, text: `Non dimenticate l'attrezzatura per il ${config.events[1] || 'prossimo match'}.`, sender: 'AC', time: '09:30' }
            ]
        },
        {
            id: 'mercato',
            name: 'Store Ufficiale',
            lastMessage: 'Il tuo ordine è in consegna!',
            time: 'Ieri',
            unread: 0,
            online: true,
            avatar: '🛍️',
            type: 'shop',
            messages: [
                { id: 1, text: 'Il tuo ordine #1234 è stato spedito.', sender: '🛍️', time: 'Ieri' },
                { id: 2, text: 'Il tuo ordine è in consegna!', sender: '🛍️', time: 'Ieri' }
            ]
        }
    ];
};
