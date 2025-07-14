'use server';

/**
 * @fileOverview This flow analyzes the complexity of a generated art image.
 *
 * - analyzeArtComplexity - Analyzes the art complexity and returns a score.
 * - AnalyzeArtComplexityInput - The input type for analyzeArtComplexity.
 * - AnalyzeArtComplexityOutput - The output type for analyzeArtComplexity.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeArtComplexityInputSchema = z.object({
  artDataUri: z
    .string()
    .describe(
      "The art image as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  description: z
    .string()
    .describe(
      'The description of the event style, or an indication that the user uploaded it.'
    ),
});

export type AnalyzeArtComplexityInput = z.infer<
  typeof AnalyzeArtComplexityInputSchema
>;

const AnalyzeArtComplexityOutputSchema = z.object({
  complexityScore: z
    .number()
    .describe(
      'Uma pontuação representando a complexidade da arte, onde valores mais altos indicam uma arte mais complexa.'
    ),
  reasoning: z
    .string()
    .describe(
      'A justificativa em português para a pontuação de complexidade, incluindo fatores como número de cores, detalhes e resolução.'
    ),
});

export type AnalyzeArtComplexityOutput = z.infer<
  typeof AnalyzeArtComplexityOutputSchema
>;

export async function analyzeArtComplexity(
  input: AnalyzeArtComplexityInput
): Promise<AnalyzeArtComplexityOutput> {
  return analyzeArtComplexityFlow(input);
}

const analyzeArtComplexityPrompt = ai.definePrompt({
  name: 'analyzeArtComplexityPrompt',
  input: {schema: AnalyzeArtComplexityInputSchema},
  output: {schema: AnalyzeArtComplexityOutputSchema},
  prompt: `Você é um crítico de arte especialista em avaliar a complexidade de arte digital.

Você analisará a imagem da arte fornecida e sua descrição para determinar uma pontuação de complexidade.
Se a descrição indicar que o usuário enviou a arte (ex: 'Arte enviada pelo usuário'), foque sua análise apenas no conteúdo da imagem.
Considere fatores como o número de cores, nível de detalhe e resolução da imagem.
Forneça uma justificativa para a pontuação atribuída, em português.

Descrição: {{{description}}}
Art Image: {{media url=artDataUri}}

Por favor, forneça uma pontuação de complexidade entre 1 (mais simples) e 10 (mais complexa) e sua justificativa.
`,
});

const analyzeArtComplexityFlow = ai.defineFlow(
  {
    name: 'analyzeArtComplexityFlow',
    inputSchema: AnalyzeArtComplexityInputSchema,
    outputSchema: AnalyzeArtComplexityOutputSchema,
  },
  async input => {
    const {output} = await analyzeArtComplexityPrompt(input);
    return output!;
  }
);
