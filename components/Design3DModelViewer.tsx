"use client";

import { Component, ReactNode, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Center, useGLTF } from "@react-three/drei";

class ModelErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}

function Modelo({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

export default function Design3DModelViewer({ url }: { url: string }) {
  return (
    <ModelErrorBoundary
      fallback={
        <div className="w-full h-full flex items-center justify-center text-danger text-sm text-center px-4">
          No se pudo cargar el modelo en el visor (puede ser un problema de CORS del proveedor
          o que la URL haya expirado). Podés descargarlo igual y abrirlo en un visor GLB externo.
        </div>
      }
    >
      <Canvas camera={{ position: [3, 2, 3], fov: 45 }}>
        <color attach="background" args={["#0b0f14"]} />
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <directionalLight position={[-5, 2, -5]} intensity={0.4} />
        <Suspense fallback={null}>
          <Center>
            <Modelo url={url} />
          </Center>
        </Suspense>
        <OrbitControls enableDamping dampingFactor={0.1} />
      </Canvas>
    </ModelErrorBoundary>
  );
}
