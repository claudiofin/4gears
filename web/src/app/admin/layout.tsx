'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { LayoutDashboard, FileText, Ticket, LogOut, Settings } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, profile, loading, signOut } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push('/login');
            } else if (profile && profile.role !== 'admin') {
                router.push('/dashboard');
            }
        }
    }, [user, profile, loading, router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!user || !profile || profile.role !== 'admin') {
        return null; // Will be handled by the useEffect redirect
    }

    const navigation = [
        { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
        { name: 'Richieste', href: '/admin/submissions', icon: FileText },
        { name: 'Codici Invito', href: '/admin/invites', icon: Ticket },
    ];

    return (
        <div className="min-h-screen bg-slate-950 flex font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col fixed h-full z-10">
                <div className="p-6 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold">4G</span>
                        </div>
                        <h1 className="text-xl font-bold text-white tracking-tight">Admin</h1>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive
                                    ? 'bg-blue-600 text-white'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                    }`}
                            >
                                <item.icon className="w-5 h-5" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <div className="mb-4 px-4">
                        <p className="text-sm font-medium text-white truncate">{profile.email}</p>
                        <p className="text-xs text-slate-500 capitalize">{profile.role}</p>
                    </div>
                    <button
                        onClick={() => signOut()}
                        className="w-full flex items-center gap-3 px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg text-sm font-medium transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        Disconnetti
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8">
                {children}
            </main>
        </div>
    );
}
