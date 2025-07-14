
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { AdminLoginForm } from './admin-login-form';

interface AdminLoginContextType {
    isLoginOpen: boolean;
    openAdminLogin: () => void;
    closeAdminLogin: () => void;
}

const AdminLoginContext = createContext<AdminLoginContextType | undefined>(undefined);

export function useAdminLogin() {
    const context = useContext(AdminLoginContext);
    if (!context) {
        throw new Error('useAdminLogin must be used within an AdminLoginModalProvider');
    }
    return context;
}

export function AdminLoginModalProvider({ children }: { children: ReactNode }) {
    const [isLoginOpen, setIsLoginOpen] = useState(false);

    const openAdminLogin = () => setIsLoginOpen(true);
    const closeAdminLogin = () => setIsLoginOpen(false);

    return (
        <AdminLoginContext.Provider value={{ isLoginOpen, openAdminLogin, closeAdminLogin }}>
            {children}
            <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
                <DialogContent className="sm:max-w-md p-0">
                    <AdminLoginForm onLoginSuccess={closeAdminLogin} />
                </DialogContent>
            </Dialog>
        </AdminLoginContext.Provider>
    );
}
