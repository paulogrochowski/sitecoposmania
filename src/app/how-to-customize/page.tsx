
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CupSoda, Palette, Sparkles, ShoppingCart } from 'lucide-react';

export default function HowToCustomizePage() {
  const steps = [
    {
      icon: <CupSoda className="h-10 w-10 text-primary" />,
      title: '1. Escolha o Modelo',
      description: 'Navegue pela nossa seleção e escolha o modelo de copo que mais combina com seu evento. Temos diversas opções de tamanhos e estilos.',
    },
    {
      icon: <Sparkles className="h-10 w-10 text-primary" />,
      title: '2. Crie sua Arte com IA',
      description: 'Use nossa ferramenta de inteligência artificial para gerar uma arte exclusiva. Basta descrever sua ideia e ver a mágica acontecer em segundos.',
    },
    {
      icon: <Palette className="h-10 w-10 text-primary" />,
      title: '3. Personalize os Detalhes',
      description: 'Ajuste as cores do copo, adicione bordas metalizadas e escolha o tipo de acabamento. Deixe o copo com a sua cara e interaja com o modelo 3D.',
    },
    {
      icon: <ShoppingCart className="h-10 w-10 text-primary" />,
      title: '4. Aprove e Finalize o Pedido',
      description: 'Revise o orçamento, defina a quantidade e finalize a compra. Nós cuidamos do resto e enviamos seus copos personalizados para todo o Brasil.',
    },
  ];

  return (
    <>
      <main className="flex-1 container mx-auto py-12 md:py-16">
        <section className="text-center mb-12">
          <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-wider uppercase">Como Funciona</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Criar seu copo personalizado nunca foi tão fácil. Siga os passos abaixo e transforme sua ideia em realidade em poucos minutos.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <Card key={index} className="text-center bg-card flex flex-col">
              <CardHeader>
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                  {step.icon}
                </div>
                <CardTitle className="font-sans text-xl">{step.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-muted-foreground">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="text-center mt-16">
          <h2 className="text-2xl font-bold font-headline">Pronto para Começar?</h2>
          <p className="mt-2 text-muted-foreground">Clique no botão abaixo para escolher seu copo e iniciar a personalização.</p>
          <Button asChild size="lg" className="mt-6">
            <Link href="/">Começar a Personalizar</Link>
          </Button>
        </section>
      </main>
    </>
  );
}
