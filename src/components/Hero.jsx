import Typewriter from "typewriter-effect";
import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import { curve } from "../assets";
import Button from "./Button";
import Section from "./Section";

const Hero = () => {
  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      opacity: [0, 1, 0.8],
      scale: [0.9, 1.05, 1],
      transition: { duration: 4, repeat: Infinity, repeatType: "reverse" }
    });

    // Lightning effect
    const interval = setInterval(() => {
      controls.start({
        x: [0, -5, 5, -3, 3, 0],
        transition: { duration: 0.5 }
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [controls]);

  return (
    <Section
      id="hero"
      customPaddings
      className="pt-[12rem] -mt-[5.25rem] relative overflow-hidden"
    >
      {/* Background gradient gelap halus */}
      <div
        className="absolute inset-0 z-[-20] pointer-events-none"
        style={{
          background: "linear-gradient(180deg, #121212 0%, #000000 90%)",
        }}
      />

      {/* Dimensional Rift Container */}
      <div className="absolute inset-0 z-[-10] overflow-hidden">
        {/* Base Rift Effect */}
        <motion.div
          className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[130vw] h-[130vh]"
          initial={{ opacity: 0 }}
          animate={controls}
        >
          {/* Main Rift - Central Tear */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(
                  circle at center,
                  rgba(98, 0, 234, 0.15) 0%,
                  rgba(98, 0, 234, 0) 70%
                )`,
              clipPath: `
                polygon(
                  50% 50%,
                  45% 30%,
                  55% 30%,
                  60% 40%,
                  65% 35%,
                  70% 45%,
                  75% 40%,
                  80% 50%,
                  75% 60%,
                  70% 55%,
                  65% 65%,
                  60% 60%,
                  55% 70%,
                  45% 70%,
                  40% 60%,
                  35% 65%,
                  30% 55%,
                  25% 60%,
                  20% 50%,
                  25% 40%,
                  30% 45%,
                  35% 35%,
                  40% 40%,
                  45% 30%
                )`
            }}
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1],
              transition: {
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }
            }}
          />

          {/* Crack Lines */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-purple-500"
              style={{
                height: "2px",
                width: `${Math.random() * 20 + 10}%`,
                left: `${Math.random() * 80 + 10}%`,
                top: `${Math.random() * 80 + 10}%`,
                transformOrigin: "center",
                boxShadow: "0 0 10px 1px rgba(255, 255, 255, 0.7)",
                opacity: 0.7
              }}
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 0.7, 0],
                width: [`${Math.random() * 10 + 5}%`, `${Math.random() * 25 + 15}%`],
                transition: {
                  duration: Math.random() * 3 + 2,
                  delay: Math.random() * 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }
              }}
            />
          ))}

          {/* Floating Multiverse Portals */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: `${Math.random() * 10 + 5}%`,
                height: `${Math.random() * 10 + 5}%`,
                left: `${Math.random() * 80 + 10}%`,
                top: `${Math.random() * 80 + 10}%`,
                background: `radial-gradient(
                  circle,
                  hsla(${Math.random() * 60 + 200}, 80%, 60%, 0.8) 0%,
                  hsla(${Math.random() * 60 + 200}, 80%, 40%, 0.2) 70%
                )`,
                filter: "blur(1px)",
                border: "1px solid rgba(255, 255, 255, 0.3)"
              }}
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 180],
                opacity: [0.3, 0.7, 0.3],
                transition: {
                  duration: Math.random() * 10 + 10,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
            />
          ))}

          {/* Lightning Effects */}
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-white"
              style={{
                height: "1px",
                width: "0%",
                left: `${Math.random() * 80 + 10}%`,
                top: `${Math.random() * 80 + 10}%`,
                filter: "blur(0.5px)",
                opacity: 0
              }}
              animate={{
                width: ["0%", `${Math.random() * 15 + 5}%`, "0%"],
                opacity: [0, 0.8, 0],
                transition: {
                  duration: 0.3,
                  delay: Math.random() * 5,
                  repeat: Infinity,
                  repeatDelay: Math.random() * 5
                }
              }}
            />
          ))}
        </motion.div>
      </div>

      {/* Konten utama */}
      <div className="container relative z-10">
        <div className="relative max-w-[62rem] mx-auto text-center mb-[4rem] md:mb-20 lg:mb-[6rem]">
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

      {/* Gradient transisi ke hitam pekat */}
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
