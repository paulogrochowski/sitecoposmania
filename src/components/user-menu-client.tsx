
'use client';

import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { User, LogOut, Settings, ListOrdered, Heart } from "lucide-react";
import { handleLogout } from "@/app/actions";

interface UserMenuClientProps {
  isLoggedIn: boolean;
}

export function UserMenuClient({ isLoggedIn }: UserMenuClientProps) {

  if (!isLoggedIn) {
    return (
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Entrar</Link>
            </Button>
            <Button asChild size="sm">
                <Link href="/register">Registrar</Link>
            </Button>
        </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <User className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Menu do Usuário</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
           <Link href="/orders" className="flex items-center cursor-pointer">
            <ListOrdered className="mr-2 h-4 w-4" />
            <span>Meus Pedidos</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/favorites" className="flex items-center cursor-pointer">
            <Heart className="mr-2 h-4 w-4" />
            <span>Favoritos</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/profile" className="flex items-center cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Meu Perfil</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <form action={handleLogout} className="w-full">
          <DropdownMenuItem asChild>
            <button
              type="submit"
              className="w-full cursor-pointer flex items-center text-destructive focus:text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair</span>
            </button>
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
