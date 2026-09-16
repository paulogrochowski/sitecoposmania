'use client';
import { useState } from 'react';
import { Box, Check, Download, Move3d, Rotate3d, Send, Sparkles, ThumbsDown } from 'lucide-react';
import type { GeneratedModel } from '@/lib/3d-generation/types';

export function ModelPreview({ model, color, onAction, onRegenerate }: { model: GeneratedModel; color: string; onAction: (a: 'approve'|'reject'|'publish') => void; onRegenerate: () => void; }) {
  const [rotation, setRotation] = useState(-22); const [dragX, setDragX] = useState<number>();
  function downloadMock() {
    const blob = new Blob([JSON.stringify({ generator: model.engineUsed, modelId: model.id, integration: 'mock' }, null, 2)], { type: 'model/gltf-binary' });
    const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = `siviu-${model.id}.glb`; link.click(); URL.revokeObjectURL(url);
  }
  return <section className="siviu-card overflow-hidden p-1">
    <div className="grid lg:grid-cols-[1.45fr_.55fr]">
      <div className="relative min-h-[430px] overflow-hidden rounded-[22px] bg-[#090d0d]" onPointerDown={e => setDragX(e.clientX)} onPointerMove={e => { if (dragX !== undefined) { setRotation(r => r + (e.clientX - dragX) * .7); setDragX(e.clientX); } }} onPointerUp={() => setDragX(undefined)} onPointerLeave={() => setDragX(undefined)}>
        <div className="preview-grid absolute inset-0"/><div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-2 text-xs text-white/70 backdrop-blur"><span className="h-2 w-2 rounded-full bg-lime-300"/>PREVIEW INTERATIVO</div>
        <div className="absolute right-5 top-5 rounded-full border border-white/10 bg-black/40 p-2.5 text-white/60"><Move3d size={17}/></div>
        <div className="perspective-stage absolute inset-0 flex items-center justify-center">
          <div className="mock-model" style={{ transform: `rotateX(-12deg) rotateY(${rotation}deg)`, '--model-color': color || '#b9d8c0' } as React.CSSProperties}>
            <div className="model-top"/><div className="model-front"><span/></div><div className="model-side"/>
          </div>
        </div>
        <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-black/50 px-4 py-2 text-xs text-white/60 backdrop-blur"><Rotate3d size={15}/> Arraste para girar</div>
      </div>
      <aside className="flex flex-col p-5 sm:p-7"><div className="mb-6 flex h-11 w-11 items-center justify-center rounded-2xl bg-lime-300 text-black"><Box size={21}/></div><p className="eyebrow">RESULTADO GERADO</p><h2 className="mt-2 text-2xl font-semibold">Modelo pronto para revisar</h2><p className="mt-3 text-sm leading-relaxed text-white/50">Confira volume, proporções e acabamento antes de publicar.</p>
        <dl className="mt-7 space-y-3 border-y border-white/8 py-5 text-sm"><div className="flex justify-between"><dt className="text-white/40">Formato</dt><dd>GLB 2.0</dd></div><div className="flex justify-between"><dt className="text-white/40">Polígonos</dt><dd>{model.polycount.toLocaleString('pt-BR')}</dd></div><div className="flex justify-between"><dt className="text-white/40">Engine</dt><dd className="text-right text-lime-200">Siviu Neural</dd></div></dl>
        <div className="mt-auto grid gap-2 pt-6"><button onClick={() => onAction('approve')} className="primary-action"><Check size={18}/> Aprovar modelo</button><button onClick={() => onAction('publish')} className="secondary-action"><Send size={17}/> Publicar no produto</button><div className="grid grid-cols-2 gap-2"><button onClick={onRegenerate} className="tertiary-action"><Sparkles size={15}/> Gerar novamente</button><button onClick={downloadMock} className="tertiary-action"><Download size={15}/> Baixar GLB</button></div><button onClick={() => onAction('reject')} className="mt-1 flex items-center justify-center gap-2 py-2 text-xs text-white/35 hover:text-red-300"><ThumbsDown size={14}/> Rejeitar resultado</button></div>
      </aside>
    </div>
  </section>;
}
