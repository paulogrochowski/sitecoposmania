import { NextResponse } from 'next/server';
import { store } from '@/lib/3d-generation/store';
import type { GeneratedModel } from '@/lib/3d-generation/types';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json() as {
    action?: 'approve' | 'reject' | 'publish';
    model?: GeneratedModel;
  };

  const status: GeneratedModel['status'] | null = body.action === 'approve'
    ? 'approved'
    : body.action === 'publish'
      ? 'published'
      : body.action === 'reject'
        ? 'rejected'
        : null;

  if (!status) return NextResponse.json({ error: 'Ação inválida.' }, { status: 400 });

  const stored = store.models.get(params.id);
  const source = stored || (body.model?.id === params.id ? body.model : undefined);
  if (!source) return NextResponse.json({ error: 'Modelo não encontrado.' }, { status: 404 });

  const updated: GeneratedModel = { ...source, status };
  store.models.set(updated.id, updated);
  return NextResponse.json(updated);
}
