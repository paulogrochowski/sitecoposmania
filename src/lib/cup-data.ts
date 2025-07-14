import type { CupModel } from '@/lib/types';

// SVG masks
export const LONG_DRINK_SVG = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2MCAxMjAiPjxwYXRoIGQ9Ik01LDAgSDU1IEw1MCwxMjAgSDEwIFoiIGZpbGw9ImN1cnJlbnRDb2xvciIvPjwvc3ZnPg==';
export const TWISTER_SVG = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA3MCAxNDAiPjxwYXRoIGQ9Ik0wIDEwaDcwdjE1SDB6TTEwIDMwaDUwbC01IDEwMEgxNXpNMzIgMGg2djEwaC02eiIgZmlsbD0iY3VycmVudENvbG9yIi8+PC9zdmc+';
export const CALDERETA_SVG = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA4MCAxMDAiPjxwYXRoIGQ9Ik01LDAgSDc1IEw2NSwxMDAgSDE1IFoiIGZpbGw9ImN1cnJlbnRDb2xvciIvPjwvc3ZnPg==';
export const TAÇA_GIN_SVG = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA4MCAxNTAiPjxwYXRoIGQ9Ik0xMCwwIEg3MCBDODAsNjAgNDUsODAgNDUsODAgVjEzMCBINjAgTDY1LDE0MCBIMTUgTDIwLDEzMCBIMzUgVjgwIEMzNSw2MCAwLDYwIDEwLDAgWiIgZmlsbD0iY3VycmVudENvbG9yIi8+PC9zdmc+';

// Realistic Photo URLs (placeholders)
export const LONG_DRINK_PHOTO = 'https://placehold.co/400x600.png';
export const TWISTER_PHOTO = 'https://placehold.co/400x600.png';
export const CALDERETA_PHOTO = 'https://placehold.co/400x500.png';
export const TAÇA_GIN_PHOTO = 'https://placehold.co/500x700.png';


export const CUP_TYPES_SUMMARY = [
  { 
    id: 'copo-long-drink', 
    name: 'Copo Long Drink', 
    imageUrl: LONG_DRINK_PHOTO, 
    basePrice: 3.50, 
    'data-ai-hint': 'white cup',
    summary: 'O clássico para festas e eventos.',
    description: 'O Copo Long Drink é perfeito para servir drinks, refrigerantes e sucos. Com capacidade de 350ml, é resistente e possui um design versátil que combina com qualquer celebração.'
  },
  { 
    id: 'copo-twister-com-tampa', 
    name: 'Copo Twister com Tampa', 
    imageUrl: TWISTER_PHOTO, 
    basePrice: 4.80, 
    'data-ai-hint': 'clear cup lid',
    summary: 'Diversão e praticidade com tampa e canudo.',
    description: 'O Copo Twister de 500ml vem com tampa e canudo, ideal para festas infantis, passeios e para o dia a dia. Seu design espiral é um charme e evita derramamentos.'
  },
  { 
    id: 'copo-caldereta', 
    name: 'Copo Caldereta', 
    imageUrl: CALDERETA_PHOTO, 
    basePrice: 3.20, 
    'data-ai-hint': 'black cup',
    summary: 'Robusto e ideal para cervejas e chopp.',
    description: 'Com 300ml, o Copo Caldereta é a escolha preferida para servir cervejas e chopp em bares e festas. Seu formato robusto garante uma pegada firme e mantém a temperatura.'
  },
  { 
    id: 'taca-gin', 
    name: 'Taça Gin', 
    imageUrl: TAÇA_GIN_PHOTO, 
    basePrice: 7.90, 
    'data-ai-hint': 'pink goblet',
    summary: 'Elegância para seus drinks de gin.',
    description: 'A Taça Gin de 700ml é sinônimo de sofisticação. Com espaço de sobra para gelo e especiarias, ela é perfeita para preparar e servir Gin Tônica e outros coquetéis com estilo.'
  },
];

export const ALL_OPACITIES = ['Fosco', 'Transparente'] as const;
export const ALL_RIMS = ['Nenhuma', 'Dourado', 'Prata', 'Rosa Gold'] as const;

