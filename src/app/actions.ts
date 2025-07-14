
'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { generateCupArt } from '@/ai/flows/generate-cup-art';
import { analyzeArtComplexity } from '@/ai/flows/analyze-art-complexity';
import type { OrderDetails } from '@/lib/types';
import { validateImageBackground } from '@/ai/flows/validate-image-background';
import { optimizeProductSeo } from '@/ai/flows/optimize-product-seo';
import type { OptimizeProductSeoInput } from '@/ai/flows/optimize-product-seo';
import { generateAdCreative } from '@/ai/flows/generate-ad-creative';
import type { GenerateAdCreativeInput } from '@/ai/flows/generate-ad-creative';
import { optimizeAdCopy } from '@/ai/flows/optimize-ad-copy';
import type { OptimizeAdCopyInput } from '@/ai/flows/optimize-ad-copy';
import { analyzeMarketingQuality } from '@/ai/flows/analyze-marketing-quality';
import type { AnalyzeMarketingQualityInput } from '@/ai/flows/analyze-marketing-quality';
import { convertToGlb } from '@/ai/flows/convert-to-glb';
import type { ConvertToGlbInput } from '@/lib/types';


export async function handleArtGeneration(prompt: string) {
  try {
    const result = await generateCupArt({ eventDescription: prompt });
    
    if (!result.imageUrl) {
        throw new Error('A IA não conseguiu gerar a imagem.');
    }

    return { success: true, imageUrl: result.imageUrl, prompt: prompt };
  } catch (error) {
    console.error('Art generation error:', error);
    return { success: false, error: 'Falha ao gerar a arte. Tente novamente ou com uma descrição diferente.' };
  }
}

export async function handleArtAnalysis(artDataUri: string, description: string) {
    try {
        const result = await analyzeArtComplexity({ artDataUri, description });
        return { success: true, analysis: { score: result.complexityScore, reasoning: result.reasoning } };
    } catch (error) {
        console.error(error);
        return { success: false, error: 'Falha ao analisar a arte.' };
    }
}

export async function handleFinalizeOrder(details: OrderDetails) {
    console.log("Order finalized:", details);
    return { success: true };
}

export async function handleValidateArtBackground(imageDataUri: string) {
    try {
        const result = await validateImageBackground({ imageDataUri });
        return { success: true, validation: result };
    } catch (error) {
        console.error(error);
        return { success: false, error: 'Falha ao validar a imagem.' };
    }
}

export async function handleSeoOptimization(input: OptimizeProductSeoInput) {
    try {
        const result = await optimizeProductSeo(input);
        return { success: true, seoData: result };
    } catch (error) {
        console.error('Error optimizing SEO:', error);
        return { success: false, error: 'Falha ao otimizar o SEO. Tente novamente.' };
    }
}

export async function handleShippingCalculation(cep: string) {
    if (!cep || cep.replace(/\D/g, '').length !== 8) {
        return { success: false, error: 'CEP inválido. Por favor, digite um CEP com 8 dígitos.' };
    }
    
    // Simulação: Custo e tempo de entrega aleatórios
    const randomCost = 15 + Math.random() * 30;
    const randomTime = 3 + Math.floor(Math.random() * 10);

    return { 
        success: true, 
        shippingCost: randomCost, 
        deliveryTime: `${randomTime} dias úteis` 
    };
}

export async function handleAdminAddProduct(formData: FormData) {
    const name = formData.get('name') as string;
    const basePrice = formData.get('basePrice') as string;
    const imageUrl = formData.get('imageUrl') as string;

    if (!name || !basePrice || !imageUrl) {
        return { success: false, error: "Todos os campos são obrigatórios." };
    }
    
    // Simulação: Log do novo produto
    console.log('New Product to be added:', {
      name,
      basePrice: parseFloat(basePrice),
      imageUrl,
    });
    
    return { success: true };
}

export async function handleGenerateAdCreative(input: GenerateAdCreativeInput) {
    try {
        const result = await generateAdCreative(input);
        return { success: true, imageUrl: result.imageUrl };
    } catch (error) {
        console.error('Error generating ad creative:', error);
        return { success: false, error: 'Falha ao gerar o criativo do anúncio.' };
    }
}

