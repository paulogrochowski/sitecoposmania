
'use server';
/**
 * @fileOverview Optimizes ad copy for a given product.
 * - optimizeAdCopy - Generates ad copy.
 * - OptimizeAdCopyInput - Input schema.
 * - OptimizeAdCopyOutput - Output schema.
 */
import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OptimizeAdCopyInputSchema = z.object({
  productName: z.string().describe('The name of the product.'),
  productDescription: z.string().describe('The description of the product.'),
});
export type OptimizeAdCopyInput = z.infer<typeof OptimizeAdCopyInputSchema>;

const OptimizeAdCopyOutputSchema = z.object({
  headline: z.string().describe('A short, punchy headline (under 40 characters).'),
  body: z.string().describe('Persuasive body text (under 150 characters).'),
  cta: z.string().describe("A strong call-to-action (e.g., 'Compre Agora', 'Personalize o Seu')."),
});
export type OptimizeAdCopyOutput = z.infer<typeof OptimizeAdCopyOutputSchema>;

export async function optimizeAdCopy(input: OptimizeAdCopyInput): Promise<OptimizeAdCopyOutput> {
  return optimizeAdCopyFlow(input);
}

const optimizeAdCopyPrompt = ai.definePrompt({
    name: 'optimizeAdCopyPrompt',
    input: { schema: OptimizeAdCopyInputSchema },
    output: { schema: OptimizeAdCopyOutputSchema },
    prompt: `Você é um especialista em marketing digital especializado em copywriting de resposta direta. Com base nos detalhes do produto abaixo, crie um anúncio atraente.

Nome do Produto: {{{productName}}}
Descrição: {{{productDescription}}}

Gere um título curto e impactante (menos de 40 caracteres), um texto de corpo persuasivo (menos de 150 caracteres) e uma forte chamada para ação (como 'Compre Agora', 'Personalize o Seu', etc.).
A resposta deve ser em português.`
});


const optimizeAdCopyFlow = ai.defineFlow(
  {
    name: 'optimizeAdCopyFlow',
    inputSchema: OptimizeAdCopyInputSchema,
    outputSchema: OptimizeAdCopyOutputSchema,
  },
  async (input) => {
    const {output} = await optimizeAdCopyPrompt(input);
    return output!;
  }
);
