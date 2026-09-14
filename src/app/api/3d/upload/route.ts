import { NextResponse } from 'next/server';
import { makeId, store } from '@/lib/3d-generation/store';
import type { ProductImage } from '@/lib/3d-generation/types';

const ACCEPTED = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_SIZE = 10 * 1024 * 1024;
const MAX_IMAGES = 8;

export async function POST(request: Request) {
  const form = await request.formData();
  const files = form.getAll('images').filter((item): item is File => item instanceof File);
  if (!files.length) return NextResponse.json({ error: 'Envie pelo menos uma imagem.' }, { status: 400 });
  if (files.length > MAX_IMAGES) {
    return NextResponse.json({ error: `Envie no máximo ${MAX_IMAGES} imagens por produto.` }, { status: 400 });
  }
  for (const file of files) {
    if (!ACCEPTED.has(file.type) || file.size > MAX_SIZE) {
      return NextResponse.json({ error: `${file.name}: use JPG, PNG ou WEBP de até 10 MB.` }, { status: 400 });
    }
  }
  const images: ProductImage[] = await Promise.all(files.map(async (file, sortOrder) => {
    const base64 = Buffer.from(await file.arrayBuffer()).toString('base64');
    return { id: makeId('img'), name: file.name, imageUrl: `data:${file.type};base64,${base64}`, sortOrder, createdAt: new Date().toISOString() };
  }));
  images.forEach((image) => store.images.set(image.id, image));
  return NextResponse.json({ images });
}
