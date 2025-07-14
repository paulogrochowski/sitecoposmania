
'use client';

import CupPreview3D from '@/components/cup-preview-3d';
import type { CupModel, GeneratedArt, ArtTransformations } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from './ui/button';
import { ChevronDown, Download } from 'lucide-react';
import { Label } from './ui/label';
import { Slider } from './ui/slider';


interface PreviewCardProps {
    cupModel: CupModel;
    art: GeneratedArt | null;
    onScrollDown?: () => void;
    showScrollDownButton?: boolean;
    handleSaveArt: () => void;
    isGenerating: boolean;
}

export function PreviewCard({ 
    cupModel, 
    art, 
    onScrollDown, 
    showScrollDownButton = true,
    handleSaveArt,
    isGenerating
}: PreviewCardProps) {
    
    // Simplificado - a lógica de transformação será movida ou removida
    const artTransformations: ArtTransformations = {
        scale: [1, 0.5],
        position: [0, 0.1],
        rotation: 0,
    };
    
    return (
        <div className="relative">
            <Card className="overflow-hidden">
                <CardHeader>
                    <CardTitle>Pré-visualização do Copo</CardTitle>
                    <CardDescription>Interaja com o modelo 3D para ver todos os ângulos.</CardDescription>
                </CardHeader>
                <CardContent className="p-0 h-[400px] md:h-[500px] checkerboard">
                    <CupPreview3D 
                        cupModel={cupModel} 
                        art={art} 
                        modelUrl={null} // O modelo vem do cupModel
                    />
                </CardContent>
                 {art && (
                    <CardFooter className="flex-col items-start gap-4 p-4 pt-4 border-t">
                        {/* A edição da arte foi simplificada/removida para o escopo atual */}
                        <div className="w-full pt-2">
                            <Button variant="outline" className="w-full" onClick={handleSaveArt} disabled={isGenerating || !art?.imageUrl || art.imageUrl.startsWith('data:image/gif')}>
                                <Download className="mr-2 h-4 w-4" />
                                Salvar Arte
                            </Button>
                        </div>
                    </CardFooter>
                )}
            </Card>
            {showScrollDownButton && onScrollDown && (
                <Button
                    variant="secondary"
                    size="icon"
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 rounded-full h-12 w-12 shadow-lg animate-bounce"
                    onClick={onScrollDown}
                    aria-label="Rolar para baixo"
                >
                    <ChevronDown className="h-8 w-8" />
                </Button>
            )}
        </div>
    );
}
