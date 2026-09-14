'use client';

import { ChangeEvent, DragEvent, useEffect, useRef, useState } from 'react';
import { ArrowRight, Box, Camera, CheckCircle2, Images, Info, Lightbulb, Loader2, Plus, ScanLine, Sparkles, Trash2, UploadCloud } from 'lucide-react';
import { GenerationStatus } from './generation-status';
import { ModelPreview } from './model-preview';
import type { GenerationJob, GeneratedModel, JobStatusResponse, ProductInput } from '@/lib/3d-generation/types';

type LocalImage = { file: File; url: string };
const MAX_IMAGES = 4;
const categories = ['Mobiliário', 'Decoração', 'Eletrônicos', 'Moda e acessórios', 'Casa e cozinha', 'Outro'];
const objectTypes = ['Rígido', 'Decorativo', 'Mobiliário', 'Simétrico', 'Priorizar textura'];
const initial: Omit<ProductInput, 'imageIds' | 'imageUrls'> = { name:'', category:'', width:0, height:0, depth:0, unit:'cm', material:'', color:'#b8d7bd', notes:'', objectTypes:[] };

function compressFor3D(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error(`Não foi possível ler ${file.name}.`));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error(`Não foi possível preparar ${file.name}.`));
      image.onload = () => {
        const maxSide = 1152;
        const ratio = Math.min(1, maxSide / Math.max(image.naturalWidth, image.naturalHeight));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(image.naturalWidth * ratio));
        canvas.height = Math.max(1, Math.round(image.naturalHeight * ratio));
        const context = canvas.getContext('2d');
        if (!context) return reject(new Error('Seu navegador não conseguiu preparar a imagem.'));
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.78));
      };
      image.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

