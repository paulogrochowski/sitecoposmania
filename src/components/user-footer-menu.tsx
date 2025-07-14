
'use client';

import Link from "next/link";
import { usePathname } from 'next/navigation';
import { Home, ListOrdered, ShoppingCart, Heart } from 'lucide-react';
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const menuItems = [
  { href: "/", icon: Home, label: "Início" },
  { href: "/orders", icon: ListOrdered, label: "Minhas Compras" },
  { href: "/cart", icon: ShoppingCart, label: "Carrinho" },
  { href: "/favorites", icon: Heart, label: "Favoritos" },
];

export function UserFooterMenu() {
  const pathname = usePathname();

  return (
    <footer className="sticky bottom-0 z-50 mt-auto bg-background/95 backdrop-blur border-t">
      <TooltipProvider delayDuration={0}>
        <div className="container mx-auto flex h-16 items-center justify-around px-4">
            {menuItems.map(({ href, icon: Icon, label }) => (
              <Tooltip key={href}>
                <TooltipTrigger asChild>
                  <Button
                    asChild
                    variant={pathname === href ? "secondary" : "ghost"}
                    size="icon"
                    className={cn("flex flex-col h-auto p-2 gap-1 transition-all", 
                      pathname === href && "text-primary"
                    )}
                  >
                    <Link href={href}>
                      <Icon className="w-5 h-5" />
                      <span className="text-xs">{label}</span>
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{label}</p>
                </TooltipContent>
              </Tooltip>
            ))}
        </div>
      </TooltipProvider>
    </footer>
  );
}
