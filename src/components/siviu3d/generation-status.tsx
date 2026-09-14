import { Check, Loader2 } from 'lucide-react';
import { JOB_STAGES, type GenerationStatus } from '@/lib/3d-generation/types';

const labels: Record<string, string> = {
  aguardando_upload: 'Aguardando upload', processando_imagem: 'Processando imagem', gerando_malha: 'Gerando malha 3D',
  aplicando_textura: 'Aplicando textura', otimizando_modelo: 'Otimizando modelo', gerando_preview: 'Gerando preview', pronto: 'Pronto para revisão', erro: 'Ocorreu um erro',
};

export function GenerationStatus({ status, progress }: { status: GenerationStatus; progress: number }) {
  const current = JOB_STAGES.indexOf(status as (typeof JOB_STAGES)[number]);
  const hasError = status === 'erro';
  return <section className={`siviu-card p-5 sm:p-7 ${hasError ? 'border-red-400/30' : ''}`} aria-live="polite" aria-busy={!hasError && status !== 'pronto'}>
    <div className="mb-5 flex items-end justify-between gap-4"><div><p className="eyebrow">PROCESSAMENTO</p><h2 className="mt-1 text-xl font-semibold">{labels[status]}</h2></div><strong className="text-2xl text-lime-300">{progress}%</strong></div>
    <div className="h-2 overflow-hidden rounded-full bg-white/8"><div className={`h-full rounded-full transition-all duration-700 ${hasError ? 'bg-red-400' : 'bg-gradient-to-r from-lime-400 to-emerald-300'}`} style={{ width: `${progress}%` }} /></div>
    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
      {JOB_STAGES.map((stage, index) => { const done = index < current || status === 'pronto'; const active = index === current; return <div key={stage} className={`rounded-xl border p-3 transition ${active ? 'border-lime-300/50 bg-lime-300/8' : 'border-white/8 bg-white/[.025]'}`}>
        <span className={`mb-3 flex h-7 w-7 items-center justify-center rounded-full ${done ? 'bg-lime-300 text-black' : active ? 'bg-lime-300/15 text-lime-300' : 'bg-white/5 text-white/35'}`}>{done ? <Check size={15}/> : active ? <Loader2 className="animate-spin" size={15}/> : <span className="text-[10px]">{index + 1}</span>}</span>
        <p className={`text-xs leading-snug ${active || done ? 'text-white' : 'text-white/40'}`}>{labels[stage]}</p>
      </div>; })}
    </div>
  </section>;
}
