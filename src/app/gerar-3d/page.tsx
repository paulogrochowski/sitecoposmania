import type { Metadata } from 'next';
import { GeneratorWorkspace } from '@/components/siviu3d/generator-workspace';

export const metadata: Metadata = { title: 'Gerar 3D por foto · Siviu3D', description: 'Converta fotos de produto em modelos 3D.' };
export default function Generate3DPage(){ return <GeneratorWorkspace/>; }
