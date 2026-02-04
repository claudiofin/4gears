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

    const fetchProfile = async (userId: string) => {
        try {
            const { data } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();
            setProfile(data);
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(async ({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                await fetchProfile(session.user.id);
            }
            setLoading(false);
        });

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                await fetchProfile(session.user.id);
            } else {
                setProfile(null);
            }
            setLoading(false);
        });

        return () => subscription.unsubscribe();
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

            // 2. Sign up the user
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
            });

            if (authError) return { error: authError };

            // 3. Mark invite code as used
            if (authData.user) {
                // We use the same supabase instance which should have the session now
                const { error: updateError } = await supabase
                    .from('invite_codes')
                    .update({
                        used: true,
                        used_by: authData.user.id,
                        used_at: new Date().toISOString(),
                    })
                    .eq('code', inviteCode);

                if (updateError) {
                    console.error('Error marking invite code as used:', updateError);
                    // We don't return error here because the user is already created
                    // but we log it for debugging.
                }
            }

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
