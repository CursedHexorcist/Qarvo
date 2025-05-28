import Typewriter from "typewriter-effect";
import { curve } from "../assets";
import Button from "./Button";
import Section from "./Section";
import { useEffect, useRef } from "react";

const Hero = () => {
  const starsRef = useRef(null);

  useEffect(() => {
    // Create stars with CSS instead of WebGL
    const container = starsRef.current;
    if (!container) return;

    // Clear previous stars
    container.innerHTML = '';

    // Create stars
    const starCount = 100;
    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      
      // Random positioning
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      
      // Random size
      const size = Math.random() * 3;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      
      // Random animation delay
      star.style.animationDelay = `${Math.random() * 5}s`;
      
      container.appendChild(star);
    }

    // Create occasional shooting stars
    function createShootingStar() {
      if (!container) return;
      
      const shootingStar = document.createElement('div');
      shootingStar.className = 'shooting-star';
      
      // Random positioning
      shootingStar.style.left = `${Math.random() * 100}%`;
      shootingStar.style.top = `${Math.random() * 50}%`;
      
      container.appendChild(shootingStar);
      
      // Remove after animation completes
      setTimeout(() => {
        shootingStar.remove();
      }, 3000);
    }

    // Create shooting stars at intervals
    const shootingStarInterval = setInterval(createShootingStar, 3000);

    return () => {
      clearInterval(shootingStarInterval);
    };
  }, []);

  return (
    <Section
      id="hero"
      customPaddings
      className="pt-[12rem] -mt-[5.25rem] relative overflow-hidden"
    >
      {/* Background gradient */}
      <div
        className="absolute inset-0 z-[-20] pointer-events-none"
        style={{
          background: "linear-gradient(180deg, #000000 0%, #0a0a2a 100%)",
        }}
      />

      {/* Star container */}
      <div 
        ref={starsRef}
        className="absolute inset-0 z-[-10] overflow-hidden"
        style={{
          background: "radial-gradient(ellipse at center, rgba(90, 0, 150, 0.2) 0%, rgba(0, 0, 20, 0.8) 100%)"
        }}
      />

      {/* Cloud overlay */}
      <div 
        className="absolute inset-0 z-[-9] opacity-30"
        style={{
          background: `
            radial-gradient(circle at 20% 30%, rgba(80, 0, 120, 0.5) 0%, transparent 40%),
            radial-gradient(circle at 80% 60%, rgba(100, 0, 150, 0.5) 0%, transparent 40%),
            radial-gradient(circle at 40% 70%, rgba(60, 0, 100, 0.5) 0%, transparent 40%)
          `,
        }}
      />

      <style jsx>{`
        .star {
          position: absolute;
          background-color: white;
          border-radius: 50%;
          animation: twinkle 5s infinite;
          box-shadow: 0 0 5px 1px rgba(150, 0, 255, 0.8);
        }
        
        .shooting-star {
          position: absolute;
          width: 60px;
          height: 2px;
          background: linear-gradient(90deg, rgba(255,255,255,0) 0%, white 50%, rgba(150, 0, 255, 0.8) 100%);
          animation: shoot 3s linear;
          transform: rotate(-45deg);
          transform-origin: left;
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        
        @keyframes shoot {
          0% { 
            transform: translateX(0) translateY(0) rotate(-45deg);
            opacity: 0;
          }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { 
            transform: translateX(300px) translateY(300px) rotate(-45deg);
            opacity: 0;
          }
        }
      `}</style>

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

      {/* Gradient transisi */}
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
