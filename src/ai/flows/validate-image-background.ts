'use server';

/**
 * @fileOverview This flow validates if an image has a transparent or solid white background.
 *
 * - validateImageBackground - Analyzes the image and returns validation status.
 * - ValidateImageBackgroundInput - The input type for validateImageBackground.
 * - ValidateImageBackgroundOutput - The output type for validateImageBackground.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ValidateImageBackgroundInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "The image to validate, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});

export type ValidateImageBackgroundInput = z.infer<
  typeof ValidateImageBackgroundInputSchema
>;

const ValidateImageBackgroundOutputSchema = z.object({
  hasValidBackground: z
    .boolean()
    .describe(
      'True if the image background is either transparent or solid white. False otherwise.'
    ),
  reasoning: z
    .string()
    .describe(
      'Uma breve explicação em português para o resultado da validação. Por exemplo, "A imagem possui fundo transparente." ou "A imagem possui um fundo colorido."'
    ),
});

export type ValidateImageBackgroundOutput = z.infer<
  typeof ValidateImageBackgroundOutputSchema
>;

export async function validateImageBackground(
  input: ValidateImageBackgroundInput
): Promise<ValidateImageBackgroundOutput> {
  return validateImageBackgroundFlow(input);
}

const validateImageBackgroundPrompt = ai.definePrompt({
  name: 'validateImageBackgroundPrompt',
  input: {schema: ValidateImageBackgroundInputSchema},
  output: {schema: ValidateImageBackgroundOutputSchema},
  prompt: `Você é um especialista em análise de imagens. Sua tarefa é determinar se o fundo da imagem fornecida é transparente ou branco sólido.

Analise a seguinte imagem:
{{media url=imageDataUri}}

Responda com 'hasValidBackground: true' se o fundo for inteiramente transparente ou branco sólido.
Responda com 'hasValidBackground: false' se o fundo tiver outras cores, gradientes ou elementos.
Forneça uma justificativa breve para sua decisão em português.`,
});

const validateImageBackgroundFlow = ai.defineFlow(
  {
    name: 'validateImageBackgroundFlow',
    inputSchema: ValidateImageBackgroundInputSchema,
    outputSchema: ValidateImageBackgroundOutputSchema,
  },
  async input => {
    const {output} = await validateImageBackgroundPrompt(input);
    return output!;
  }
);
