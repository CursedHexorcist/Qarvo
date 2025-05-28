import Typewriter from "typewriter-effect";
import { curve } from "../assets";
import Button from "./Button";
import Section from "./Section";
import { motion } from "framer-motion";
import { useRef } from "react";

const Hero = () => {
  const constraintsRef = useRef(null);

  // Shooting star animation variants
  const starVariants = {
    animate: {
      x: ["-30vw", "100vw"],
      y: ["-30vh", "100vh"],
      rotate: [0, 360],
      transition: {
        x: {
          duration: 8,
          repeat: Infinity,
          ease: "linear"
        },
        y: {
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        },
        rotate: {
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }
      }
    }
  };

  // Small twinkling stars
  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < 30; i++) {
      const size = Math.random() * 3 + 1;
      const duration = Math.random() * 5 + 3;
      const delay = Math.random() * 5;
      
      stars.push(
        <motion.div
          key={`star-${i}`}
          className="absolute rounded-full bg-white"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: 0.7
          }}
          animate={{
            opacity: [0.3, 0.9, 0.3],
            scale: [1, 1.3, 1]
          }}
          transition={{
            duration,
            repeat: Infinity,
            delay,
            ease: "easeInOut"
          }}
        />
      );
    }
    return stars;
  };

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

      {/* Overlay hitam transparan */}
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-20 z-[-9]" />

      {/* Shooting star animation with Framer Motion */}
      <div 
        ref={constraintsRef}
        className="absolute inset-0 w-full h-full z-[-10] pointer-events-none overflow-hidden"
      >
        {/* Shooting stars */}
        {[1, 2, 3].map((i) => (
          <motion.div
            key={`shooting-${i}`}
            className="absolute bg-gradient-to-r from-blue-400 to-purple-600 rounded-full"
            style={{
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 1 + 0.5}px`,
              left: `${Math.random() * 20}%`,
              top: `${Math.random() * 20}%`,
              filter: "blur(1px)",
              opacity: 0.8
            }}
            variants={starVariants}
            initial="animate"
            animate="animate"
            custom={i}
          />
        ))}

        {/* Twinkling stars */}
        {renderStars()}

        {/* Glow effect */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-b from-blue-900/10 to-purple-900/10"
          animate={{
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
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
                  delay: 50,
                  deleteSpeed: 30
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
                loading="lazy"
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
