'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArtGallery } from '@/components/art-gallery';
import { Loader } from '@/components/loader';
import { CUP_TYPES_SUMMARY } from '@/lib/cup-data';

export function CreatePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cupName = searchParams.get('cup');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Validate if cupName is a valid cup
  const isValidCup = cupName && CUP_TYPES_SUMMARY.some(c => c.name === cupName);

  useEffect(() => {
    // We only want to redirect if we are on the client and the cup is determined to be invalid.
    if (isClient && !isValidCup) {
      router.replace('/');
    }
  }, [isClient, isValidCup, router]);

  // Prevent rendering ArtGallery until we are on the client and have a valid cup.
  if (!isClient || !isValidCup) {
    return <div className="flex-1 flex items-center justify-center"><Loader message="Carregando..." /></div>;
  }
  
  // By this point, we are on the client and cupName is valid.
  return <ArtGallery selectedCupName={cupName} />;
}
