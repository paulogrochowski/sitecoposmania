
'use client';

import { useAdminLogin } from './admin-login-modal-provider';
import { Button } from './ui/button';
import { Wrench } from 'lucide-react';

export function AdminLoginButton() {
    const { openAdminLogin } = useAdminLogin();

    return (
        <Button
            onClick={openAdminLogin}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
        >
            <Wrench className="h-4 w-4" />
            <span className="hidden sm:inline">Admin</span>
        </Button>
    )
}
