import type { Metadata } from 'next';
import { Oswald, Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from '@/components/theme-provider';
import { AdminLoginModalProvider } from '@/components/admin-login-modal-provider';
import { FooterMenuWrapper } from '@/components/footer-menu-wrapper';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { UserMenuWrapper } from '@/components/user-menu-wrapper';
import { headers } from 'next/headers';

const oswald = Oswald({
  subsets: ['latin'],
  variable: '--font-oswald',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Copos Mania',
  description: 'Gere designs de copos personalizados com IA.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = headers().get('x-pathname');
  const standalone = pathname?.startsWith('/gerar-3d') || pathname?.startsWith('/admin/gerar-3d');

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${oswald.variable} ${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AdminLoginModalProvider>
            {standalone ? children : <div className="flex min-h-screen flex-col">
              <Header><UserMenuWrapper /></Header>
              <main className="flex-1">{children}</main>
              <Footer />
              <FooterMenuWrapper />
            </div>}
          </AdminLoginModalProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
