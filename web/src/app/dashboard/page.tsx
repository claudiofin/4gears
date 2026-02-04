'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Project } from '@/types/database';
import { Plus, LogOut, Loader2 } from 'lucide-react';
import ProjectCard from '@/components/dashboard/ProjectCard';
import { motion } from 'framer-motion';

export default function DashboardPage() {
    const { user, signOut } = useAuth();
    const router = useRouter();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (user) {
            loadProjects();
        }
    }, [user]);

    const loadProjects = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .eq('user_id', user?.id)
                .order('updated_at', { ascending: false });

            if (error) throw error;
            setProjects(data || []);
        } catch (err: any) {
            setError(err.message || 'Errore nel caricamento dei progetti');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateProject = async () => {
        try {
            const newProject = {
                user_id: user?.id,
                name: `Nuovo Progetto ${projects.length + 1}`,
                config: {
                    team: {
                        name: 'Nuovo Team',
                        sportType: 'CALCIO',
                        colors: { primary: '#3b82f6', secondary: '#1e40af' }
                    },
                    theme: {
                        fontFamily: 'Inter',
                        borderRadius: '8px',
                        supportLightMode: true,
                        supportDarkMode: true,
                        navigation: []
                    },
                    features: {}
                }
            };

            const { data, error } = await supabase
                .from('projects')
                .insert([newProject])
                .select()
                .single();

            if (error) throw error;

            // Navigate to builder
            router.push(`/dashboard/builder/${data.id}`);
        } catch (err: any) {
            setError(err.message || 'Errore nella creazione del progetto');
        }
    };

    const handleDeleteProject = async (projectId: string) => {
        try {
            const { error } = await supabase
                .from('projects')
                .delete()
                .eq('id', projectId);

            if (error) throw error;

            // Reload projects
            loadProjects();
        } catch (err: any) {
            setError(err.message || 'Errore nell\'eliminazione del progetto');
        }
    };

    const handleLogout = async () => {
        await signOut();
        router.push('/login');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-48 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
            </div>

            {/* Header */}
            <header className="relative border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/50">
                            <span className="text-xl font-bold text-white">4G</span>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white">4Gears Platform</h1>
                            <p className="text-sm text-slate-400">{user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        Esci
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative max-w-7xl mx-auto px-6 py-12">
                {/* Page Header */}
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-white mb-2">I Tuoi Progetti</h2>
                    <p className="text-slate-400">Crea e gestisci le configurazioni delle tue app sportive</p>
                </div>

                {/* Error Message */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400"
                    >
                        {error}
                    </motion.div>
                )}

                {/* Loading State */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                    </div>
                ) : (
                    <>
                        {/* Create New Project Button */}
                        <motion.button
                            onClick={handleCreateProject}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full mb-6 p-8 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border-2 border-dashed border-blue-500/30 rounded-3xl hover:border-blue-500/50 transition-all group"
                        >
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-16 h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                                    <Plus className="w-8 h-8 text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-1">Crea Nuovo Progetto</h3>
                                    <p className="text-sm text-slate-400">Inizia a configurare una nuova app sportiva</p>
                                </div>
                            </div>
                        </motion.button>

                        {/* Projects Grid */}
                        {projects.length === 0 ? (
                            <div className="text-center py-20">
                                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-slate-800/50 flex items-center justify-center">
                                    <Plus className="w-10 h-10 text-slate-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-slate-400 mb-2">Nessun progetto ancora</h3>
                                <p className="text-slate-500">Crea il tuo primo progetto per iniziare</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {projects.map((project, index) => (
                                    <motion.div
                                        key={project.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <ProjectCard
                                            project={project}
                                            onOpen={() => router.push(`/dashboard/builder/${project.id}`)}
                                            onDelete={() => handleDeleteProject(project.id)}
                                        />
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}
