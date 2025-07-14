
'use server';
/**
 * @fileOverview Generates a promotional ad creative from a text prompt.
 * - generateAdCreative - Generates an image.
 * - GenerateAdCreativeInput - Input schema.
 * - GenerateAdCreativeOutput - Output schema.
 */
import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAdCreativeInputSchema = z.object({
  prompt: z.string().describe('A detailed description of the ad creative to generate.'),
});
export type GenerateAdCreativeInput = z.infer<typeof GenerateAdCreativeInputSchema>;

const GenerateAdCreativeOutputSchema = z.object({
  imageUrl: z
    .string()
    .describe('The generated ad image as a data URI.'),
});
export type GenerateAdCreativeOutput = z.infer<typeof GenerateAdCreativeOutputSchema>;

export async function generateAdCreative(input: GenerateAdCreativeInput): Promise<GenerateAdCreativeOutput> {
  return generateAdCreativeFlow(input);
}

const generateAdCreativeFlow = ai.defineFlow(
  {
    name: 'generateAdCreativeFlow',
    inputSchema: GenerateAdCreativeInputSchema,
    outputSchema: GenerateAdCreativeOutputSchema,
  },
  async (input) => {
    const fullPrompt = `Crie um banner de marketing vibrante e chamativo com base nesta descrição: "${input.prompt}". A imagem deve ser visualmente atraente para anúncios em redes sociais. Garanta que o assunto principal esteja centralizado e que haja algum espaço para sobreposições de texto. O estilo deve ser limpo e profissional. O resultado não deve conter nenhum texto.`;
    
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: fullPrompt,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media?.url) {
      throw new Error('A IA falhou ao gerar a imagem do anúncio.');
    }

    return {imageUrl: media.url};
  }
);
