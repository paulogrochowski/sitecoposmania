
'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { handleShippingCalculation } from '@/app/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Loader2, Rocket } from 'lucide-react';

interface ShippingResult {
    cost: number;
    time: string;
}

export function ShippingCalculator() {
    const [cep, setCep] = useState('');
    const [isCalculating, startCalculation] = useTransition();
    const [result, setResult] = useState<ShippingResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleCalculate = async () => {
        setError(null);
        setResult(null);
        startCalculation(async () => {
            const response = await handleShippingCalculation(cep);
            if (response.success) {
                setResult({ cost: response.shippingCost, time: response.deliveryTime });
            } else {
                setError(response.error);
            }
            setIsDialogOpen(true);
        });
    };

    return (
        <>
            <Card className="mt-12 bg-card/50">
                <CardHeader className="text-center">
                    <Rocket className="mx-auto h-10 w-10 text-primary mb-2" />
                    <CardTitle className="font-headline text-2xl">Calcular Frete e Prazo</CardTitle>
                    <CardDescription>Veja uma estimativa para sua localidade.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex w-full max-w-sm items-center space-x-2 mx-auto">
                        <Input 
                            type="text" 
                            placeholder="Digite seu CEP" 
                            value={cep}
                            onChange={(e) => setCep(e.target.value)}
                            maxLength={9}
                        />
                        <Button type="submit" onClick={handleCalculate} disabled={isCalculating || cep.length < 8}>
                            {isCalculating ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Calcular'}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Resultado do Frete</AlertDialogTitle>
                        <AlertDialogDescription>
                            Estimativa para o CEP: {cep}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    {isCalculating && <div className="flex justify-center py-4"><Loader2 className="h-6 w-6 animate-spin" /></div>}
                    {error && <p className="text-destructive">{error}</p>}
                    {result && (
                        <div className="space-y-2">
                           <p><strong>Custo:</strong> R$ {result.cost.toFixed(2).replace('.', ',')}</p>
                           <p><strong>Prazo de Entrega:</strong> {result.time}</p>
                           <p className="text-xs text-muted-foreground mt-2">Este é um valor estimado. O valor final será calculado no checkout.</p>
                        </div>
                    )}
                    <AlertDialogFooter>
                        <AlertDialogAction>Fechar</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
