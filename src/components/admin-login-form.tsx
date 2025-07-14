
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { handleAdminLogin } from '@/app/actions';
import { Checkbox } from '@/components/ui/checkbox';
import { useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

interface AdminLoginFormProps {
    onLoginSuccess?: () => void;
}

export function AdminLoginForm({ onLoginSuccess }: AdminLoginFormProps) {
    const { toast } = useToast();
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const clientAction = async (formData: FormData) => {
        startTransition(async () => {
            try {
                const result = await handleAdminLogin(formData);
                if (result?.success) {
                    toast({
                        title: "Login de Admin bem-sucedido!",
                        description: "Redirecionando para o painel.",
                    });
                    onLoginSuccess?.(); // Fecha o modal
                    router.push('/admin'); // Redireciona para o painel
                } else {
                    // Embora o 'else' possa não ser alcançado se o erro for lançado,
                    // é uma boa prática para segurança.
                    throw new Error(result.error || 'Credenciais inválidas.')
                }
            } catch (error: any) {
                toast({
                    title: "Erro de Autenticação",
                    description: error.message || "Credenciais inválidas.",
                    variant: "destructive",
                });
            }
        });
    }

    return (
        <Card className="w-full max-w-md border-0 shadow-none">
            <CardHeader className="text-center">
                <CardTitle className="font-headline text-2xl">Acesso Restrito</CardTitle>
                <CardDescription>Use suas credenciais de administrador para acessar o painel.</CardDescription>
            </CardHeader>
            <CardContent>
                <form action={clientAction} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email-admin">Email</Label>
                        <Input id="email-admin" name="email" type="email" placeholder="admin@coposmania.com" required defaultValue="admin@coposmania.com" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password-admin">Senha</Label>
                        <Input id="password-admin" name="password" type="password" required defaultValue="12345" />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="remember-admin" name="remember" defaultChecked />
                        <Label
                            htmlFor="remember-admin"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Lembrar-me
                        </Label>
                    </div>
                    <Button type="submit" className="w-full" disabled={isPending}>
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Entrar
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
