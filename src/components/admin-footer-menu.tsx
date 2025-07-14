
'use client';

import Link from "next/link";
import { usePathname } from 'next/navigation';
import { Home, Menu, Users, LayoutDashboard, Megaphone } from 'lucide-react';
import { cn } from "@/lib/utils";

const menuItems = [
  { href: "/", icon: Home, label: "Início" },
  { href: "/admin/products", icon: Menu, label: "Produto" },
  { href: "/admin/customers", icon: Users, label: "Clientes" },
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/marketing", icon: Megaphone, label: "Marketing" },
];

export function AdminFooterMenu() {
  const pathname = usePathname();

  return (
    <footer className="fixed bottom-0 z-50 w-full bg-primary text-primary-foreground border-t">
        <div className="container mx-auto flex h-16 items-center justify-around px-4">
            {menuItems.map(({ href, icon: Icon, label }) => (
                <Link
                    href={href}
                    key={href}
                    className={cn(
                        "flex flex-col items-center justify-center gap-1 text-xs font-medium w-16 transition-colors hover:text-primary-foreground/80",
                        pathname === href ? "text-white font-bold" : "text-primary-foreground/70"
                    )}
                >
                    <Icon className="w-6 h-6" />
                    <span>{label}</span>
                </Link>
            ))}
        </div>
    </footer>
  );
}
