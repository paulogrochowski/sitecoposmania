import type { GeneratedModel, GenerationJob, Product, ProductImage } from './types';

interface MemoryStore {
  products: Map<string, Product>;
  images: Map<string, ProductImage>;
  models: Map<string, GeneratedModel>;
  jobs: Map<string, GenerationJob>;
}

declare global {
  // eslint-disable-next-line no-var
  var siviu3DStore: MemoryStore | undefined;
}

export const store: MemoryStore = globalThis.siviu3DStore ?? {
  products: new Map(), images: new Map(), models: new Map(), jobs: new Map(),
};

// Shared by route modules in this MVP. Replace this adapter with a persistent database in production.
globalThis.siviu3DStore = store;

export const makeId = (prefix: string) => `${prefix}_${crypto.randomUUID()}`;
