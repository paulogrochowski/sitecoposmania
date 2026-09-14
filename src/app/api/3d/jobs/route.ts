import { NextResponse } from 'next/server';
import { createGenerationJob } from '@/lib/3d-generation';
import type { ProductInput } from '@/lib/3d-generation/types';

export async function POST(request: Request) {
  let input: ProductInput;
  try {
    input = await request.json() as ProductInput;
  } catch {
    return NextResponse.json({ error: 'Os dados enviados são inválidos.' }, { status: 400 });
  }

  const imageCount = input.imageUrls?.length || input.imageIds?.length || 0;
  if (!input.name?.trim() || !input.category || imageCount < 1 || imageCount > 4) {
    return NextResponse.json({ error: 'Produto, categoria e de uma a quatro imagens são obrigatórios.' }, { status: 400 });
  }
  if (![input.width, input.height, input.depth].every((value) => Number.isFinite(value) && value > 0)) {
    return NextResponse.json({ error: 'Informe largura, altura e profundidade válidas.' }, { status: 400 });
  }
  if (!['cm', 'mm', 'm'].includes(input.unit)) {
    return NextResponse.json({ error: 'A unidade de medida é inválida.' }, { status: 400 });
  }

  try {
    return NextResponse.json(await createGenerationJob(input), { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Não foi possível iniciar a geração 3D.';
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
