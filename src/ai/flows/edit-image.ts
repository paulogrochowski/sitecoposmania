
'use server';
/**
 * @fileOverview Edits an image based on a text instruction.
 * - editImage - Edits an image.
 * - EditImageInput - Input schema.
 * - EditImageOutput - Output schema.
 */
import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const EditImageInputSchema = z.object({
  baseImageDataUri: z
    .string()
    .describe(
      "The base image to edit, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  instruction: z
    .string()
    .describe('A clear instruction on how to edit the image.'),
});
export type EditImageInput = z.infer<typeof EditImageInputSchema>;

export const EditImageOutputSchema = z.object({
  editedImageDataUri: z
    .string()
    .describe(
      "The edited image, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type EditImageOutput = z.infer<typeof EditImageOutputSchema>;

export async function editImage(input: EditImageInput): Promise<EditImageOutput> {
  return editImageFlow(input);
}

const editImageFlow = ai.defineFlow(
  {
    name: 'editImageFlow',
    inputSchema: EditImageInputSchema,
    outputSchema: EditImageOutputSchema,
  },
  async input => {
    const instruction = input.instruction;

    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: [{media: {url: input.baseImageDataUri}}, {text: instruction}],
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media?.url) {
      throw new Error('The AI failed to edit the image.');
    }

    return {editedImageDataUri: media.url};
  }
);