export async function handleOptimizeAdCopy(input: OptimizeAdCopyInput) {
    try {
        const result = await optimizeAdCopy(input);
        return { success: true, adCopy: result };
    } catch (error) {
        console.error('Error optimizing ad copy:', error);
        return { success: false, error: 'Falha ao otimizar o texto do anúncio.' };
    }
}

export async function handleAnalyzeMarketingQuality(input: AnalyzeMarketingQualityInput) {
    try {
        const result = await analyzeMarketingQuality(input);
        return { success: true, analysis: result };
    } catch (error) {
        console.error('Error analyzing marketing quality:', error);
        return { success: false, error: 'Falha ao analisar a qualidade do marketing.' };
    }
}

export async function handleAdminAddCustomer(formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;

    if (!name || !email) {
        return { success: false, error: "Nome e Email são obrigatórios." };
    }

    // Simulação: Log do novo cliente
    console.log('New Customer to be added:', {
      name,
      email,
      phone: formData.get('phone'),
      cpf: formData.get('cpf'),
      address: formData.get('address'),
    });
    
    return { success: true };
}

export async function handleCustomerLogin(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const remember = formData.get('remember-customer');

  // Basic validation, in a real app you'd check a database
  if (email && password) {
    cookies().set('auth-token', 'customer-logged-in', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: remember ? 60 * 60 * 24 * 7 : undefined, // 7 days or session
      path: '/',
    });
    return { success: true };
  } else {
    return { success: false, error: "Email ou senha inválidos." };
  }
}

export async function handleLogout() {
  cookies().delete('auth-token');
  cookies().delete('admin-session');
  redirect('/');
}


export async function handleAdminUpdateCustomer(customerId: string, formData: FormData) {
    // Simulação de atualização
    console.log('Updating customer with ID:', customerId);
    console.log('Form data received:', {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        cpf: formData.get('cpf'),
        address: formData.get('address'),
    });
    return { success: true, message: 'Cliente salvo com sucesso (simulação)!' };
}

export async function handleAdminUpdateProduct(productId: string, formData: FormData) {
    // Simulação de atualização
    console.log('Updating product with ID:', productId);
    console.log('Form data received:', {
        name: formData.get('name'),
        summary: formData.get('summary'),
        description: formData.get('description'),
        basePrice: formData.get('basePrice'),
    });
    return { success: true, message: 'Produto salvo com sucesso (simulação)!' };
}

export async function handleAdminUpdateLayout(formData: FormData) {
    // Simulação de atualização
    console.log('Updating layout settings:');
    console.log('Form data received:', {
        primaryColor: formData.get('primaryColor'),
        backgroundColor: formData.get('backgroundColor'),
        accentColor: formData.get('accentColor'),
        headlineFont: formData.get('headlineFont'),
        bodyFont: formData.get('bodyFont'),
        socialInstagram: formData.get('socialInstagram'),
        socialFacebook: formData.get('socialFacebook'),
        socialYoutube: formData.get('socialYoutube'),
    });
    return { success: true, message: 'Tema salvo com sucesso (simulação)!' };
}

export async function handleAdminLogin(formData: FormData): Promise<{success: true} | {success: false, error: string}> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const remember = formData.get('remember');

  // Simulação: credenciais fixas para o administrador
  if (email === 'admin@coposmania.com' && password === '12345') {
      cookies().set('admin-session', 'admin-logged-in', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: remember ? 60 * 60 * 24 * 7 : undefined, // 7 dias ou sessão
          path: '/',
      });
      return { success: true };
  }
  
  // Lançar um erro é mais idiomático para o try/catch no formulário
  throw new Error("Credenciais inválidas. Verifique o email e a senha.");
}

export async function handleConvertModelToGlb(input: ConvertToGlbInput) {
    try {
        const result = await convertToGlb(input);
        return { success: true, glbDataUri: result.glbDataUri };
    } catch (error) {
        console.error('Error converting model to GLB:', error);
        return { success: false, error: 'Falha ao converter o modelo.' };
    }
}
