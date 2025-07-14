
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { CUP_TYPES_SUMMARY } from '@/lib/cup-data';
import { ShippingCalculator } from '@/components/shipping-calculator';
import { ArrowRight } from 'lucide-react';
import { ProductCard } from '@/components/product-card';

export default function LandingPage() {
  return (
    <>
      <main className="flex-1">
        {/* Hero Banner Section */}
        <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center text-center bg-card text-foreground">
            <Image
                src="https://placehold.co/1920x1080.png"
                alt="Banner de festa com copos personalizados"
                fill
                objectFit="cover"
                className="absolute z-[-1] opacity-20"
                data-ai-hint="party background"
                priority
            />
            <div className="container mx-auto px-4 z-10">
                <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-wider uppercase drop-shadow-lg">Sua Ideia, Nosso Copo</h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl drop-shadow-md">
                    Crie copos personalizados para qualquer ocasião com designs únicos gerados por Inteligência Artificial. Ideal para festas, casamentos e eventos corporativos.
                </p>
                <Button asChild size="lg" className="mt-8">
                    <Link href="#produtos">Ver Produtos <ArrowRight className="ml-2" /></Link>
                </Button>
            </div>
        </section>

        {/* Product Grid Section */}
        <section id="produtos" className="container mx-auto py-12 md:py-16">
            <div className="text-center mb-12">
                <h2 className="font-headline text-3xl md:text-4xl font-bold tracking-wider uppercase">Nossos Produtos Mais Vendidos</h2>
                <p className="mt-2 text-lg text-muted-foreground">Selecione um modelo e comece a personalizar.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                {CUP_TYPES_SUMMARY.map((type, index) => (
                    <ProductCard key={type.id} product={type} priority={index < 4} />
                ))}
            </div>
        </section>

        {/* Promotion Section */}
        <section className="bg-secondary/50 py-12 md:py-16">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-8">
                <div className="relative w-full aspect-square max-w-md mx-auto">
                     <Image
                        src="https://placehold.co/600x600.png"
                        alt="Promoção de copos personalizados"
                        layout="fill"
                        objectFit="cover"
                        className="rounded-lg shadow-lg"
                        data-ai-hint="colorful cups"
                    />
                </div>
                <div className="text-center md:text-left">
                    <h3 className="font-headline text-3xl md:text-4xl font-bold tracking-wider uppercase"><span className="text-primary">Oferta Especial!</span></h3>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Primeira compra? Use o cupom <span className="font-bold text-primary">BEMVINDO10</span> e ganhe 10% de desconto em qualquer pedido acima de 100 unidades.
                    </p>
                    <p className="mt-2 text-muted-foreground">Não perca a chance de tornar seu evento inesquecível por menos!</p>
                    <Button asChild size="lg" className="mt-6">
                        <Link href="#produtos">Aproveitar Desconto</Link>
                    </Button>
                </div>
            </div>
        </section>

        <section className="container mx-auto py-12 md:py-16">
            <ShippingCalculator />
        </section>

      </main>
    </>
  );
}
