import type { Metadata } from 'next';
import { GeneratorWorkspace } from '@/components/siviu3d/generator-workspace';

export const metadata: Metadata = {
  title: 'Gerar 3D por Foto · Administração Siviu3D',
};

export default function AdminGenerate3DPage() {
  return <GeneratorWorkspace />;
}
