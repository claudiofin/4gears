'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

import { Profile } from '@/types/database';

interface AuthContextType {
    user: User | null;
    session: Session | null;
    profile: Profile | null;
    loading: boolean;
    signUp: (email: string, password: string, inviteCode: string) => Promise<{ error: AuthError | null }>;
    signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        const syncAuth = async (event: string, session: Session | null) => {
            if (!mounted) return;

            console.log('Syncing auth:', event, session?.user?.id);
            setSession(session);
            setUser(session?.user ?? null);

            if (session?.user) {
                setLoading(true);
                try {
                    const { data, error } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', session.user.id)
                        .single();

                    if (mounted) {
                        if (error) {
                            console.error('Profile fetch error:', error);
                            setProfile(null);
                        } else {
                            setProfile(data);
                        }
                    }
                } catch (err) {
                    console.error('Panic in syncAuth:', err);
                    if (mounted) setProfile(null);
                } finally {
                    if (mounted) setLoading(false);
                }
            } else {
                setProfile(null);
                setLoading(false);
            }
        };

        // Initial check
        supabase.auth.getSession().then(({ data: { session } }) => {
            syncAuth('INITIAL_SESSION', session);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            syncAuth(event, session);
        });

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, []);

    const signUp = async (email: string, password: string, inviteCode: string) => {
        try {
            // 1. Check if invite code is valid
            const { data: inviteData, error: inviteError } = await supabase
                .from('invite_codes')
                .select('*')
                .eq('code', inviteCode)
                .eq('used', false)
                .single();

            if (inviteError || !inviteData) {
                return { error: { message: 'Codice invito non valido o già utilizzato' } as AuthError };
            }

            // 2. Sign up the user (pass invite_code in metadata for trigger to handle)
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        invite_code: inviteCode
                    }
                }
            });

            if (authError) return { error: authError };

            return { error: null };
        } catch (error) {
            return { error: { message: 'Errore durante la registrazione' } as AuthError };
        }
    };

    const signIn = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        return { error };
    };

    const signOut = async () => {
        await supabase.auth.signOut();
    };

    const value = {
        user,
        session,
        profile,
        loading,
        signUp,
        signIn,
        signOut,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
