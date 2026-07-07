import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTheme } from "../../context/ThemeContext";
import usePrefersReducedMotion from "../../hooks/usePrefersReducedMotion";

function ReelMesh({ dark }) {
  const group = useRef();
  const reduced = usePrefersReducedMotion();

  useFrame((state, delta) => {
    if (reduced || !group.current) return;
    group.current.rotation.y += delta * 0.28;
    group.current.rotation.x += delta * 0.05;
    // Gentle bob so the piece feels alive rather than just spinning in place.
    group.current.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.12;
  });

  const lilac = dark ? "#DDA9F7" : "#C98AF0";
  const mint = dark ? "#7FE8BE" : "#4FC79A";
  const pink = dark ? "#F781BC" : "#F0579F";

  return (
    <group ref={group}>
      <mesh rotation={[0.5, 0.3, 0]}>
        <torusGeometry args={[1.5, 0.09, 16, 64]} />
        <meshStandardMaterial color={lilac} metalness={0.15} roughness={0.4} />
      </mesh>
      <mesh rotation={[-0.4, 0.9, 0.3]}>
        <torusGeometry args={[1.05, 0.05, 16, 64]} />
        <meshStandardMaterial color={mint} metalness={0.1} roughness={0.45} />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[0.32, 0]} />
        <meshStandardMaterial color={pink} metalness={0.2} roughness={0.3} />
      </mesh>
    </group>
  );
}

export default function Reel3D() {
  const { theme } = useTheme();
  return (
    <Canvas
      camera={{ position: [0, 0, 4.6], fov: 42 }}
      gl={{ alpha: true, antialias: true }}
      style={{ width: "100%", height: "100%" }}
      dpr={[1, 1.8]}
    >
      <ambientLight intensity={0.75} />
      <directionalLight position={[3, 3, 4]} intensity={1} />
      <directionalLight position={[-3, -2, -3]} intensity={0.4} />
      <Suspense fallback={null}>
        <ReelMesh dark={theme === "dark"} />
      </Suspense>
    </Canvas>
  );
}
