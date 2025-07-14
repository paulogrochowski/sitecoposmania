
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Instagram, Facebook, Youtube } from 'lucide-react';
import { AdminLoginButton } from '@/components/admin-login-button';
import { useIsAdmin } from '@/hooks/use-is-admin';

export function Footer() {
    const isAdmin = useIsAdmin();

    // Do not render the footer if the admin is logged in, 
    // as the AdminFooterMenu will be displayed instead.
    if (isAdmin) {
        return null;
    }

    return (
        <footer className="border-t bg-card">
            <div className="container mx-auto py-6 flex flex-col sm:flex-row justify-between items-center text-center text-sm">
                <p className="text-muted-foreground">&copy; {new Date().getFullYear()} Copos Mania. Todos os direitos reservados.</p>
                <div className="flex items-center gap-2 mt-4 sm:mt-0">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="#" target="_blank"><Instagram className="h-5 w-5" /></Link>
                    </Button>
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="#" target="_blank"><Facebook className="h-5 w-5" /></Link>
                    </Button>
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="#" target="_blank"><Youtube className="h-5 w-5" /></Link>
                    </Button>
                    <span className="text-muted-foreground mx-2">|</span>
                    <AdminLoginButton />
                </div>
            </div>
        </footer>
    );
}
