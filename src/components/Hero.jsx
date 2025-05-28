import { useRef, useEffect } from "react";
import Typewriter from "typewriter-effect";
import { curve } from "../assets";
import Button from "./Button";
import Section from "./Section";
import { motion } from "framer-motion";

const Hero = () => {
  const containerRef = useRef(null);
  const starCount = 100;
  const shootingStarCount = 5;

  // Generate random stars
  const generateStars = () => {
    const stars = [];
    for (let i = 0; i < starCount; i++) {
      stars.push({
        id: `star-${i}`,
        size: Math.random() * 3 + 1,
        left: Math.random() * 100,
        top: Math.random() * 100,
        opacity: Math.random() * 0.7 + 0.3,
        duration: Math.random() * 10 + 5,
        delay: Math.random() * 10
      });
    }
    return stars;
  };

  // Generate shooting stars
  const generateShootingStars = () => {
    const stars = [];
    for (let i = 0; i < shootingStarCount; i++) {
      const startX = Math.random() * 20;
      const startY = Math.random() * 20;
      
      stars.push({
        id: `shooting-${i}`,
        startX,
        startY,
        endX: startX + 80 + Math.random() * 20,
        endY: startY + 80 + Math.random() * 20,
        size: Math.random() * 2 + 1,
        duration: Math.random() * 8 + 5,
        delay: Math.random() * 15,
        rotate: Math.random() * 360
      });
    }
    return stars;
  };

  const stars = generateStars();
  const shootingStars = generateShootingStars();

  return (
    <Section
      id="hero"
      customPaddings
      className="pt-[12rem] -mt-[5.25rem] relative overflow-hidden"
      ref={containerRef}
    >
      {/* Background gradient */}
      <div
        className="absolute inset-0 z-[-20] pointer-events-none"
        style={{
          background: "linear-gradient(180deg, #121212 0%, #000000 90%)",
        }}
      />

      {/* Static stars */}
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            width: `${star.size}px`,
            height: `${star.size}px`,
            left: `${star.left}%`,
            top: `${star.top}%`,
            opacity: star.opacity
          }}
          animate={{
            opacity: [star.opacity * 0.5, star.opacity, star.opacity * 0.5],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Shooting stars */}
      {shootingStars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute bg-gradient-to-r from-blue-400 to-purple-600 rounded-full"
          style={{
            width: `${star.size * 4}px`,
            height: `${star.size}px`,
            left: `${star.startX}%`,
            top: `${star.startY}%`,
            filter: "blur(1px)",
            opacity: 0.8,
            rotate: `${star.rotate}deg`
          }}
          initial={{
            x: 0,
            y: 0,
            opacity: 0
          }}
          animate={{
            x: `${star.endX - star.startX}vw`,
            y: `${star.endY - star.startY}vh`,
            opacity: [0, 0.8, 0],
            rotate: star.rotate + 360
          }}
          transition={{
            x: {
              duration: star.duration,
              repeat: Infinity,
              repeatDelay: star.delay,
              ease: "linear"
            },
            y: {
              duration: star.duration * 1.5,
              repeat: Infinity,
              repeatDelay: star.delay,
              ease: "easeInOut"
            },
            opacity: {
              duration: star.duration * 0.3,
              repeat: Infinity,
              repeatDelay: star.delay,
              ease: "easeInOut"
            },
            rotate: {
              duration: star.duration * 2,
              repeat: Infinity,
              repeatDelay: star.delay,
              ease: "linear"
            }
          }}
        />
      ))}

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
