'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Pencil } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import Cookies from 'js-cookie';

// This mirrors the structure of items in CUP_TYPES_SUMMARY
interface Product {
    id: string;
    name: string;
    imageUrl: string;
    basePrice: number;
    'data-ai-hint'?: string;
    summary: string;
    description: string;
}

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
    const [isFavorite, setIsFavorite] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        // Check for admin cookie on mount
        const adminCookie = Cookies.get('admin-session');
        setIsAdmin(!!adminCookie);
    }, []);

    const toggleFavorite = () => {
        setIsFavorite(!isFavorite);
        toast({
            title: isFavorite ? "Removido dos favoritos" : "Adicionado aos favoritos",
            description: `${product.name} foi ${isFavorite ? 'removido da' : 'adicionado à'} sua lista.`,
        });
    }

  return (
    <Card className="flex flex-col overflow-hidden transition-shadow duration-300 ease-in-out hover:shadow-xl group">
      <CardHeader className="p-0 relative">
        <Link href={`/create?cup=${encodeURIComponent(product.name)}`} className="block" aria-label={`Personalizar ${product.name}`}>
          <div className="aspect-[4/5] relative overflow-hidden">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              priority={priority}
              data-ai-hint={product['data-ai-hint']}
            />
          </div>
        </Link>
        <div className="absolute top-3 right-3 flex flex-col gap-2">
            <Button 
                variant="secondary" 
                size="icon" 
                className="rounded-full h-9 w-9 bg-background/60 backdrop-blur-sm hover:bg-background/80"
                onClick={toggleFavorite}
                aria-label="Adicionar aos favoritos"
            >
                <Heart className={cn("h-5 w-5", isFavorite ? "text-red-500 fill-current" : "text-foreground")} />
            </Button>
            {isAdmin && (
                <Button 
                    asChild
                    variant="secondary" 
                    size="icon" 
                    className="rounded-full h-9 w-9 bg-primary/80 backdrop-blur-sm hover:bg-primary text-primary-foreground"
                    aria-label="Editar Produto"
                >
                    <Link href={`/edit-product/${product.id}`}>
                        <Pencil className="h-5 w-5" />
                    </Link>
                </Button>
            )}
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-1">
        <CardTitle className="text-lg font-bold font-headline leading-tight">
           <Link href={`/create?cup=${encodeURIComponent(product.name)}`} className="hover:text-primary transition-colors">
            {product.name}
           </Link>
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">{product.summary}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <div className="text-xl font-bold">
            <span className="text-xs font-normal text-muted-foreground">A partir de </span>
            R$ {product.basePrice.toFixed(2).replace('.', ',')}
        </div>
        <Button asChild>
          <Link href={`/create?cup=${encodeURIComponent(product.name)}`}>
            Personalizar
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
