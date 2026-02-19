'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CheckPage() {
    const router = useRouter();
    useEffect(() => {
        router.replace('/');
    }, [router]);

    return (
        <main className="min-h-screen flex items-center justify-center">
            <p className="text-text-muted text-sm">Redirecting...</p>
        </main>
    );
}
