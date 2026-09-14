import { NextResponse } from 'next/server';
import { getGenerationStatus } from '@/lib/3d-generation';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try { return NextResponse.json(await getGenerationStatus(params.id)); }
  catch { return NextResponse.json({ error: 'Processo não encontrado.' }, { status: 404 }); }
}
