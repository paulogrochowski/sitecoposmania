import type { GenerationProvider } from './provider';
import type {
  GeneratedModel,
  GenerationJob,
  GenerationResult,
  GenerationStatus,
  JobStatusResponse,
  ProductInput,
} from './types';

const API_BASE = 'https://api.meshy.ai/openapi/v1/multi-image-to-3d';

type MeshyTask = {
  id: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'SUCCEEDED' | 'FAILED' | 'CANCELED';
  progress?: number;
  model_urls?: {
    glb?: string;
    usdz?: string;
  };
  thumbnail_url?: string;
  task_error?: { message?: string };
  created_at?: number;
  started_at?: number;
  finished_at?: number;
};

function apiKey() {
  const key = process.env.MESHY_API_KEY;
  if (!key) throw new Error('MESHY_API_KEY não configurada no servidor.');
  return key;
}

function headers() {
  return {
    Authorization: `Bearer ${apiKey()}`,
    'Content-Type': 'application/json',
  };
}

function toIso(timestamp?: number) {
  return timestamp && timestamp > 0 ? new Date(timestamp).toISOString() : new Date().toISOString();
}

function mapStage(status: MeshyTask['status'], progress = 0): GenerationStatus {
  if (status === 'SUCCEEDED') return 'pronto';
  if (status === 'FAILED' || status === 'CANCELED') return 'erro';
  if (status === 'PENDING') return 'aguardando_upload';
  if (progress < 20) return 'processando_imagem';
  if (progress < 50) return 'gerando_malha';
  if (progress < 72) return 'aplicando_textura';
  if (progress < 90) return 'otimizando_modelo';
  return 'gerando_preview';
}

async function readError(response: Response) {
  try {
    const body = await response.json() as { message?: string; error?: string; detail?: string };
    return body.message || body.error || body.detail || `Meshy respondeu HTTP ${response.status}.`;
  } catch {
    return `Meshy respondeu HTTP ${response.status}.`;
  }
}

async function getTask(taskId: string): Promise<MeshyTask> {
  const response = await fetch(`${API_BASE}/${encodeURIComponent(taskId)}`, {
    headers: headers(),
    cache: 'no-store',
  });
  if (!response.ok) throw new Error(await readError(response));
  return response.json() as Promise<MeshyTask>;
}

function toJob(task: MeshyTask): JobStatusResponse {
  const progress = Math.max(0, Math.min(100, Math.round(task.progress ?? 0)));
  const productId = `prod_${task.id}`;
  const model = task.status === 'SUCCEEDED' && task.model_urls?.glb
    ? {
        id: `model_${task.id}`,
        productId,
        modelUrl: task.model_urls.glb,
        usdzUrl: task.model_urls.usdz,
        thumbnailUrl: task.thumbnail_url,
        status: 'review' as const,
        polycount: 0,
        engineUsed: 'Meshy 7 · Multi-Image to 3D',
        createdAt: toIso(task.finished_at || task.created_at),
      } satisfies GeneratedModel
    : undefined;

  const job: JobStatusResponse = {
    id: task.id,
    productId,
    status: mapStage(task.status, progress),
    progress: task.status === 'SUCCEEDED' ? 100 : progress,
    provider: 'meshy-multi-image-v1',
    providerJobId: task.id,
    startedAt: toIso(task.started_at || task.created_at),
    finishedAt: task.finished_at ? toIso(task.finished_at) : undefined,
    errorMessage: task.status === 'FAILED' || task.status === 'CANCELED'
      ? task.task_error?.message || 'A geração do modelo 3D falhou.'
      : undefined,
    modelId: model?.id,
    model,
  };
  return job;
}

class MeshyGenerationProvider implements GenerationProvider {
  async createGenerationJob(input: ProductInput): Promise<GenerationJob> {
    const imageUrls = (input.imageUrls || []).filter(Boolean).slice(0, 4);
    if (!imageUrls.length) throw new Error('Nenhuma imagem preparada para a geração 3D.');

    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({
        image_urls: imageUrls,
        ai_model: 'latest',
        should_texture: true,
        enable_pbr: true,
        target_formats: ['glb', 'usdz'],
        alpha_thumbnail: true,
      }),
    });

    if (!response.ok) throw new Error(await readError(response));
    const body = await response.json() as { result?: string };
    if (!body.result) throw new Error('A Meshy não retornou o identificador da tarefa.');

    const taskId = body.result;
    return {
      id: taskId,
      productId: `prod_${taskId}`,
      status: 'processando_imagem',
      progress: 1,
      provider: 'meshy-multi-image-v1',
      providerJobId: taskId,
      startedAt: new Date().toISOString(),
    };
  }

  async getGenerationStatus(jobId: string): Promise<JobStatusResponse> {
    return toJob(await getTask(jobId));
  }

  async getGenerationResult(jobId: string): Promise<GenerationResult | null> {
    const job = await this.getGenerationStatus(jobId);
    return job.status === 'pronto' && job.model ? { job, model: job.model } : null;
  }
}

export const meshyGenerationProvider: GenerationProvider = new MeshyGenerationProvider();
