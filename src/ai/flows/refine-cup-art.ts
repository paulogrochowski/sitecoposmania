
// src/ai/flows/refine-cup-art.ts
'use server';
/**
 * @fileOverview This file defines a Genkit flow for refining AI-generated cup art based on user instructions.
 *
 * - refineCupArt - The main function to refine the cup art.
 * - RefineCupArtInput - The input type for the refineCupArt function.
 * - RefineCupArtOutput - The output type for the refineCupArt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RefineCupArtInputSchema = z.object({
  baseImageDataUri: z
    .string()
    .describe(
      "The base image of the cup art to refine, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  refinementInstructions: z.string().describe('Instructions on how to refine the cup art.'),
});
export type RefineCupArtInput = z.infer<typeof RefineCupArtInputSchema>;

const RefineCupArtOutputSchema = z.object({
  refinedImageDataUri: z
    .string()
    .describe(
      "The refined image of the cup art, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type RefineCupArtOutput = z.infer<typeof RefineCupArtOutputSchema>;

export async function refineCupArt(input: RefineCupArtInput): Promise<RefineCupArtOutput> {
  return refineCupArtFlow(input);
}

const refineCupArtFlow = ai.defineFlow(
  {
    name: 'refineCupArtFlow',
    inputSchema: RefineCupArtInputSchema,
    outputSchema: RefineCupArtOutputSchema,
  },
  async input => {
    const fullInstructions = `Refine a imagem com base nas seguintes instruções: "${input.refinementInstructions}".`;

    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: [
        {media: {url: input.baseImageDataUri}},
        {text: fullInstructions},
      ],
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media?.url) {
      throw new Error('A IA falhou ao refinar a imagem.');
    }

    return {refinedImageDataUri: media.url};
  }
);