export const DEGRADE_COLORS = [
    'Nenhum', 'Rosa Pink', 'Azul', 'Verde', 'Laranja', 'Vermelho', 'Preto', 'Prata',
    'Amarelo', 'Roxo', 'Rose Gold', 'Dourado', 'Rosa Chiclete', 'Cobre',
];

export const RIM_COLORS: { [key in typeof ALL_RIMS[number]]: string } = {
    'Nenhuma': 'transparent',
    'Dourado': '#FFD700',
    'Prata': '#C0C0C0',
    'Rosa Gold': '#E6C4C0',
};

export const DEGRADE_HEX_COLORS: { [key: string]: string } = {
    'Rosa Pink': '#FF1493', 'Azul': '#4287f5', 'Verde': '#32a852',
    'Laranja': '#FFA500', 'Vermelho': '#FF0000', 'Preto': '#000000',
    'Prata': '#C0C0C0', 'Amarelo': '#FFFF00', 'Roxo': '#800080',
    'Rose Gold': '#B76E79', 'Dourado': '#FFD700', 'Rosa Chiclete': '#FF69B4',
    'Cobre': '#B87333',
};

export const CUP_CATALOG: CupModel[] = [
    // Long Drink
    ...ALL_OPACITIES.flatMap(opacity =>
        ALL_RIMS.map(rim => ({
            id: `long-drink-${opacity}-${rim}`.toLowerCase().replace(/\s/g, '-'),
            name: 'Copo Long Drink',
            imageUrl: LONG_DRINK_PHOTO,
            svgMaskUrl: LONG_DRINK_SVG,
            basePrice: 3.50 + (rim !== 'Nenhuma' ? 0.75 : 0),
            colorName: 'Branco',
            colorHex: '#FFFFFF',
            opacityType: opacity,
            rimColor: rim,
            printableArea: { widthPercent: 80, heightPercent: 40, width_mm: 50, height_mm: 80 },
        }))
    ),
    // Twister
    ...ALL_OPACITIES.flatMap(opacity =>
        ALL_RIMS.map(rim => ({
            id: `twister-${opacity}-${rim}`.toLowerCase().replace(/\s/g, '-'),
            name: 'Copo Twister com Tampa',
            imageUrl: TWISTER_PHOTO,
            svgMaskUrl: TWISTER_SVG,
            basePrice: 4.80 + (rim !== 'Nenhuma' ? 0.90 : 0),
            colorName: 'Branco',
            colorHex: '#FFFFFF',
            opacityType: opacity,
            rimColor: rim,
            printableArea: { widthPercent: 85, heightPercent: 35, width_mm: 55, height_mm: 90 },
        }))
    ),
    // Caldereta
    ...ALL_OPACITIES.flatMap(opacity =>
        ALL_RIMS.map(rim => ({
            id: `caldereta-${opacity}-${rim}`.toLowerCase().replace(/\s/g, '-'),
            name: 'Copo Caldereta',
            imageUrl: CALDERETA_PHOTO,
            svgMaskUrl: CALDERETA_SVG,
            basePrice: 3.20 + (rim !== 'Nenhuma' ? 0.70 : 0),
            colorName: 'Branco',
            colorHex: '#FFFFFF',
            opacityType: opacity,
            rimColor: rim,
            printableArea: { widthPercent: 75, heightPercent: 50, width_mm: 60, height_mm: 70 },
        }))
    ),
    // Taça Gin
    ...ALL_OPACITIES.flatMap(opacity =>
        ALL_RIMS.map(rim => ({
            id: `taça-gin-${opacity}-${rim}`.toLowerCase().replace(/\s/g, '-'),
            name: 'Taça Gin',
            imageUrl: TAÇA_GIN_PHOTO,
            svgMaskUrl: TAÇA_GIN_SVG,
            basePrice: 7.90 + (rim !== 'Nenhuma' ? 1.50 : 0),
            colorName: 'Branco',
            colorHex: '#FFFFFF',
            opacityType: opacity,
            rimColor: rim,
            printableArea: { widthPercent: 60, heightPercent: 30, width_mm: 60, height_mm: 60 },
        }))
    ),
];
