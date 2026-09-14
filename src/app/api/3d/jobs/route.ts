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
  if (!input.name?.trim() || !input.category || !input.imageIds?.length || input.imageIds.length > 8) {
    return NextResponse.json({ error: 'Produto, categoria e de uma a oito imagens são obrigatórios.' }, { status: 400 });
  }
  if (![input.width, input.height, input.depth].every((value) => Number.isFinite(value) && value > 0)) {
    return NextResponse.json({ error: 'Informe largura, altura e profundidade válidas.' }, { status: 400 });
  }
  if (!['cm', 'mm', 'm'].includes(input.unit)) {
    return NextResponse.json({ error: 'A unidade de medida é inválida.' }, { status: 400 });
  }
  return NextResponse.json(await createGenerationJob(input), { status: 201 });
}
