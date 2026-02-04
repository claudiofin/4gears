'use client';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, profile, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && user && profile?.role === 'admin') {
            router.push('/admin');
        }
    }, [user, profile, loading, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
        );
    }

    // If admin, don't render dashboard content while redirecting
    if (user && profile?.role === 'admin') {
        return null;
    }

    return (
        <ProtectedRoute>
            {children}
        </ProtectedRoute>
    );
}
