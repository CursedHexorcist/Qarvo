import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, TorusKnot } from '@react-three/drei';
import * as THREE from 'three';
import Typewriter from 'typewriter-effect';
import { curve } from "../assets";
import Button from "./Button";
import Section from "./Section";

const ParticleField = ({ count = 2500 }) => {
  const particles = new THREE.BufferGeometry();
  const posArray = new Float32Array(count * 3);

  for (let i = 0; i < count * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 10;
  }

  particles.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

  return (
    <Points positions={particles.attributes.position.array}>
      <PointMaterial
        size={0.03}
        color="#00aaff"
        transparent
        opacity={0.7}
        blending={THREE.AdditiveBlending}
        sizeAttenuation={true}
      />
    </Points>
  );
};

const AnimatedTorus = () => {
  const torusRef = useRef();

  useFrame(({ clock }) => {
    torusRef.current.rotation.x = clock.getElapsedTime() * 0.15;
    torusRef.current.rotation.y = clock.getElapsedTime() * 0.2;
  });

  return (
    <TorusKnot
      ref={torusRef}
      args={[1, 0.3, 100, 16]}
    >
      <meshPhysicalMaterial
        color="#00aaff"
        metalness={0.9}
        roughness={0.1}
        clearcoat={1}
        transmission={0.9}
        ior={1.5}
        emissive="#00aaff"
        emissiveIntensity={0.2}
      />
    </TorusKnot>
  );
};

const ThreeScene = () => {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 75 }}
      gl={{ antialias: true, alpha: true }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        opacity: 0.85
      }}
    >
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[1, 1, 1]}
        intensity={0.8}
        color="#ffffff"
      />
      <pointLight
        position={[2, 2, 2]}
        color="#00aaff"
        intensity={1.5}
        distance={10}
      />
      
      <ParticleField />
      <AnimatedTorus />
    </Canvas>
  );
};

const Hero = () => {
  return (
    <Section
      id="hero"
      customPaddings
      className="pt-[12rem] -mt-[5.25rem] relative overflow-hidden min-h-screen"
    >
      {/* Dark background gradient */}
      <div
        className="absolute inset-0 z-[-20] pointer-events-none"
        style={{
          background: "linear-gradient(180deg, #121212 0%, #000000 90%)",
        }}
      />

      {/* Three.js Animation */}
      <ThreeScene />

      {/* Main content */}
      <div className="container relative z-10">
        <div className="relative max-w-[62rem] mx-auto text-center mb-[4rem] md:mb-20 lg:mb-[6rem] pt-[5rem]">
          <h1 className="h1 mb-6 text-white">
            Empower Your Scripts With
            <br />
            <span className="text-[1.4rem] sm:text-[1.75rem] md:text-[2rem] leading-snug block">
              <Typewriter
                options={{
                  strings: [
                    "Fast Execution",
                    "Continuous Improvement",
                    "24/7 Support",
                    "User-Friendly Interface",
                    "Optimized Performance",
                  ],
                  autoStart: true,
                  loop: true,
                }}
              />
            </span>
          </h1>

          <p className="body-1 max-w-3xl mx-auto mb-6 text-n-2 lg:mb-8 text-gray-300">
            Unlock the next level of game scripting with{" "}
            <span className="inline-block relative font-semibold text-white">
              Qarvo
              <img
                src={curve}
                className="absolute top-full left-0 w-full xl:-mt-2 pointer-events-none select-none"
                width={624}
                height={28}
                alt="Curve"
              />
            </span>
            .network
          </p>

          <Button href="#pricing" white>
            Get started
          </Button>
        </div>
      </div>

      {/* Bottom gradient transition */}
      <div
        className="absolute bottom-0 left-0 w-full h-[12rem] z-[-5]"
        style={{
          background: "linear-gradient(to bottom, transparent, #000)",
        }}
      />
    </Section>
  );
};

export default Hero;
