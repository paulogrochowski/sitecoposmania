
'use server';
/**
 * @fileOverview Analyzes a product's marketing quality for SEO and ads.
 * - analyzeMarketingQuality - Performs the analysis.
 * - AnalyzeMarketingQualityInput - Input schema.
 * - AnalyzeMarketingQualityOutput - Output schema.
 */
import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeMarketingQualityInputSchema = z.object({
  productName: z.string().describe('The name of the product.'),
  productDescription: z.string().describe('The description of the product.'),
});
export type AnalyzeMarketingQualityInput = z.infer<typeof AnalyzeMarketingQualityInputSchema>;

const AnalyzeMarketingQualityOutputSchema = z.object({
  seoScore: z.number().min(1).max(10).describe('A score from 1 to 10 for SEO quality.'),
  seoSuggestions: z.string().describe('Actionable suggestions for SEO improvement in Portuguese, formatted as a bulleted list.'),
  adScore: z.number().min(1).max(10).describe('A score from 1 to 10 for paid ad-friendliness.'),
  adSuggestions: z.string().describe('Actionable suggestions for ad copy improvement in Portuguese, formatted as a bulleted list.'),
});
export type AnalyzeMarketingQualityOutput = z.infer<typeof AnalyzeMarketingQualityOutputSchema>;

export async function analyzeMarketingQuality(input: AnalyzeMarketingQualityInput): Promise<AnalyzeMarketingQualityOutput> {
  return analyzeMarketingQualityFlow(input);
}

const analyzeMarketingQualityPrompt = ai.definePrompt({
    name: 'analyzeMarketingQualityPrompt',
    input: { schema: AnalyzeMarketingQualityInputSchema },
    output: { schema: AnalyzeMarketingQualityOutputSchema },
    prompt: `Você é um consultor de e-commerce. Analise as seguintes informações do produto quanto ao seu potencial de marketing.

Nome do Produto: {{{productName}}}
Descrição: {{{productDescription}}}

Forneça duas pontuações (de 1 a 10): uma para a qualidade de SEO e outra para a adequação a anúncios pagos.
Para cada pontuação, forneça uma lista com marcadores de sugestões práticas para melhoria em português. Concentre-se no uso de palavras-chave, clareza e poder de persuasão.`
});

const analyzeMarketingQualityFlow = ai.defineFlow(
  {
    name: 'analyzeMarketingQualityFlow',
    inputSchema: AnalyzeMarketingQualityInputSchema,
    outputSchema: AnalyzeMarketingQualityOutputSchema,
  },
  async (input) => {
    const {output} = await analyzeMarketingQualityPrompt(input);
    return output!;
  }
);
