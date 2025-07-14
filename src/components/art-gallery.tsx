
'use client';

import { useState, useTransition, useRef, useMemo } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { QuoteSummary } from './quote-summary';
import { CheckoutView } from './checkout-view';
import { Loader } from './loader';
import { Separator } from './ui/separator';
import { ArrowLeft, Check, Download, Loader2, Slash, Sparkles } from 'lucide-react';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { handleArtAnalysis, handleFinalizeOrder, handleArtGeneration } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import type { CupModel, GeneratedArt, OrderDetails, ArtTransformations } from '@/lib/types';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CUP_CATALOG, DEGRADE_COLORS, RIM_COLORS, DEGRADE_HEX_COLORS } from '@/lib/cup-data';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { cn } from '@/lib/utils';
import { PreviewCard } from './preview-card';

interface ArtGalleryProps {
    selectedCupName: string;
}

// Helper function moved outside the component to fix initialization error and improve performance.
const getAvailableCupOptions = (cupName: string) => {
    const allOptions = CUP_CATALOG.filter(c => c.name === cupName);
    const opacities = [...new Set(allOptions.map(c => c.opacityType!))];
    const rims = [...new Set(allOptions.map(c => c.rimColor!))];
    return { opacities, rims };
};

const initialArtTransformations: ArtTransformations = {
    scale: [1, 0.5], // Width, Height
    position: [0, 0.1], // X, Y
    rotation: 0,
};

