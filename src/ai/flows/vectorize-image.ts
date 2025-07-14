
'use server';
/**
 * @fileOverview This file defines a Genkit flow for vectorizing an image.
 *
 * - vectorizeImage - The main function to vectorize an image.
 * - VectorizeImageInput - The input type for the vectorizeImage function.
 * - VectorizeImageOutput - The output type for the vectorizeImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VectorizeImageInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "The source image to vectorize, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type VectorizeImageInput = z.infer<typeof VectorizeImageInputSchema>;

const VectorizeImageOutputSchema = z.object({
  vectorizedImageDataUri: z
    .string()
    .describe(
      "The vectorized image, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type VectorizeImageOutput = z.infer<typeof VectorizeImageOutputSchema>;

export async function vectorizeImage(input: VectorizeImageInput): Promise<VectorizeImageOutput> {
  return vectorizeImageFlow(input);
}

const vectorizeImageFlow = ai.defineFlow(
  {
    name: 'vectorizeImageFlow',
    inputSchema: VectorizeImageInputSchema,
    outputSchema: VectorizeImageOutputSchema,
  },
  async input => {
    const instruction = 'Converta esta imagem em uma arte vetorial com cores limpas. A imagem deve parecer um ícone ou clipart, simplificando os detalhes, mas mantendo a essência do original.';

    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: [{media: {url: input.imageDataUri}}, {text: instruction}],
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media?.url) {
      throw new Error('A IA falhou ao vetorizar a imagem.');
    }

    return {vectorizedImageDataUri: media.url};
  }
);
