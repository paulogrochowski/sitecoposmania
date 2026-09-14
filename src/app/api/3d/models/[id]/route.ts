import { NextResponse } from 'next/server';
import { store } from '@/lib/3d-generation/store';
import type { GeneratedModel } from '@/lib/3d-generation/types';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const model = store.models.get(params.id);
  if (!model) return NextResponse.json({ error: 'Modelo não encontrado.' }, { status: 404 });
  const { action } = await request.json() as { action: 'approve' | 'reject' | 'publish' };
  const status: GeneratedModel['status'] | null = action === 'approve' ? 'approved' : action === 'publish' ? 'published' : action === 'reject' ? 'rejected' : null;
  if (!status) return NextResponse.json({ error: 'Ação inválida.' }, { status: 400 });
  const updated = { ...model, status };
  store.models.set(model.id, updated);
  return NextResponse.json(updated);
}
