import type { GenerationProvider } from './provider';
import type {
  GeneratedModel,
  GenerationJob,
  GenerationResult,
  GenerationStatus,
  JobStatusResponse,
  ProductInput,
} from './types';

const API_BASE = 'https://api.tripo3d.ai/v2/openapi';
const MODEL_VERSION = 'v3.1-20260211';

type TripoOutput = {
  model?: string;
  base_model?: string;
  pbr_model?: string;
  rendered_image?: string;
};

type TripoTask = {
  task_id: string;
  type: string;
  status: 'queued' | 'running' | 'success' | 'failed' | 'banned' | 'expired' | 'cancelled' | 'unknown';
  progress?: number;
  output?: TripoOutput;
  create_time?: number;
};

type TripoEnvelope<T> = {
  code: number;
  data?: T;
  message?: string;
};

function apiKey() {
  const key = process.env.TRIPO_API_KEY;
  if (!key) throw new Error('TRIPO_API_KEY não configurada no servidor.');
  return key;
}

function authHeaders() {
  return { Authorization: `Bearer ${apiKey()}` };
}

async function readJson<T>(response: Response): Promise<TripoEnvelope<T>> {
  const body = await response.json().catch(() => null) as TripoEnvelope<T> | null;
  if (!response.ok) {
    throw new Error(body?.message || `Tripo respondeu HTTP ${response.status}.`);
  }
  if (!body || body.code !== 0 || !body.data) {
    throw new Error(body?.message || 'A Tripo retornou uma resposta inválida.');
  }
  return body;
}

function dataUriToBlob(dataUri: string) {
  const match = /^data:(image\/(?:jpeg|png|webp));base64,([\s\S]+)$/.exec(dataUri);
  if (!match) throw new Error('Uma das imagens não está em um formato compatível com a Tripo.');

  const mime = match[1];
  const buffer = Buffer.from(match[2], 'base64');
  return {
    blob: new Blob([buffer], { type: mime }),
    filename: `siviu-${crypto.randomUUID()}.${mime === 'image/jpeg' ? 'jpg' : mime.split('/')[1]}`,
  };
}

async function uploadImage(dataUri: string) {
  const { blob, filename } = dataUriToBlob(dataUri);
  const form = new FormData();
  form.append('file', blob, filename);

  const response = await fetch(`${API_BASE}/upload/sts`, {
    method: 'POST',
    headers: authHeaders(),
    body: form,
  });

  const body = await readJson<{ image_token: string }>(response);
  if (!body.data?.image_token) throw new Error('A Tripo não retornou o token da imagem.');
  return body.data.image_token;
}

function mapStage(task: TripoTask): GenerationStatus {
  if (task.status === 'success') return 'pronto';
  if (['failed', 'banned', 'expired', 'cancelled', 'unknown'].includes(task.status)) return 'erro';
  if (task.status === 'queued') return 'aguardando_upload';

  const progress = task.progress ?? 0;
  if (progress < 20) return 'processando_imagem';
  if (progress < 50) return 'gerando_malha';
  if (progress < 72) return 'aplicando_textura';
  if (progress < 90) return 'otimizando_modelo';
  return 'gerando_preview';
}

function toIso(seconds?: number) {
  return seconds && seconds > 0 ? new Date(seconds * 1000).toISOString() : new Date().toISOString();
}

function toJob(task: TripoTask): JobStatusResponse {
  const progress = Math.max(0, Math.min(100, Math.round(task.progress ?? 0)));
  const productId = `prod_${task.task_id}`;
  const modelUrl = task.output?.pbr_model || task.output?.model || task.output?.base_model;
  const model = task.status === 'success' && modelUrl
    ? {
        id: `model_${task.task_id}`,
        productId,
        modelUrl,
        thumbnailUrl: task.output?.rendered_image,
        status: 'review' as const,
        polycount: 0,
        engineUsed: 'Tripo H3 · v3.1',
        createdAt: toIso(task.create_time),
      } satisfies GeneratedModel
    : undefined;

  return {
    id: task.task_id,
    productId,
    status: mapStage(task),
    progress: task.status === 'success' ? 100 : progress,
    provider: 'tripo-h3-v3.1',
    providerJobId: task.task_id,
    startedAt: toIso(task.create_time),
    finishedAt: task.status === 'success' ? new Date().toISOString() : undefined,
    errorMessage: mapStage(task) === 'erro'
      ? `A geração 3D terminou com status: ${task.status}.`
      : undefined,
    modelId: model?.id,
    model,
  };
}

async function getTask(taskId: string): Promise<TripoTask> {
  const response = await fetch(`${API_BASE}/task/${encodeURIComponent(taskId)}`, {
    headers: authHeaders(),
    cache: 'no-store',
  });
  const body = await readJson<TripoTask>(response);
  return body.data!;
}

class TripoGenerationProvider implements GenerationProvider {
  async createGenerationJob(input: ProductInput): Promise<GenerationJob> {
    const imageUrls = (input.imageUrls || []).filter(Boolean).slice(0, 4);
    if (!imageUrls.length) throw new Error('Adicione pelo menos uma foto do produto.');

    const tokens = await Promise.all(imageUrls.map(uploadImage));
    const common = {
      model_version: MODEL_VERSION,
      enable_image_autofix: true,
      texture: true,
      pbr: true,
      texture_quality: 'standard',
      geometry_quality: 'standard',
      orientation: 'align_image',
    };

    const payload = tokens.length === 1
      ? {
          type: 'image_to_model',
          file: { type: 'image', file_token: tokens[0] },
          ...common,
        }
      : {
          type: 'multiview_to_model',
          files: Array.from({ length: 4 }, (_, index) => ({
            type: 'image',
            ...(tokens[index] ? { file_token: tokens[index] } : {}),
          })),
          ...common,
        };

    const response = await fetch(`${API_BASE}/task`, {
      method: 'POST',
      headers: {
        ...authHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const body = await readJson<{ task_id: string }>(response);
    const taskId = body.data?.task_id;
    if (!taskId) throw new Error('A Tripo não retornou o identificador da tarefa.');

    return {
      id: taskId,
      productId: `prod_${taskId}`,
      status: 'processando_imagem',
      progress: 1,
      provider: 'tripo-h3-v3.1',
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

export const tripoGenerationProvider: GenerationProvider = new TripoGenerationProvider();
