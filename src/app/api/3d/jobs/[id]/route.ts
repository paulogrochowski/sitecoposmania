import { NextResponse } from 'next/server';
import { getGenerationStatus } from '@/lib/3d-generation';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    return NextResponse.json(await getGenerationStatus(params.id));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Não foi possível consultar a geração 3D.';
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
