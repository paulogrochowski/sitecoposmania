
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, Target, Users } from 'lucide-react';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <>
      <main className="flex-1">
        {/* Page Header */}
        <section className="py-16 md:py-24 bg-secondary/50 text-center">
          <div className="container mx-auto">
            <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-wider uppercase">Sobre a Copos Mania</h1>
            <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
              Transformando suas ideias em copos personalizados para festas e eventos inesquecíveis.
            </p>
          </div>
        </section>

        {/* Company Story Section */}
        <section className="container mx-auto py-12 md:py-16">
            <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="relative w-full h-80 rounded-lg overflow-hidden shadow-lg">
                    <Image
                        src="https://placehold.co/800x600.png"
                        alt="Equipe da Copos Mania em um workshop de design"
                        layout="fill"
                        objectFit="cover"
                        data-ai-hint="team workshop"
                    />
                </div>
                <div>
                    <h2 className="font-headline text-3xl font-bold mb-4">Nossa História</h2>
                    <p className="text-muted-foreground mb-4">
                        A Copos Mania nasceu da paixão por celebrações e da vontade de oferecer produtos únicos que fizessem parte das memórias mais felizes das pessoas. Começamos em uma pequena garagem, com uma única máquina e um grande sonho: permitir que qualquer pessoa pudesse criar copos personalizados para seus eventos, sem complicações.
                    </p>
                    <p className="text-muted-foreground">
                        Hoje, combinamos essa paixão com a mais alta tecnologia, utilizando inteligência artificial para democratizar o design e garantir que cada copo seja tão especial quanto a festa que ele celebra, seja um casamento, aniversário ou evento corporativo.
                    </p>
                </div>
            </div>
        </section>

        {/* Mission, Vision, Values Section */}
        <section className="bg-secondary/50 py-12 md:py-16">
            <div className="container mx-auto grid sm:grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="text-center">
                    <CardHeader>
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                            <Target className="h-10 w-10 text-primary" />
                        </div>
                        <CardTitle className="font-headline text-2xl">Nossa Missão</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">
                            Oferecer uma plataforma simples e inovadora para a criação de copos personalizados de alta qualidade, tornando cada evento único e memorável.
                        </p>
                    </CardContent>
                </Card>
                <Card className="text-center">
                    <CardHeader>
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                            <Users className="h-10 w-10 text-primary" />
                        </div>
                        <CardTitle className="font-headline text-2xl">Nossa Visão</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">
                            Ser a referência nacional em personalização de copos para eventos, liderando o mercado com tecnologia, criatividade e um compromisso inabalável com a satisfação do cliente.
                        </p>
                    </CardContent>
                </Card>
                 <Card className="text-center">
                    <CardHeader>
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                            <Award className="h-10 w-10 text-primary" />
                        </div>
                        <CardTitle className="font-headline text-2xl">Nossos Valores</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">
                           Criatividade, Qualidade, Inovação, Paixão pelo Cliente e Sustentabilidade.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </section>
      </main>
    </>
  );
}
