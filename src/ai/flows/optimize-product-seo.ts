'use server';

/**
 * @fileOverview This flow optimizes product details for search engines (SEO).
 *
 * - optimizeProductSeo - Analyzes product info and returns SEO-optimized text.
 * - OptimizeProductSeoInput - The input type for the flow.
 * - OptimizeProductSeoOutput - The output type for the flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OptimizeProductSeoInputSchema = z.object({
  productName: z.string().describe('The name of the product.'),
  productSummary: z.string().describe('A short summary of the product.'),
  productDescription: z.string().describe('The full description of the product.'),
});

export type OptimizeProductSeoInput = z.infer<
  typeof OptimizeProductSeoInputSchema
>;

const OptimizeProductSeoOutputSchema = z.object({
  seoTitle: z
    .string()
    .describe(
      'A title tag optimized for search engines, under 60 characters.'
    ),
  metaDescription: z
    .string()
    .describe(
      'A meta description optimized for search engines, under 160 characters.'
    ),
  keywords: z
    .string()
    .describe(
      'A comma-separated list of relevant keywords for the product.'
    ),
});

export type OptimizeProductSeoOutput = z.infer<
  typeof OptimizeProductSeoOutputSchema
>;

export async function optimizeProductSeo(
  input: OptimizeProductSeoInput
): Promise<OptimizeProductSeoOutput> {
  return optimizeProductSeoFlow(input);
}

const optimizeProductSeoPrompt = ai.definePrompt({
  name: 'optimizeProductSeoPrompt',
  input: {schema: OptimizeProductSeoInputSchema},
  output: {schema: OptimizeProductSeoOutputSchema},
  prompt: `Você é um especialista em SEO para e-commerce. Analise os detalhes do produto a seguir e gere um título de SEO, uma meta descrição e palavras-chave otimizadas para atrair clientes em buscadores como o Google.

Nome do Produto: {{{productName}}}
Resumo: {{{productSummary}}}
Descrição Completa: {{{productDescription}}}

Seu objetivo é criar textos que sejam atraentes para os clientes e que utilizem termos de busca relevantes para copos personalizados para festas e eventos.
O título deve ter no máximo 60 caracteres.
A meta descrição deve ter no máximo 160 caracteres e ser convidativa ao clique.
As palavras-chave devem ser uma lista separada por vírgulas.
`,
});

const optimizeProductSeoFlow = ai.defineFlow(
  {
    name: 'optimizeProductSeoFlow',
    inputSchema: OptimizeProductSeoInputSchema,
    outputSchema: OptimizeProductSeoOutputSchema,
  },
  async input => {
    const {output} = await optimizeProductSeoPrompt(input);
    return output!;
  }
);
