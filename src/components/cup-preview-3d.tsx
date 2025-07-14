
'use client';

import * as THREE from 'three';
import React, { Suspense, Component, ReactNode, useState, useEffect, useMemo } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, Decal, useTexture, Environment, useGLTF } from '@react-three/drei';
import type { CupModel, GeneratedArt } from '@/lib/types';
import { DEGRADE_HEX_COLORS, RIM_COLORS } from '@/lib/cup-data';
import { Loader } from './loader';
import { PackageX } from 'lucide-react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';


// Error Boundary Component
interface ErrorBoundaryProps {
    children: ReactNode;
    fallback: ReactNode;
}
interface ErrorBoundaryState {
    hasError: boolean;
}
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        console.error("Caught a 3D rendering error:", error);
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("Uncaught error in 3D preview:", error, errorInfo);
    }
    
    // Reset error state when props change, allowing a new model to be tried
    componentDidUpdate(prevProps: ErrorBoundaryProps) {
        if (prevProps.children !== this.props.children) {
            this.setState({ hasError: false });
        }
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback;
        }
        return this.props.children;
    }
}


const ModelLoader = ({ url }: { url: string }) => {
  const extension = url.split('.').pop()?.toLowerCase();
  
  const scene = useLoader(
    (extension === 'dae' ? ColladaLoader : GLTFLoader) as any,
    url,
    (loader: any) => {
      if (loader instanceof GLTFLoader) {
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
        loader.setDRACOLoader(dracoLoader);
      }
    }
  );

  return <primitive object={scene.scene || scene} />;
};


interface CupMeshProps {
  cupModel: CupModel;
  art: GeneratedArt | null;
  modelUrl: string;
}

