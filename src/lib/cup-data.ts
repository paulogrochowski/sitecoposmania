import type { CupModel } from './types';

const TRANSPARENT_PIXEL =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

export const RIM_COLORS: Record<string, string> = {
  Nenhuma: 'transparent',
  Dourado: '#d4af37',
  Prata: '#c0c0c0',
  'Rosa Gold': '#b76e79',
};

export const DEGRADE_COLORS = [
  'Nenhum',
  'Rosa',
  'Azul',
  'Verde',
  'Roxo',
  'Vermelho',
  'Preto',
];

export const DEGRADE_HEX_COLORS: Record<string, string> = {
  Nenhum: 'transparent',
  Rosa: '#ec4899',
  Azul: '#3b82f6',
  Verde: '#22c55e',
  Roxo: '#8b5cf6',
  Vermelho: '#ef4444',
  Preto: '#111827',
};

const baseCup = {
  name: 'Copo Long Drink',
  imageUrl: TRANSPARENT_PIXEL,
  svgMaskUrl: TRANSPARENT_PIXEL,
  basePrice: 0,
  printableArea: {
    widthPercent: 72,
    heightPercent: 62,
    width_mm: 60,
    height_mm: 105,
  },
} satisfies Omit<CupModel, 'id' | 'opacityType' | 'rimColor'>;

const opacityTypes: NonNullable<CupModel['opacityType']>[] = ['Fosco', 'Transparente'];
const rimColors: NonNullable<CupModel['rimColor']>[] = ['Nenhuma', 'Dourado', 'Prata', 'Rosa Gold'];

export const CUP_CATALOG: CupModel[] = opacityTypes.flatMap((opacityType) =>
  rimColors.map((rimColor) => ({
    ...baseCup,
    id: `long-drink-${opacityType.toLowerCase()}-${rimColor.toLowerCase().replace(/\s+/g, '-')}`,
    opacityType,
    rimColor,
  }))
);

export const CUP_TYPES_SUMMARY = [
  {
    id: '1',
    name: 'Copo Long Drink',
  },
];
