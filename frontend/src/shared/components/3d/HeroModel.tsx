import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial, Stars } from '@react-three/drei';
import * as THREE from 'three';

export function HeroModel() {
  const sphereRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  // Smoothly rotate the whole group based on mouse position
  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    
    // Gentle floating rotation
    groupRef.current.rotation.y = Math.sin(t / 4) / 4;
    groupRef.current.rotation.x = Math.cos(t / 4) / 4;

    // Mouse parallax
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, (state.mouse.x * 2), 0.05);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, (state.mouse.y * 2), 0.05);
  });

  return (
    <group ref={groupRef}>
      {/* Background Particles */}
      <Stars radius={50} depth={50} count={3000} factor={4} saturation={1} fade speed={1} />
      
      {/* Core Glowing Orb (Represents AI Brain) */}
      <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
        <Sphere ref={sphereRef} args={[1.5, 64, 64]} position={[0, 0, 0]}>
          <MeshDistortMaterial 
            color="#3b82f6" // blue-500
            emissive="#1d4ed8" // blue-700
            envMapIntensity={1}
            clearcoat={1}
            clearcoatRoughness={0.1}
            metalness={0.9}
            roughness={0.1}
            distort={0.5}
            speed={4}
          />
        </Sphere>
      </Float>

      {/* Orbiting Elements (Represents Data/Resume Points) */}
      <Float speed={3} rotationIntensity={2} floatIntensity={1.5}>
        <mesh position={[2, 1.5, 1]}>
          <octahedronGeometry args={[0.4]} />
          <meshPhysicalMaterial color="#8b5cf6" emissive="#6d28d9" wireframe />
        </mesh>
      </Float>

      {/* Floating UI Elements */}
      <Float speed={2} rotationIntensity={1.2} floatIntensity={1.5}>
        <mesh position={[2.5, -0.5, 2]}>
          <boxGeometry args={[0.3, 0.3, 0.3]} />
          <meshPhysicalMaterial color="#38bdf8" emissive="#0284c7" wireframe />
        </mesh>
      </Float>

      <Float speed={2.5} rotationIntensity={1} floatIntensity={2}>
        <mesh position={[-2, -1, 0.5]}>
          <torusGeometry args={[0.6, 0.1, 16, 32]} />
          <meshPhysicalMaterial color="#ec4899" emissive="#be185d" wireframe />
        </mesh>
      </Float>

      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={2.5} color="#ffffff" />
      <pointLight position={[-10, -10, -5]} intensity={1.5} color="#3b82f6" />
    </group>
  );
}