function CupMesh({ cupModel, art, modelUrl }: CupMeshProps) {
  const { nodes } = useGLTF(modelUrl, true);
  const cupNode = (nodes.Cup || nodes.cup || Object.values(nodes).find(n => n instanceof THREE.Mesh)) as THREE.Mesh;
  const rimNode = (nodes.Rim || nodes.rim) as THREE.Mesh;
  
  const modifiedGeometry = useMemo(() => {
    if (!cupNode?.geometry) return null;

    const newGeometry = cupNode.geometry.clone();
    newGeometry.computeVertexNormals();
    newGeometry.computeBoundingBox();
    const { min, max } = newGeometry.boundingBox!;
    const height = max.y - min.y;

    if (!newGeometry.attributes.uv) {
        newGeometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(newGeometry.attributes.position.count * 2), 2));
    }
    const uvAttribute = newGeometry.attributes.uv as THREE.BufferAttribute;

    for (let i = 0; i < uvAttribute.count; i++) {
        const y = newGeometry.attributes.position.getY(i);
        const v = (y - min.y) / height;
        uvAttribute.setXY(i, 0.5, v);
    }
    uvAttribute.needsUpdate = true;
    return newGeometry;
  }, [cupNode?.geometry]);

  const isTransparent = cupModel.opacityType === 'Transparente';
  const hasDegrade = !!(cupModel.degradeColor && cupModel.degradeColor !== 'Nenhum' && cupModel.degradePosition && cupModel.degradePosition !== 'Nenhum');

  const gradientTexture = useMemo(() => {
    if (typeof window === 'undefined' || !hasDegrade) return null;
    const canvas = document.createElement('canvas');
    canvas.width = 2;
    canvas.height = 128; // Reduced resolution
    const context = canvas.getContext('2d');
    if (!context) return null;
    
    const degradeColorHex = DEGRADE_HEX_COLORS[cupModel.degradeColor!];
    const baseColor = isTransparent ? 'rgba(255, 255, 255, 0.1)' : '#FFFFFF';
    
    const gradient = context.createLinearGradient(0, 0, 0, 128);
    if (cupModel.degradePosition === 'Cima') {
      gradient.addColorStop(0, degradeColorHex);
      gradient.addColorStop(1, baseColor);
    } else {
      gradient.addColorStop(0, baseColor);
      gradient.addColorStop(1, degradeColorHex);
    }
    context.fillStyle = gradient;
    context.fillRect(0, 0, 2, 128);
    return new THREE.CanvasTexture(canvas);
  }, [hasDegrade, cupModel.degradeColor, cupModel.degradePosition, isTransparent]);

  const artTexture = useTexture(art?.imageUrl || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7');
  
  if (!modifiedGeometry) {
    return null; 
  }

  return (
    <group dispose={null}>
      <mesh geometry={modifiedGeometry} castShadow>
        <meshStandardMaterial
          color={hasDegrade ? '#ffffff' : cupModel.colorHex}
          map={gradientTexture}
          roughness={0.2}
          metalness={0.1}
          transparent={true}
          opacity={isTransparent ? 0.6 : 1.0}
          side={THREE.DoubleSide}
        />
        {art && (
            <Suspense fallback={null}>
              <Decal
                  position={[0, 0.1, 0.4]}
                  rotation={[0, 0, 0]}
                  scale={[0.6, 0.5, 0.6]}
                  map={artTexture}
              />
            </Suspense>
        )}
      </mesh>
      {rimNode && cupModel.rimColor && cupModel.rimColor !== 'Nenhuma' && (
        <mesh
          geometry={rimNode.geometry}
        >
          <meshStandardMaterial
            color={RIM_COLORS[cupModel.rimColor]}
            emissive={RIM_COLORS[cupModel.rimColor]}
            emissiveIntensity={0.4}
            metalness={0.8}
            roughness={0.2}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  );
}

interface CupPreview3DProps {
  cupModel: CupModel;
  art: GeneratedArt | null;
  modelUrl: string | null;
}

export default function CupPreview3D({ cupModel, art, modelUrl }: CupPreview3DProps) {
  const [modelExists, setModelExists] = useState<boolean | null>(null);

  const finalModelUrl = modelUrl || cupModel.modelUrl || '/models/cup.glb';

  useEffect(() => {
    if (!finalModelUrl) {
      setModelExists(false);
      return;
    }
    // Assume blob URLs from createObjectURL are always valid
    if (finalModelUrl.startsWith('blob:')) {
      setModelExists(true);
      return;
    }

    fetch(finalModelUrl)
      .then(response => {
        const contentType = response.headers.get("content-type");
        // Check if the request was successful AND the content is not an HTML/XML error page
        const isValid = response.ok && contentType && !contentType.includes('text/html') && !contentType.includes('application/xml');
        setModelExists(isValid);
      })
      .catch(() => setModelExists(false));
  }, [finalModelUrl]);

  const GenericErrorFallback = (
    <div className="flex flex-col items-center justify-center h-full text-center p-4 bg-destructive/20 text-destructive-foreground">
        <PackageX className="w-16 h-16 mb-4" />
        <h3 className="font-bold">Erro ao Carregar Modelo</h3>
        <p className="text-sm mt-1">Não foi possível carregar o modelo 3D. Verifique se o arquivo é válido.</p>
    </div>
  );

  if (modelExists === null) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader message="Carregando preview 3D..." />
      </div>
    );
  }

  if (!modelExists) {
     return (
        <div className="flex flex-col items-center justify-center h-full text-center p-4 bg-muted/50 text-muted-foreground">
            <PackageX className="w-16 h-16 mb-4" />
            <h3 className="font-bold text-card-foreground">Sem Preview 3D</h3>
            <p className="text-sm mt-1">Nenhum modelo 3D foi carregado para este produto.</p>
        </div>
    );
  }
  
  const isGlb = finalModelUrl.toLowerCase().endsWith('.glb') || finalModelUrl.toLowerCase().endsWith('.gltf');
  
  return (
    <ErrorBoundary fallback={GenericErrorFallback}>
      <Suspense fallback={
            <div className="flex items-center justify-center h-full">
            <Loader showText={false} />
            </div>
      }>
        <Canvas shadows camera={{ position: [0, 0.2, 3], fov: 50 }} key={finalModelUrl}>
            <ambientLight intensity={0.7} />
            <directionalLight intensity={1.5} position={[5, 5, 5]} castShadow />
            {isGlb ? (
              <CupMesh 
                cupModel={cupModel} 
                art={art} 
                modelUrl={finalModelUrl}
              />
            ) : (
              <ModelLoader url={finalModelUrl} />
            )}
            <Environment preset="city" />
            <OrbitControls makeDefault autoRotate autoRotateSpeed={0.5} minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 1.8} />
        </Canvas>
      </Suspense>
    </ErrorBoundary>
  );
}
