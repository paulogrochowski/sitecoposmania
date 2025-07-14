import { z } from 'zod';

export interface ArtTransformations {
  scale: [number, number]; // [width, height]
  position: [number, number]; // [x, y]
  rotation: number; // degrees
}

export interface CupModel {
  id: string;
  name: string;
  imageUrl: string;
  modelUrl?: string; // Tornando opcional, pois nem todo produto terá
  svgMaskUrl: string;
  basePrice: number;
  'data-ai-hint'?: string;
  colorName?: string;
  colorHex?: string;
  opacityType?: 'Fosco' | 'Transparente';
  rimColor?: 'Nenhuma' | 'Dourado' | 'Prata' | 'Rosa Gold';
  degradeColor?: string;
  degradePosition?: 'Nenhum' | 'Cima' | 'Baixo';
  printableArea?: {
    widthPercent: number;
    heightPercent: number;
    width_mm: number;
    height_mm: number;
  };
}

export interface GeneratedArt {
  id: string;
  imageUrl: string;
  prompt: string;
  transformations?: ArtTransformations;
}

export interface OrderDetails {
  cupModel: CupModel;
  eventDescription: string;
  art: GeneratedArt;
  artComplexity: {
    score: number;
    reasoning: string;
  };
  quantity: number;
  isUrgent: boolean;
  total: number;
}


// Schema and types for convert-to-glb flow
export const ConvertToGlbInputSchema = z.object({
  modelDataUri: z
    .string()
    .describe(
      "The 3D model file to convert, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
   sourceFileName: z.string().describe('The original filename of the model, including its extension (e.g., "myModel.dae").'),
});
export type ConvertToGlbInput = z.infer<typeof ConvertToGlbInputSchema>;

export const ConvertToGlbOutputSchema = z.object({
  glbDataUri: z
    .string()
    .describe(
      "The converted GLB model, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ConvertToGlbOutput = z.infer<typeof ConvertToGlbOutputSchema>;
