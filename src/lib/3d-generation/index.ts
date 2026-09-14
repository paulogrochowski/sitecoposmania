import { meshyGenerationProvider } from './meshy-provider';
import { mockGenerationProvider } from './mock-provider';
import type { ProductInput } from './types';

/**
 * Application-facing generation service.
 *
 * Production uses Meshy when MESHY_API_KEY is available. The mock provider is
 * kept as a safe fallback so local development and preview deployments still
 * render the complete flow before credentials are configured.
 */
const generationProvider = process.env.MESHY_API_KEY
  ? meshyGenerationProvider
  : mockGenerationProvider;

export function createGenerationJob(input: ProductInput) {
  return generationProvider.createGenerationJob(input);
}

export function getGenerationStatus(jobId: string) {
  return generationProvider.getGenerationStatus(jobId);
}

export function getGenerationResult(jobId: string) {
  return generationProvider.getGenerationResult(jobId);
}
