'use server';
/**
 * @fileOverview Generates an image from a text prompt.
 * - generateImage - Generates an image.
 * - GenerateImageInput - Input schema.
 * - GenerateImageOutput - Output schema.
 */
import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const GenerateImageInputSchema = z.object({
  prompt: z.string().describe('A detailed description of the image to generate.'),
});
export type GenerateImageInput = z.infer<typeof GenerateImageInputSchema>;

export const GenerateImageOutputSchema = z.object({
  imageUrl: z
    .string()
    .describe('The generated image as a data URI.'),
});
export type GenerateImageOutput = z.infer<typeof GenerateImageOutputSchema>;

export async function generateImage(input: GenerateImageInput): Promise<GenerateImageOutput> {
  return generateImageFlow(input);
}

const generateImageFlow = ai.defineFlow(
  {
    name: 'generateImageFlow',
    inputSchema: GenerateImageInputSchema,
    outputSchema: GenerateImageOutputSchema,
  },
  async (input) => {
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: input.prompt,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media?.url) {
      throw new Error('The AI failed to generate an image.');
    }

    return {imageUrl: media.url};
  }
);
