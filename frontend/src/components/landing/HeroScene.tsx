import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sphere, Environment, ContactShadows } from "@react-three/drei";
import { useRef, useState, useEffect } from "react";
import type { Mesh, Group } from "three";

function PremiumSphere() {
  const meshRef = useRef<Mesh>(null);
  const groupRef = useRef<Group>(null);

  useFrame(({ clock, pointer }) => {
    if (!meshRef.current || !groupRef.current) return;
    const t = clock.getElapsedTime();
    // Smooth, slow rotation
    meshRef.current.rotation.y = t * 0.1;
    meshRef.current.rotation.z = t * 0.05;

    // Mouse parallax
    groupRef.current.position.x = pointer.x * 0.4;
    groupRef.current.position.y = pointer.y * 0.4;
    groupRef.current.rotation.x = pointer.y * 0.2;
    groupRef.current.rotation.y = pointer.x * 0.2;
  });

  return (
    <group ref={groupRef}>
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={1}>
        <Sphere ref={meshRef} args={[1.6, 64, 64]} position={[0, 0, 0]}>
          <meshPhysicalMaterial
            color="#0B1120"
            metalness={0.9}
            roughness={0.1}
            envMapIntensity={1.5}
            clearcoat={1}
            clearcoatRoughness={0.1}
            transmission={0.4}
            thickness={2}
          />
        </Sphere>
      </Float>
      {/* Subtle floating ring */}
      <Float speed={1} rotationIntensity={1} floatIntensity={0.5}>
        <mesh position={[0, 0, 0]} rotation={[Math.PI / 3, 0, 0]}>
          <torusGeometry args={[2.2, 0.01, 16, 100]} />
          <meshStandardMaterial
            color="#3B82F6"
            emissive="#3B82F6"
            emissiveIntensity={0.5}
            opacity={0.5}
            transparent
          />
        </mesh>
      </Float>
      <Float speed={1.2} rotationIntensity={1} floatIntensity={0.8}>
        <mesh position={[0, 0, 0]} rotation={[-Math.PI / 4, Math.PI / 6, 0]}>
          <torusGeometry args={[2.6, 0.005, 16, 100]} />
          <meshStandardMaterial color="#06B6D4" opacity={0.3} transparent />
        </mesh>
      </Float>
    </group>
  );
}

function CSSFallbackSphere() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {/* Volumetric glow backdrop */}
      <div className="absolute w-[350px] h-[350px] rounded-full bg-gradient-to-tr from-blue-500/20 via-cyan-500/20 to-purple-500/20 blur-3xl opacity-60 animate-pulse" />
      {/* Outer orbit rings */}
      <div className="absolute w-[280px] h-[280px] rounded-full border border-blue-500/20 rotate-45 animate-spin [animation-duration:20s]" />
      <div className="absolute w-[320px] h-[320px] rounded-full border border-cyan-500/10 -rotate-12 animate-spin [animation-duration:35s]" />
      
      {/* Glass Orb */}
      <div className="relative w-48 h-48 rounded-full bg-gradient-to-b from-white/10 to-white/0 border border-white/15 shadow-[0_0_50px_rgba(59,130,246,0.2)] backdrop-blur-md overflow-hidden">
        {/* Shiny reflection highlight */}
        <div className="absolute top-2 left-6 w-32 h-16 bg-gradient-to-b from-white/20 to-transparent rounded-full filter blur-[1px] rotate-[-15deg]" />
      </div>
    </div>
  );
}

export function HeroScene() {
  const [webglAvailable, setWebglAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const isAvailable = !!(
        window.WebGLRenderingContext &&
        (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
      );
      setWebglAvailable(isAvailable);
    } catch {
      setWebglAvailable(false);
    }
  }, []);

  if (webglAvailable === null) {
    return null; // Don't render anything while checking
  }

  if (!webglAvailable) {
    return <CSSFallbackSphere />;
  }

  return (
    <div className="absolute inset-0 z-0 pointer-events-none mix-blend-screen opacity-80">
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        onCreated={({ gl }) => {
          // Listen to context loss to gracefully switch to CSS fallback
          gl.domElement.addEventListener("webglcontextlost", () => {
            setWebglAvailable(false);
          });
        }}
      >
        <ambientLight intensity={0.2} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" />
        <pointLight position={[-10, -10, -5]} intensity={1} color="#3B82F6" />

        <PremiumSphere />

        <ContactShadows
          position={[0, -2.5, 0]}
          opacity={0.4}
          scale={10}
          blur={2.5}
          far={4}
          color="#0B1120"
        />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
