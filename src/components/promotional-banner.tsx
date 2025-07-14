'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { X, Gift } from 'lucide-react';

export function PromotionalBanner() {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) {
        return null;
    }

    return (
        <div className="relative bg-primary text-primary-foreground">
            <div className="container mx-auto flex h-12 items-center justify-center px-4 text-sm font-medium">
                <Gift className="mr-3 h-5 w-5" />
                <p className="flex-1 text-center">
                    <span className="hidden sm:inline">OFERTA ESPECIAL: </span>
                    Frete Grátis em pedidos acima de R$200!
                </p>
                 <Button 
                    variant="ghost" 
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full hover:bg-primary/80"
                    onClick={() => setIsVisible(false)}
                    >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Fechar banner</span>
                </Button>
            </div>
        </div>
    );
}
