import { tripoGenerationProvider } from './tripo-provider';
import { meshyGenerationProvider } from './meshy-provider';
import { mockGenerationProvider } from './mock-provider';
import type { ProductInput } from './types';

/**
 * Application-facing generation service.
 *
 * Prefer Tripo when TRIPO_API_KEY is configured because its API includes an
 * introductory free-credit allowance. Meshy remains supported, and the mock
 * provider keeps previews/local development working without credentials.
 */
const generationProvider = process.env.TRIPO_API_KEY
  ? tripoGenerationProvider
  : process.env.MESHY_API_KEY
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
