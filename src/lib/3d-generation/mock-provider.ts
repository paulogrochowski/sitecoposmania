import { makeId, store } from './store';
import { JOB_STAGES, type GeneratedModel, type GenerationJob, type GenerationResult, type JobStatusResponse, type Product, type ProductInput } from './types';
import type { GenerationProvider } from './provider';

const STAGE_DURATION = 1700;

class MockGenerationProvider implements GenerationProvider {
  async createGenerationJob(input: ProductInput): Promise<GenerationJob> {
    const product: Product = { ...input, id: makeId('prod'), createdAt: new Date().toISOString() };
    store.products.set(product.id, product);
    (input.imageIds || []).forEach((id) => {
      const image = store.images.get(id);
      if (image) store.images.set(id, { ...image, productId: product.id });
    });
    const job: GenerationJob = {
      id: makeId('job'), productId: product.id, status: 'aguardando_upload', progress: 2,
      provider: 'siviu-mock-v1', providerJobId: makeId('mock'), startedAt: new Date().toISOString(),
    };
    store.jobs.set(job.id, job);
    return job;
  }

  async getGenerationStatus(jobId: string): Promise<JobStatusResponse> {
    const job = store.jobs.get(jobId);
    if (!job) throw new Error('Processo não encontrado');
    if (job.status !== 'pronto' && job.status !== 'erro') {
      const elapsed = Date.now() - new Date(job.startedAt).getTime();
      const processStages = JOB_STAGES;
      const index = Math.min(Math.floor(elapsed / STAGE_DURATION), processStages.length - 1);
      job.status = processStages[index];
      job.progress = job.status === 'pronto' ? 100 : Math.min(94, 10 + index * 17 + Math.floor((elapsed % STAGE_DURATION) / 170));
      if (job.status === 'pronto') {
        job.finishedAt = job.finishedAt ?? new Date().toISOString();
        if (!job.modelId) {
          const model: GeneratedModel = {
            id: makeId('model'), productId: job.productId, modelUrl: '/mock/siviu-product.glb',
            status: 'review', polycount: 48320, engineUsed: 'Siviu Neural 3D · Mock v1', createdAt: new Date().toISOString(),
          };
          store.models.set(model.id, model);
          job.modelId = model.id;
        }
      }
      store.jobs.set(job.id, job);
    }
    return { ...job, model: job.modelId ? store.models.get(job.modelId) : undefined };
  }

  async getGenerationResult(jobId: string): Promise<GenerationResult | null> {
    const response = await this.getGenerationStatus(jobId);
    return response.status === 'pronto' && response.model
      ? { job: response, model: response.model }
      : null;
  }
}

export const mockGenerationProvider: GenerationProvider = new MockGenerationProvider();
