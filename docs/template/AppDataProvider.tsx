import React, { createContext, useContext, useState, useEffect } from 'react';
import { PrismaClient } from '@prisma/client/edge'; // Esempio per edge runtime
import projectConfig from '../constants/project-config.json';

// In produzione DATABASE_URL viene letto dal .env
const prisma = new PrismaClient();

interface DataContextType {
    players: any[];
    events: any[];
    isLoading: boolean;
    dataSource: 'MOCK' | 'REAL';
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const AppDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [data, setData] = useState({ players: [], events: [] });
    const [loading, setLoading] = useState(true);
    const dataSource = (process.env.EXPO_PUBLIC_DATA_SOURCE as 'MOCK' | 'REAL') || 'MOCK';

    useEffect(() => {
        const loadData = async () => {
            try {
                if (dataSource === 'MOCK') {
                    // Usa i dati generati dal builder nel config.json
                    setData({
                        players: projectConfig.mockData.players,
                        events: projectConfig.mockData.events
                    });
                } else {
                    // Usa Prisma per leggere i dati reali da Supabase
                    const [players, events] = await Promise.all([
                        prisma.player.findMany({ where: { teamId: projectConfig.team.id } }),
                        prisma.event.findMany({ where: { teamId: projectConfig.team.id } })
                    ]);
                    setData({ players, events });
                }
            } catch (error) {
                console.error("Errore caricamente dati:", error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [dataSource]);

    return (
        <DataContext.Provider value={{ ...data, isLoading: loading, dataSource }}>
            {children}
        </DataContext.Provider>
    );
};

export const useAppData = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error('useAppData deve essere usato dentro AppDataProvider');
    return context;
};
