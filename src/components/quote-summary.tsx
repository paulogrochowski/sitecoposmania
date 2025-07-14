
'use client';
import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import type { OrderDetails, CupModel } from '@/lib/types';
import Image from 'next/image';
import { DEGRADE_HEX_COLORS, RIM_COLORS } from '@/lib/cup-data';

interface QuoteSummaryProps {
  initialDetails: Omit<OrderDetails, 'quantity' | 'isUrgent' | 'total'>;
  onFinalize: (details: OrderDetails) => void;
  onBack: () => void;
}

const URGENCY_MULTIPLIER = 1.25;
const COMPLEXITY_PRICE_PER_POINT = 0.15;
const SHIPPING_COST = 15.0;

export function QuoteSummary({ initialDetails, onFinalize, onBack }: QuoteSummaryProps) {
  const [quantity, setQuantity] = useState(100);
  const [isUrgent, setIsUrgent] = useState(false);
  const [total, setTotal] = useState(0);
  
  const cup = initialDetails.cupModel;
  const art = initialDetails.art;

  useEffect(() => {
    const artPrice = initialDetails.artComplexity.score * COMPLEXITY_PRICE_PER_POINT;
    const baseTotal = (cup.basePrice + artPrice) * quantity;
    const urgencyCost = isUrgent ? baseTotal * (URGENCY_MULTIPLIER - 1) : 0;
    const finalTotal = baseTotal + urgencyCost + SHIPPING_COST;
    setTotal(finalTotal);
  }, [quantity, isUrgent, initialDetails, cup]);
  
  const handleFinalize = () => {
    onFinalize({
      ...initialDetails,
      quantity,
      isUrgent,
      total,
    });
  }
  
    const rimColorHex = RIM_COLORS[cup.rimColor!] || 'transparent';

    const overlayStyle: React.CSSProperties = useMemo(() => {
        const degradeColorHex = cup.degradeColor ? DEGRADE_HEX_COLORS[cup.degradeColor] : null;
        
        const style: React.CSSProperties = {
            WebkitMaskImage: `url(${cup.svgMaskUrl})`,
            maskImage: `url(${cup.svgMaskUrl})`,
            WebkitMaskSize: 'contain',
            maskSize: 'contain',
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
            WebkitMaskPosition: 'center',
            maskPosition: 'center',
        };

        if (degradeColorHex && cup.degradePosition && cup.degradePosition !== 'Nenhum') {
            const direction = cup.degradePosition === 'Cima' ? 'to bottom' : 'to top';
            const baseColor = cup.opacityType === 'Transparente' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.5)';
            style.background = `linear-gradient(${direction}, ${degradeColorHex}, ${baseColor})`;
        } else {
            style.backgroundColor = cup.colorHex;
            style.opacity = cup.opacityType === 'Transparente' ? 0.6 : 1.0;
        }
        return style;
    }, [cup]);


  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
            <CardTitle className="font-headline text-3xl">Último Passo: Revise seu Pedido</CardTitle>
            <CardDescription>Confirme os detalhes e finalize para enviar seu pedido.</CardDescription>
        </div>
        <Button variant="outline" onClick={onBack}>Voltar para Edição</Button>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
        <div className="space-y-6">
          <h3 className="font-bold">Itens do Pedido</h3>
           {/* Cup Details */}
          <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
             <div className="relative w-24 h-36 rounded-md overflow-hidden border bg-white shadow-inner shrink-0">
                <Image src={cup.imageUrl} alt={cup.name} fill className="object-contain" />
                <div className="absolute inset-0 mix-blend-multiply" style={overlayStyle} />
                 <div
                    className="absolute w-full h-full"
                    style={{
                        borderColor: rimColorHex,
                        borderTopWidth: '15px',
                        WebkitMaskImage: `url(${cup.svgMaskUrl})`,
                        maskImage: `url(${cup.svgMaskUrl})`,
                    }}
                >
                </div>
            </div>

            <div>
              <h3 className="font-bold">{cup.name}</h3>
              {cup.opacityType && (
                <p className="text-sm text-muted-foreground">{cup.opacityType}</p>
              )}
               {cup.degradeColor && cup.degradeColor !== 'Nenhum' && (
                <p className="text-sm text-muted-foreground">Degradê: {cup.degradeColor} ({cup.degradePosition})</p>
              )}
              {cup.rimColor && cup.rimColor !== 'Nenhuma' && (
                <p className="text-sm text-muted-foreground">Borda: {cup.rimColor}</p>
              )}
            </div>
          </div>

          {/* Art Details */}
          {art.id !== 'no-art' && (
            <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
                <div className="relative w-24 h-24 rounded-md overflow-hidden border bg-white shadow-inner shrink-0 checkerboard">
                    <Image src={art.imageUrl} alt="Arte escolhida" fill className="object-contain" />
                </div>
                 <div>
                  <h3 className="font-bold">Arte Personalizada</h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-3"><strong>Descrição:</strong> {initialDetails.eventDescription}</p>
                </div>
            </div>
          )}
          
          <Separator />
          <div className="space-y-4">
            <div>
              <Label htmlFor="quantity" className="flex justify-between items-center mb-2">
                <span>Quantidade</span>
                <span className="text-primary font-bold text-lg">{quantity} unidades</span>
              </Label>
              <Slider
                id="quantity"
                min={10}
                max={500}
                step={10}
                value={[quantity]}
                onValueChange={(value) => setQuantity(value[0])}
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <Label htmlFor="urgency">Pedido Urgente</Label>
                <p className="text-xs text-muted-foreground">
                  Receba seu pedido mais rápido (Taxa de {((URGENCY_MULTIPLIER-1)*100).toFixed(0)}%)
                </p>
              </div>
              <Switch id="urgency" checked={isUrgent} onCheckedChange={setIsUrgent} />
            </div>
          </div>
        </div>
        <div className="bg-secondary/50 rounded-lg p-6 space-y-4 flex flex-col">
           <h3 className="font-bold text-lg">Resumo do Orçamento</h3>
           <div className="space-y-2 flex-1">
            <div className="flex justify-between text-sm"><span>Copo ({cup.name})</span><span>R$ {cup.basePrice.toFixed(2)} / un.</span></div>
            <div className="flex justify-between text-sm"><span>Complexidade da Arte ({initialDetails.artComplexity.score}/10)</span><span>R$ {(initialDetails.artComplexity.score * COMPLEXITY_PRICE_PER_POINT).toFixed(2)} / un.</span></div>
            <div className="flex justify-between text-sm"><span>Quantidade</span><span>x{quantity}</span></div>
            {isUrgent && <div className="flex justify-between text-sm text-accent-foreground/80"><span>Taxa de Urgência</span><span>+ R$ {(((cup.basePrice + initialDetails.artComplexity.score * COMPLEXITY_PRICE_PER_POINT) * quantity) * (URGENCY_MULTIPLIER - 1)).toFixed(2)}</span></div>}
            <div className="flex justify-between text-sm"><span>Frete</span><span>R$ {SHIPPING_COST.toFixed(2)}</span></div>
           </div>
           <Separator />
           <div className="flex justify-between items-center">
            <span className="font-bold text-xl">Total</span>
            <span className="font-bold text-2xl text-primary">R$ {total.toFixed(2).replace('.', ',')}</span>
           </div>
           <div className="mt-4">
            <Button onClick={handleFinalize} size="lg" className="w-full">
                Finalizar Compra e Enviar Pedido
            </Button>
           </div>
        </div>
      </CardContent>
    </Card>
  );
}
