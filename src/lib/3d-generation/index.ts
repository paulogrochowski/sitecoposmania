import { generationProvider } from './mock-provider';
import type { ProductInput } from './types';

/**
 * Application-facing generation service.
 *
 * To connect a real Image-to-3D API, replace `generationProvider` above with an
 * adapter that implements `GenerationProvider`. Routes and UI do not need to
 * know which vendor is processing the model.
 */
export function createGenerationJob(input: ProductInput) {
  return generationProvider.createGenerationJob(input);
}

export function getGenerationStatus(jobId: string) {
  return generationProvider.getGenerationStatus(jobId);
}

export function getGenerationResult(jobId: string) {
  return generationProvider.getGenerationResult(jobId);
}
