"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Vista3DConfig } from "@/lib/vista3d";

function Eslabon({
  index,
  total,
  length,
  radius,
  color,
}: {
  index: number;
  total: number;
  length: number;
  radius: number;
  color: string;
}) {
  if (index >= total) return null;
  const angle = Math.PI / 4.5;
  const rotation: [number, number, number] =
    index % 2 === 0 ? [0, 0, angle] : [angle, 0, 0];
  return (
    <group rotation={rotation}>
      <mesh position={[0, length / 2, 0]}>
        <cylinderGeometry args={[radius, radius, length, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <group position={[0, length, 0]}>
        <mesh>
          <sphereGeometry args={[radius * 1.3, 16, 16]} />
          <meshStandardMaterial color="#26313f" />
        </mesh>
        <Eslabon index={index + 1} total={total} length={length * 0.85} radius={radius * 0.8} color={color} />
      </group>
    </group>
  );
}

function Modelo({ config }: { config: Vista3DConfig }) {
  const { ancho, profundidad, alto, numEslabones, color, plataforma } = config;
  const segLength = Math.max(ancho, profundidad) * 0.4;
  const segRadius = Math.min(ancho, profundidad) * 0.08;

  return (
    <group>
      {plataforma && (
        <mesh position={[0, -alto / 2 - 0.5, 0]}>
          <boxGeometry args={[ancho * 1.4, 1, profundidad * 1.4]} />
          <meshStandardMaterial color="#1a2230" />
        </mesh>
      )}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[ancho, alto, profundidad]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {numEslabones > 0 && (
        <group position={[0, alto / 2, 0]}>
          <Eslabon index={0} total={numEslabones} length={segLength} radius={segRadius} color={color} />
        </group>
      )}
    </group>
  );
}

export default function Design3DScene({ config }: { config: Vista3DConfig }) {
  const escala = Math.max(config.ancho, config.profundidad, config.alto);
  return (
    <Canvas camera={{ position: [escala * 0.7, escala * 1.4, escala * 2.1], fov: 45 }}>
      <color attach="background" args={["#0b0f14"]} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[escala, escala * 2, escala]} intensity={1} />
      <gridHelper args={[escala * 6, 20, "#26313f", "#1a2230"]} />
      <Modelo config={config} />
      <OrbitControls enableDamping dampingFactor={0.1} minDistance={escala} maxDistance={escala * 10} />
    </Canvas>
  );
}
