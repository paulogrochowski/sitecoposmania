export const JOB_STAGES = [
  'aguardando_upload',
  'processando_imagem',
  'gerando_malha',
  'aplicando_textura',
  'otimizando_modelo',
  'gerando_preview',
  'pronto',
] as const;

export type GenerationStatus = (typeof JOB_STAGES)[number] | 'erro';

export interface ProductInput {
  name: string;
  category: string;
  width: number;
  height: number;
  depth: number;
  unit: 'cm' | 'mm' | 'm';
  material: string;
  color: string;
  notes: string;
  objectTypes: string[];
  /** IDs used by the legacy/local upload flow. */
  imageIds?: string[];
  /** Compressed image data URIs used by cloud image-to-3D providers. */
  imageUrls?: string[];
}

export interface Product extends ProductInput {
  id: string;
  createdAt: string;
}

export interface ProductImage {
  id: string;
  productId?: string;
  imageUrl: string;
  name: string;
  sortOrder: number;
  createdAt: string;
}

export interface GeneratedModel {
  id: string;
  productId: string;
  modelUrl: string;
  usdzUrl?: string;
  thumbnailUrl?: string;
  status: 'review' | 'approved' | 'published' | 'rejected';
  polycount: number;
  engineUsed: string;
  createdAt: string;
}

export interface GenerationJob {
  id: string;
  productId: string;
  status: GenerationStatus;
  progress: number;
  provider: string;
  providerJobId: string;
  startedAt: string;
  finishedAt?: string;
  errorMessage?: string;
  modelId?: string;
}

export interface JobStatusResponse extends GenerationJob {
  model?: GeneratedModel;
}

export interface GenerationResult {
  job: GenerationJob;
  model: GeneratedModel;
}
