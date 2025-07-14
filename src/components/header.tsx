
'use client';

import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "./ui/button";
import { LogOut, ShoppingCart } from "lucide-react";
import { PromotionalBanner } from "./promotional-banner";
import { useIsAdmin } from "@/hooks/use-is-admin";
import { useEffect, useState, type ReactNode } from "react";
import { handleLogout } from "@/app/actions";
import { Icons } from "./icons";

export function Header({children}: {children: ReactNode}) {
  const isAdmin = useIsAdmin();
  const [sessionTime, setSessionTime] = useState('00:00');

  useEffect(() => {
    if (isAdmin) {
      const startTime = Date.now();
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const minutes = Math.floor(elapsed / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);
        setSessionTime(
          `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
        );
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isAdmin]);

  return (
    <>
      {isAdmin ? (
        <header className="sticky top-0 z-20 bg-background text-foreground">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
             <Link href="/" className="flex items-center gap-2">
                <div className="flex flex-col leading-none">
                <span className="font-headline text-sm font-semibold tracking-widest text-primary uppercase">COPOS</span>
                <span className="font-headline text-2xl sm:text-3xl font-bold tracking-wider text-primary uppercase -mt-1">MANIA</span>
                </div>
            </Link>
            <div className="flex items-center gap-4 bg-card p-2 rounded-lg shadow-md">
              <div className="bg-primary text-primary-foreground rounded-full p-2">
                <Icons.logo className="h-6 w-6" />
              </div>
              <div>
                <p className="font-bold">Administrador</p>
                <p className="text-xs text-muted-foreground">Sessão: {sessionTime}</p>
              </div>
              <form action={handleLogout}>
                <Button variant="ghost" size="icon" type="submit" aria-label="Sair">
                  <LogOut className="h-5 w-5" />
                </Button>
              </form>
            </div>
          </div>
        </header>
      ) : (
        <>
          <PromotionalBanner />
          <header className="border-b sticky top-0 bg-background/95 backdrop-blur z-20">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
              <Link href="/" className="flex items-center gap-2">
                <div className="flex flex-col leading-none">
                  <span className="font-headline text-sm font-semibold tracking-widest text-primary uppercase">COPOS</span>
                  <span className="font-headline text-2xl sm:text-3xl font-bold tracking-wider text-primary uppercase -mt-1">MANIA</span>
                </div>
              </Link>
              <nav className="hidden md:flex items-center gap-2">
                <Button variant="ghost" asChild>
                  <Link href="/">Início</Link>
                </Button>
                <Button variant="ghost" asChild>
                  <Link href="/about">Sobre Nós</Link>
                </Button>
                <Button variant="ghost" asChild>
                  <Link href="/how-to-customize">Como Funciona</Link>
                </Button>
              </nav>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                    <ShoppingCart className="h-[1.2rem] w-[1.2rem]" />
                    <span className="sr-only">Carrinho</span>
                </Button>
                
                {children}

                <ThemeToggle />
              </div>
            </div>
          </header>
        </>
      )}
    </>
  );
}