export function GeneratorWorkspace() {
  const [images, setImages] = useState<LocalImage[]>([]);
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState<Record<string,string>>({});
  const [job, setJob] = useState<GenerationJob>();
  const [model, setModel] = useState<GeneratedModel>();
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string>();
  const inputRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!job || job.status === 'pronto' || job.status === 'erro') return;
    const timer = setInterval(async () => {
      try {
        const res = await fetch(`/api/3d/jobs/${job.id}`, { cache: 'no-store' });
        const next = await res.json() as JobStatusResponse & { error?: string };
        if (!res.ok) throw new Error(next.error || 'Não foi possível consultar o processamento.');
        setJob(next);
        if (next.model) setModel(next.model);
        if (next.status === 'erro' && next.errorMessage) setNotice(next.errorMessage);
      } catch (error) {
        setJob(current => current ? { ...current, status: 'erro' } : current);
        setNotice(error instanceof Error ? error.message : 'Não foi possível consultar o processamento. Tente gerar novamente.');
      }
    }, 5000);
    return () => clearInterval(timer);
  }, [job]);

  function addFiles(list: FileList | File[]) {
    const selected = Array.from(list);
    const valid = selected.filter(file => ['image/jpeg','image/png','image/webp'].includes(file.type) && file.size <= 10*1024*1024);
    setImages(current => {
      const available = Math.max(0, MAX_IMAGES - current.length);
      const accepted = valid.slice(0, available);
      if (valid.length !== selected.length || valid.length > available) {
        setNotice(`Alguns arquivos foram ignorados. Adicione até ${MAX_IMAGES} fotos JPG, PNG ou WEBP de até 10 MB.`);
      }
      return [...current, ...accepted.map(file => ({ file, url: URL.createObjectURL(file) }))];
    });
    setErrors(current => ({ ...current, images: '' }));
  }

  function drop(e: DragEvent) {
    e.preventDefault();
    addFiles(e.dataTransfer.files);
  }

  function field(e: ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.type === 'number' ? Number(e.target.value) : e.target.value }));
    setErrors(x => ({ ...x, [e.target.name]: '' }));
  }

  async function generate() {
    const next: Record<string,string> = {};
    if (!images.length) next.images = 'Adicione ao menos uma foto.';
    if (!form.name.trim()) next.name = 'Informe o nome do produto.';
    if (!form.category) next.category = 'Selecione uma categoria.';
    if (!form.width || !form.height || !form.depth) next.dimensions = 'Informe as três dimensões.';
    setErrors(next);
    if (Object.keys(next).length) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setBusy(true);
    setNotice('Preparando as fotos para reconstrução 3D...');
    try {
      const imageUrls = await Promise.all(images.map(image => compressFor3D(image.file)));
      const res = await fetch('/api/3d/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, imageUrls }),
      });
      const created = await res.json() as GenerationJob & { error?: string };
      if (!res.ok) throw new Error(created.error || 'Não foi possível iniciar a geração.');
      setJob(created);
      setModel(undefined);
      setNotice(undefined);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Não foi possível iniciar a geração.');
    } finally {
      setBusy(false);
    }
  }

  async function action(value:'approve'|'reject'|'publish') {
    if (!model) return;
    const res = await fetch(`/api/3d/models/${model.id}`, {
      method:'PATCH',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({ action:value, model }),
    });
    if (res.ok) {
      setModel(await res.json());
      setNotice(value === 'publish'
        ? 'Modelo publicado no produto com sucesso.'
        : value === 'approve'
          ? 'Modelo aprovado e salvo.'
          : 'Resultado rejeitado. Você pode gerar uma nova versão.');
    }
  }

  function reset() {
    setJob(undefined);
    setModel(undefined);
    setNotice(undefined);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return <main className="siviu-shell min-h-screen text-white"><div className="ambient ambient-one"/><div className="ambient ambient-two"/>
    <nav className="relative z-10 mx-auto flex max-w-[1440px] items-center justify-between px-5 py-6 lg:px-10"><div className="flex items-center gap-3"><div className="logo-mark"><ScanLine size={21}/></div><div><span className="text-lg font-bold tracking-tight">SIVIU</span><span className="ml-1 text-lg font-light text-lime-300">3D</span></div></div><div className="flex items-center gap-3"><span className="hidden text-xs text-white/35 sm:block">WORKSPACE / FOTO PARA 3D</span><div className="h-8 w-8 rounded-full border border-white/10 bg-gradient-to-br from-lime-200/80 to-emerald-600/60"/></div></nav>
    <div className="relative z-10 mx-auto max-w-[1440px] px-5 pb-24 lg:px-10"><header className="mb-10 max-w-3xl pt-6 sm:pt-10"><div className="mb-5 inline-flex items-center gap-2 rounded-full border border-lime-300/20 bg-lime-300/5 px-3 py-1.5 text-[11px] font-semibold tracking-[.16em] text-lime-200"><Sparkles size={13}/> AI PRODUCT STUDIO</div><h1 className="text-4xl font-semibold leading-[1.06] tracking-[-.04em] sm:text-6xl">Gerar modelo 3D<br/><span className="text-white/35">por foto.</span></h1><p className="mt-5 max-w-xl text-base leading-relaxed text-white/50 sm:text-lg">Envie fotos do produto e transforme em um modelo 3D pronto para visualização no ambiente.</p></header>
      {notice && <div className="mb-5 flex items-center gap-3 rounded-2xl border border-lime-300/20 bg-lime-300/8 p-4 text-sm text-lime-100"><CheckCircle2 size={18}/>{notice}</div>}
      {!job && <div className="grid items-start gap-5 lg:grid-cols-[1.12fr_.88fr]">
        <div className="space-y-5"><section className="siviu-card p-5 sm:p-7"><SectionTitle number="01" title="Fotos do produto" description="Adicione até 4 ângulos. A primeira foto deve mostrar a frente do produto."/>
          <div onDragOver={e=>e.preventDefault()} onDrop={drop} className={`upload-zone mt-6 ${errors.images?'border-red-400/60':''}`}>
            <input ref={inputRef} className="hidden" type="file" multiple accept="image/jpeg,image/png,image/webp" onChange={e=>e.target.files&&addFiles(e.target.files)}/>
            <input ref={cameraRef} className="hidden" type="file" accept="image/jpeg,image/png,image/webp" capture="environment" onChange={e=>e.target.files&&addFiles(e.target.files)}/>
            <div className="upload-icon"><UploadCloud size={25}/></div><h3 className="mt-4 font-medium">Adicione fotos do produto</h3><p className="mt-1 text-sm text-white/40">Frente, laterais e traseira dão maior fidelidade ao modelo</p>
            <div className="mt-5 flex flex-col gap-2 min-[390px]:flex-row"><button type="button" onClick={()=>cameraRef.current?.click()} className="capture-action"><Camera size={16}/> Fotografar agora</button><button type="button" onClick={()=>inputRef.current?.click()} className="gallery-action"><Images size={16}/> Escolher da galeria</button></div>
            <p className="mt-4 text-[10px] tracking-wider text-white/25">JPG, PNG OU WEBP · MÁX. 10 MB</p></div>{errors.images&&<ErrorText>{errors.images}</ErrorText>}
          {images.length>0&&<div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">{images.map((image,index)=><div key={image.url} className="group relative aspect-square overflow-hidden rounded-xl border border-white/10"><img src={image.url} alt={`Foto ${index+1}`} className="h-full w-full object-cover"/><span className="absolute bottom-2 left-2 rounded-md bg-black/60 px-2 py-1 text-[9px]">{index===0?'FRENTE':`ÂNGULO ${index+1}`}</span><button type="button" aria-label="Remover imagem" onClick={e=>{e.stopPropagation();URL.revokeObjectURL(image.url);setImages(v=>v.filter((_,i)=>i!==index));}} className="absolute right-2 top-2 rounded-lg bg-black/70 p-2 opacity-100 hover:text-red-300 sm:opacity-0 sm:group-hover:opacity-100"><Trash2 size={14}/></button></div>)}{images.length<MAX_IMAGES&&<button onClick={()=>inputRef.current?.click()} className="flex aspect-square flex-col items-center justify-center rounded-xl border border-dashed border-white/15 text-xs text-white/35 hover:border-lime-300/40 hover:text-lime-200"><Plus size={20}/><span className="mt-2">Adicionar</span></button>}</div>}
        </section><PhotoTips/></div>
        <section className="siviu-card p-5 sm:p-7"><SectionTitle number="02" title="Dados do produto" description="Defina escala e características do objeto."/><div className="mt-7 grid gap-5 sm:grid-cols-2"><Field label="Nome do produto" error={errors.name} className="sm:col-span-2"><input name="name" value={form.name} onChange={field} placeholder="Ex: Poltrona Aurora"/></Field><Field label="Categoria" error={errors.category}><select name="category" value={form.category} onChange={field}><option value="">Selecionar</option>{categories.map(v=><option key={v}>{v}</option>)}</select></Field><Field label="Material"><input name="material" value={form.material} onChange={field} placeholder="Ex: Madeira e linho"/></Field><div className="sm:col-span-2"><label className="field-label">Dimensões reais</label><div className="grid grid-cols-2 gap-2 sm:grid-cols-[1fr_1fr_1fr_82px]">{['width','height','depth'].map((n,i)=><div key={n} className="relative"><input type="number" min="0" step="0.1" name={n} value={(form as any)[n]||''} onChange={field} placeholder={['L','A','P'][i]}/><span className="absolute right-3 top-3.5 text-[10px] text-white/25">{['L','A','P'][i]}</span></div>)}<select name="unit" value={form.unit} onChange={field}><option>cm</option><option>mm</option><option>m</option></select></div>{errors.dimensions&&<ErrorText>{errors.dimensions}</ErrorText>}</div><Field label="Cor predominante"><div className="flex gap-2"><input type="color" name="color" value={form.color} onChange={field} className="!w-12 !p-1"/><input value={form.color.toUpperCase()} readOnly/></div></Field><Field label="Acabamento / material"><input name="material" value={form.material} onChange={field} placeholder="Fosco, brilhante..."/></Field><div className="sm:col-span-2"><label className="field-label">Características do objeto</label><div className="flex flex-wrap gap-2">{objectTypes.map(type=>{const selected=form.objectTypes.includes(type);return <button type="button" key={type} onClick={()=>setForm(f=>({...f,objectTypes:selected?f.objectTypes.filter(x=>x!==type):[...f.objectTypes,type]}))} className={`choice-chip ${selected?'selected':''}`}>{selected&&<CheckCircle2 size={13}/>} {type}</button>})}</div></div><Field label="Observações" className="sm:col-span-2"><textarea name="notes" value={form.notes} onChange={field} rows={3} placeholder="Detalhes importantes para a reconstrução..."/></Field></div>
          <div className="mt-7 rounded-2xl border border-white/8 bg-black/20 p-4"><div className="flex gap-3"><Info className="mt-0.5 shrink-0 text-lime-300" size={17}/><p className="text-xs leading-relaxed text-white/45">As medidas ficam vinculadas ao produto para manter a escala real nas próximas etapas de visualização AR.</p></div></div><button disabled={busy} onClick={generate} className="primary-action mt-5 !h-14 !w-full text-sm">{busy?<Loader2 className="animate-spin" size={19}/>:<Box size={19}/>} {busy?'Preparando fotos...':'Gerar modelo 3D'}<ArrowRight className="ml-auto" size={18}/></button>
        </section></div>}
      {job&&<div className="space-y-5"><GenerationStatus status={job.status} progress={job.progress}/>{job.status === 'erro' && <button type="button" onClick={reset} className="secondary-action mx-auto px-6">Tentar novamente</button>}{model&&<ModelPreview model={model} color={form.color} onAction={action} onRegenerate={reset}/>}</div>}
    </div></main>;
}

function SectionTitle({number,title,description}:{number:string;title:string;description:string}){return <div className="flex gap-4"><span className="mt-1 text-[10px] font-bold tracking-widest text-lime-300">{number}</span><div><h2 className="text-xl font-semibold">{title}</h2><p className="mt-1 text-sm text-white/40">{description}</p></div></div>}
function Field({label,error,children,className=''}:{label:string;error?:string;children:React.ReactNode;className?:string}){return <label className={className}><span className="field-label">{label}</span>{children}{error&&<ErrorText>{error}</ErrorText>}</label>}
function ErrorText({children}:{children:React.ReactNode}){return <p className="mt-2 text-xs text-red-300">{children}</p>}
function PhotoTips(){const tips=['Use um fundo limpo','1ª foto: frente do produto','Inclua laterais e traseira','Garanta boa iluminação','Evite reflexos fortes'];return <section className="siviu-card p-5 sm:p-7"><div className="flex items-center gap-3"><div className="rounded-xl bg-amber-300/10 p-2.5 text-amber-200"><Lightbulb size={19}/></div><div><h2 className="font-medium">Uma boa foto faz a diferença</h2><p className="text-xs text-white/35">Dicas para um resultado mais fiel</p></div></div><div className="mt-5 grid gap-3 sm:grid-cols-2">{tips.map((t,i)=><div key={t} className="flex items-center gap-3 text-sm text-white/55"><span className="flex h-6 w-6 items-center justify-center rounded-full border border-white/10 text-[9px] text-lime-300">0{i+1}</span>{t}</div>)}</div></section>}
