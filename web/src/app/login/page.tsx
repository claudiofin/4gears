'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, Mail, Key, ArrowRight, AlertCircle } from 'lucide-react';

export default function LoginPage() {
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [inviteCode, setInviteCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { user, profile, loading: authLoading, signIn, signUp } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && user && profile) {
            if (profile.role === 'admin') {
                router.push('/admin');
            } else {
                router.push('/dashboard');
            }
        }
    }, [user, profile, authLoading, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isSignUp) {
                if (!inviteCode) {
                    setError('Il codice invito è obbligatorio');
                    setLoading(false);
                    return;
                }
                const { error } = await signUp(email, password, inviteCode);
                if (error) {
                    setError(error.message || 'Errore durante la registrazione');
                } else {
                    router.push('/dashboard');
                }
            } else {
                const { error } = await signIn(email, password);
                if (error) {
                    setError(error.message || 'Credenziali non valide');
                }
                // Redirect will be handled by useEffect
            }
        } catch (err) {
            setError('Si è verificato un errore. Riprova.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-48 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative w-full max-w-md"
            >
                {/* Logo/Brand */}
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="inline-block"
                    >
                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/50">
                            <span className="text-3xl font-bold text-white">4G</span>
                        </div>
                    </motion.div>
                    <h1 className="text-3xl font-bold text-white mb-2">4Gears Platform</h1>
                    <p className="text-slate-400 text-sm">Crea e gestisci le tue app sportive</p>
                </div>

                {/* Login/Signup Card */}
                <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl">
                    {/* Toggle Tabs */}
                    <div className="flex gap-2 mb-6 p-1 bg-slate-950/50 rounded-2xl">
                        <button
                            onClick={() => {
                                setIsSignUp(false);
                                setError('');
                                setInviteCode('');
                            }}
                            className={`flex-1 py-3 rounded-xl font-medium transition-all ${!isSignUp
                                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/50'
                                : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            Accedi
                        </button>
                        <button
                            onClick={() => {
                                setIsSignUp(true);
                                setError('');
                            }}
                            className={`flex-1 py-3 rounded-xl font-medium transition-all ${isSignUp
                                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/50'
                                : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            Registrati
                        </button>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-3"
                        >
                            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-400">{error}</p>
                        </motion.div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Invite Code (Only for Sign Up) */}
                        {isSignUp && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                            >
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Codice Invito
                                </label>
                                <div className="relative">
                                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                    <input
                                        type="text"
                                        value={inviteCode}
                                        onChange={(e) => setInviteCode(e.target.value)}
                                        placeholder="Inserisci il codice invito"
                                        className="w-full pl-12 pr-4 py-3 bg-slate-950/50 border border-slate-800 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                        required={isSignUp}
                                    />
                                </div>
                            </motion.div>
                        )}

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="tua@email.com"
                                    className="w-full pl-12 pr-4 py-3 bg-slate-950/50 border border-slate-800 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-4 py-3 bg-slate-950/50 border border-slate-800 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                    required
                                    minLength={6}
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-2xl hover:shadow-lg hover:shadow-blue-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    {isSignUp ? 'Crea Account' : 'Accedi'}
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-6 text-center text-sm text-slate-500">
                        {isSignUp ? (
                            <p>
                                Hai già un account?{' '}
                                <button
                                    onClick={() => {
                                        setIsSignUp(false);
                                        setError('');
                                        setInviteCode('');
                                    }}
                                    className="text-blue-400 hover:text-blue-300 font-medium"
                                >
                                    Accedi
                                </button>
                            </p>
                        ) : (
                            <p>
                                Nuovo utente?{' '}
                                <button
                                    onClick={() => {
                                        setIsSignUp(true);
                                        setError('');
                                    }}
                                    className="text-blue-400 hover:text-blue-300 font-medium"
                                >
                                    Registrati
                                </button>
                            </p>
                        )}
                    </div>
                </div>

                {/* Bottom Text */}
                <p className="text-center text-slate-600 text-xs mt-6">
                    © 2026 4Gears Platform. Tutti i diritti riservati.
                </p>
            </motion.div>
        </div>
    );
}
