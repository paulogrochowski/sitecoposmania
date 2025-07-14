
import { LoginForm } from '@/components/login-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { AdminLoginButton } from '@/components/admin-login-button';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <>
      <main className="flex-1 flex items-center justify-center container mx-auto p-4 md:p-8">
        <Card className="w-full max-w-md">
            <CardHeader className="text-center">
                <CardTitle className="font-headline text-2xl">Login de Cliente</CardTitle>
                <CardDescription>Acesse sua conta para ver seus pedidos e favoritos.</CardDescription>
            </CardHeader>
            <CardContent>
                <LoginForm />
            </CardContent>
             <CardFooter className="flex flex-col items-center justify-center text-center text-sm gap-4 pt-4">
                 <p>Não tem uma conta? <Link href="/register" className="text-primary hover:underline">Cadastre-se</Link></p>
                <div className="text-muted-foreground text-xs my-2">-- ou --</div>
                <AdminLoginButton />
            </CardFooter>
        </Card>
      </main>
    </>
  );
}
