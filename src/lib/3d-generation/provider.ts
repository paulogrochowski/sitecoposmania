import type { GenerationJob, GenerationResult, JobStatusResponse, ProductInput } from './types';

/** Contract implemented by image-to-3D vendors. Swap MockGenerationProvider for a real adapter. */
export interface GenerationProvider {
  createGenerationJob(input: ProductInput): Promise<GenerationJob>;
  getGenerationStatus(jobId: string): Promise<JobStatusResponse>;
  getGenerationResult(jobId: string): Promise<GenerationResult | null>;
}