export function ArtGallery({ selectedCupName }: ArtGalleryProps) {
    const { toast } = useToast();
    const [isGenerating, startGenerationTransition] = useTransition();

    const [view, setView] = useState<'editor' | 'quote' | 'checkout'>('editor');

    // Cup Customization State
    const { opacities, rims } = getAvailableCupOptions(selectedCupName);
    const [selectedOpacity, setSelectedOpacity] = useState(opacities[0]);
    const [selectedRim, setSelectedRim] = useState(rims[0]);
    const [selectedDegradeColor, setSelectedDegradeColor] = useState('Nenhum');
    const [selectedDegradePosition, setSelectedDegradePosition] = useState<'Nenhum' | 'Cima' | 'Baixo'>('Nenhum');


    // Art State
    const [art, setArt] = useState<GeneratedArt | null>(null);
    const [artPrompt, setArtPrompt] = useState('');
    const [analysis, setAnalysis] = useState<{ score: number; reasoning: string } | null>(null);
    const [artTransformations, setArtTransformations] = useState<ArtTransformations>(initialArtTransformations);

    
    // Final Order State
    const [finalOrder, setFinalOrder] = useState<OrderDetails | null>(null);
    const finalActionsRef = useRef<HTMLDivElement>(null);

    const handleScrollToActions = () => {
        finalActionsRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const activeCupModel: CupModel = useMemo(() => {
        const base = CUP_CATALOG.find(c =>
            c.name === selectedCupName &&
            c.opacityType === selectedOpacity &&
            c.rimColor === selectedRim
        ) || CUP_CATALOG.find(c => c.name === selectedCupName)!;

        return {
            ...base,
            degradeColor: selectedDegradeColor,
            degradePosition: selectedDegradePosition,
        };
    }, [selectedCupName, selectedOpacity, selectedRim, selectedDegradeColor, selectedDegradePosition]);


    const handleGenerateArt = () => {
        if (!artPrompt) {
            toast({ variant: 'destructive', title: 'Atenção', description: 'Por favor, descreva a arte que você deseja.' });
            return;
        }
        startGenerationTransition(async () => {
            const result = await handleArtGeneration(artPrompt);
            if (result.success && result.imageUrl) {
                const artData: GeneratedArt = {
                    id: `art-${Date.now()}`,
                    imageUrl: result.imageUrl,
                    prompt: artPrompt,
                };
                setArt(artData);
                setArtTransformations(initialArtTransformations);
                const analysisResult = await handleArtAnalysis(result.imageUrl, artPrompt);
                if (analysisResult.success && analysisResult.analysis) {
                    setAnalysis(analysisResult.analysis);
                } else {
                     toast({ variant: 'destructive', title: 'Erro na Análise', description: analysisResult.error });
                }
            } else {
                toast({ variant: 'destructive', title: 'Erro na Geração', description: result.error });
            }
        });
    };
    
    const handleGoToQuote = () => {
        setView('quote');
    }

    const handleFinalize = (details: OrderDetails) => {
        startGenerationTransition(async () => {
            const result = await handleFinalizeOrder(details);
            if (result.success) {
                setFinalOrder(details);
                setView('checkout');
            } else {
                toast({ variant: 'destructive', title: 'Erro no Pedido', description: 'Não foi possível finalizar seu pedido.' });
            }
        });
    };

    const resetFlow = () => {
        setArt(null);
        setAnalysis(null);
        setFinalOrder(null);
        setView('editor');
    };

    const handleDegradeColorChange = (color: string) => {
        setSelectedDegradeColor(color);
        if (color !== 'Nenhum' && selectedDegradePosition === 'Nenhum') {
            setSelectedDegradePosition('Cima'); // Default to top
        }
        if (color === 'Nenhum') {
            setSelectedDegradePosition('Nenhum');
        }
    }
    
    const handleSaveArt = () => {
        if (!art?.imageUrl || art.imageUrl.startsWith('data:image/gif')) return;
        const link = document.createElement('a');
        link.href = art.imageUrl;
        link.download = `copos-mania-arte-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast({ title: 'Sucesso', description: 'Sua arte foi salva no seu dispositivo.' });
    };

    if (view === 'checkout' && finalOrder) {
        return <CheckoutView orderDetails={finalOrder} onStartNewOrder={resetFlow} />;
    }

    if (view === 'quote') {
        const finalArt: GeneratedArt = art ? {
            ...art,
            transformations: artTransformations,
        } : {
            id: 'no-art',
            imageUrl: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', // transparent pixel
            prompt: 'Sem arte',
            transformations: initialArtTransformations,
        };

        const finalAnalysis = analysis ? { score: analysis.score, reasoning: analysis.reasoning } : { score: 0, reasoning: 'Nenhuma arte para analisar.' };

        return (
            <QuoteSummary
                initialDetails={{
                    cupModel: activeCupModel,
                    eventDescription: art?.prompt || 'Sem arte',
                    art: finalArt,
                    artComplexity: finalAnalysis,
                }}
                onFinalize={handleFinalize}
                onBack={() => setView('editor')}
            />
        );
    }

    return (
        <div>
            <div className="flex items-center gap-4 mb-8">
                <h2 className="text-xl">Personalizando: <span className="font-bold text-primary">{selectedCupName}</span></h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                
                <div className="order-2 lg:order-1 lg:col-span-2">
                    <div className="space-y-6">
                        {/* Cup Customization */}
                        <Card>
                            <CardHeader><CardTitle>Personalize o Copo</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label className="font-bold">Cor</Label>
                                    <TooltipProvider>
                                        <div className="flex flex-wrap gap-3 mt-2">
                                            {opacities.map(opacity => (
                                                <Tooltip key={opacity}>
                                                    <TooltipTrigger asChild>
                                                        <button
                                                            onClick={() => setSelectedOpacity(opacity)}
                                                            className={cn(
                                                                "relative w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all overflow-hidden",
                                                                selectedOpacity === opacity ? 'border-primary ring-2 ring-primary ring-offset-2 ring-offset-background' : 'border-muted hover:border-foreground/50'
                                                            )}
                                                        >
                                                            {opacity === 'Fosco' && (
                                                                <div className="w-full h-full bg-foreground/20"></div>
                                                            )}
                                                            {opacity === 'Transparente' && (
                                                                <div className="w-full h-full checkerboard"></div>
                                                            )}
                                                            {selectedOpacity === opacity && <Check className="absolute h-5 w-5 text-primary-foreground mix-blend-difference" />}
                                                        </button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>{opacity}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            ))}
                                        </div>
                                    </TooltipProvider>
                                </div>
                                <div>
                                    <Label className="font-bold">Borda</Label>
                                    <TooltipProvider>
                                        <div className="flex flex-wrap gap-3 mt-2">
                                            {rims.map(rim => (
                                                <Tooltip key={rim}>
                                                    <TooltipTrigger asChild>
                                                        <button
                                                            onClick={() => setSelectedRim(rim)}
                                                            className={cn(
                                                                "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all",
                                                                selectedRim === rim ? 'border-primary ring-2 ring-primary ring-offset-2 ring-offset-background' : 'border-muted hover:border-foreground/ ৫০'
                                                            )}
                                                            style={{ backgroundColor: rim === 'Nenhuma' ? 'hsl(var(--muted))' : RIM_COLORS[rim] }}
                                                        >
                                                            {selectedRim === rim && <Check className="h-5 w-5 text-white mix-blend-difference" />}
                                                            {rim === 'Nenhuma' && selectedRim !== 'Nenhuma' && <Slash className="h-5 w-5 text-muted-foreground" />}
                                                        </button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>{rim}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            ))}
                                        </div>
                                    </TooltipProvider>
                                </div>
                                <Separator />
                                <div>
                                    <Label className="font-bold">Degradê</Label>
                                    <div className="grid grid-cols-1 gap-4 mt-2">
                                        <TooltipProvider>
                                          <div className="flex flex-wrap gap-3">
                                                {DEGRADE_COLORS.map(color => (
                                                    <Tooltip key={color}>
                                                        <TooltipTrigger asChild>
                                                            <button
                                                                onClick={() => handleDegradeColorChange(color)}
                                                                className={cn(
                                                                    "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all",
                                                                    selectedDegradeColor === color ? 'border-primary ring-2 ring-primary ring-offset-2 ring-offset-background' : 'border-muted hover:border-foreground/50'
                                                                )}
                                                                style={{
                                                                    background: color === 'Nenhum' ? 'hsl(var(--muted))' : `linear-gradient(to bottom, ${DEGRADE_HEX_COLORS[color]}, hsl(var(--card)))`
                                                                }}
                                                            >
                                                                {selectedDegradeColor === color && <Check className="h-5 w-5 text-white mix-blend-difference" />}
                                                                {color === 'Nenhum' && selectedDegradeColor !== 'Nenhum' && <Slash className="h-5 w-5 text-muted-foreground" />}
                                                            </button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>{color}</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                ))}
                                            </div>
                                        </TooltipProvider>
                                        
                                        {selectedDegradeColor !== 'Nenhum' && (
                                            <div className="mt-2">
                                                <Label className="text-sm">Posição do Degradê</Label>
                                                <RadioGroup
                                                    value={selectedDegradePosition}
                                                    onValueChange={(value) => setSelectedDegradePosition(value as any)}
                                                    className="flex gap-4 mt-3"
                                                >
                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem value="Cima" id="pos-cima" />
                                                        <Label htmlFor="pos-cima" className="font-normal">De Baixo para Cima</Label>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem value="Baixo" id="pos-baixo" />
                                                        <Label htmlFor="pos-baixo" className="font-normal">De Cima para Baixo</Label>
                                                    </div>
                                                </RadioGroup>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Art Generation */}
                        <Card>
                            <CardHeader><CardTitle>Crie sua Arte</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <Textarea
                                    placeholder="Ex: festa 15 anos, escrito 'Júlia' em rosa com uma coroa"
                                    rows={4}
                                    value={artPrompt}
                                    onChange={(e) => setArtPrompt(e.target.value)}
                                />
                                <Button onClick={handleGenerateArt} disabled={isGenerating} className="w-full">
                                    {isGenerating ? <Loader message="Gerando..." /> : <Sparkles />}
                                    Gerar Arte com IA
                                </Button>
                            </CardContent>
                        </Card>

                      </div>
                </div>

                 <div className="order-1 lg:order-2 lg:col-span-3">
                    <div className="sticky top-24">
                        <PreviewCard 
                            cupModel={activeCupModel} 
                            art={art}
                            artTransformations={artTransformations}
                            setArtTransformations={setArtTransformations}
                            onScrollDown={handleScrollToActions} 
                            handleSaveArt={handleSaveArt}
                            isGenerating={isGenerating}
                        />
                    </div>
                </div>
            </div>
            <div ref={finalActionsRef} className="mt-8 pt-8 border-t">
                 <Button onClick={handleGoToQuote} size="lg" className="w-full" disabled={isGenerating}>
                    Ir para Orçamento <ArrowLeft className="ml-2 -rotate-180" />
                </Button>
            </div>
        </div>
    );
}
