import Typewriter from "typewriter-effect";
import { curve } from "../assets";
import Button from "./Button";
import Section from "./Section";
import { useEffect, useRef } from "react";

const Hero = () => {
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const gl = canvas.getContext("webgl2");
    if (!gl) return;

    // Vertex shader source (simplified)
    const vertexSrc = `#version 300 es
    precision highp float;
    in vec4 position;
    void main() {
      gl_Position = position;
    }`;

    // Fragment shader source (optimized with requested colors)
    const fragmentSrc = `#version 300 es
    precision highp float;
    out vec4 O;
    uniform vec2 resolution;
    uniform float time;
    
    // Optimized noise functions
    float hash(vec2 p) {
      p = fract(p * vec2(12.9898, 78.233));
      p += dot(p, p + 34.56);
      return fract(p.x * p.y);
    }
    
    float noise(vec2 p) {
      vec2 i = floor(p), f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(
        mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
        mix(hash(i + vec2(0.0, 1.0)), hash(i + 1.0), f.x),
        f.y
      );
    }
    
    // Simplified cloud generation with purple colors
    float clouds(vec2 p) {
      float f = 0.0;
      p *= 0.5;
      mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
      f += 0.5 * noise(p); p *= m * 2.02;
      f += 0.25 * noise(p); p *= m * 2.03;
      f += 0.125 * noise(p);
      return f;
    }
    
    void main(void) {
      vec2 uv = (gl_FragCoord.xy - 0.5 * resolution) / min(resolution.x, resolution.y);
      vec3 col = vec3(0.0);
      
      // Background gradient: black to blue
      float grad = smoothstep(-0.8, 0.8, uv.y);
      col = mix(vec3(0.0, 0.0, 0.1), vec3(0.0, 0.05, 0.2), grad);
      
      // Purple clouds with requested colors
      float c = clouds(uv * 2.0 + time * 0.1);
      vec3 cloudColor = mix(
        mix(vec3(0.2, 0.0, 0.3), vec3(0.3, 0.0, 0.4), c), // dark purple to purple
        vec3(0.4, 0.1, 0.5), // dark amethyst
        c * 0.5
      );
      col = mix(col, cloudColor, c * 0.7);
      
      // Stars with white core and purple aura (optimized)
      vec2 starUV = uv * 10.0;
      float star = hash(floor(starUV + 0.5) * 0.8 + 0.2;
      star = pow(star, 50.0);
      vec2 starPos = fract(starUV) - 0.5;
      float starDist = length(starPos);
      
      // White star core
      float starCore = smoothstep(0.1, 0.0, starDist) * star;
      col += vec3(starCore);
      
      // Purple aura
      float aura = smoothstep(0.3, 0.0, starDist) * star * 0.5;
      col += vec3(0.5, 0.0, 0.7) * aura;
      
      // Rare shooting stars (reduced frequency)
      if (hash(vec2(time * 0.01)) > 0.995) {
        float t = fract(time * 0.5 + hash(uv.x));
        vec2 dir = normalize(vec2(1.0, 0.3));
        float d = dot(uv - dir * t, dir);
        float trail = exp(-abs(d) * 20.0) * exp(-t * 5.0);
        col += vec3(0.8, 0.8, 1.0) * trail * 0.8;
      }
      
      O = vec4(col, 1.0);
    }`;

    // Compile shader
    function compileShader(gl, source, type) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        return null;
      }
      return shader;
    }

    // Create program
    const vertexShader = compileShader(gl, vertexSrc, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(gl, fragmentSrc, gl.FRAGMENT_SHADER);
    
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      return;
    }

    // Set up geometry
    const vertices = new Float32Array([-1, 1, -1, -1, 1, 1, 1, -1]);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    
    const position = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    // Get uniform locations
    const resolutionLoc = gl.getUniformLocation(program, "resolution");
    const timeLoc = gl.getUniformLocation(program, "time");

    let startTime = performance.now();
    let lastTime = 0;
    const frameInterval = 1000 / 30; // Target 30 FPS to reduce lag
    
    function render(now) {
      // Throttle rendering to reduce lag
      if (now - lastTime < frameInterval) {
        animationFrameRef.current = requestAnimationFrame(render);
        return;
      }
      lastTime = now;
      
      // Update canvas size if needed
      if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
      }
      
      // Clear and render
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);
      
      // Set uniforms
      gl.uniform2f(resolutionLoc, canvas.width, canvas.height);
      gl.uniform1f(timeLoc, (now - startTime) * 0.001);
      
      // Draw
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      
      animationFrameRef.current = requestAnimationFrame(render);
    }
    
    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      // Clean up
      cancelAnimationFrame(animationFrameRef.current);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteBuffer(buffer);
    };
  }, []);

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

      {/* Optimized star animation */}
      <canvas
        ref={canvasRef}
        className="absolute left-1/2 transform -translate-x-1/2 w-[130vw] h-[130vh] object-cover z-[-10] pointer-events-none
                   top-[-30%] sm:top-[-30%] md:top-[-20%] lg:top-[-15%] xl:top-[-12%] 2xl:top-[-10%]"
        style={{
          filter: "brightness(0.8)",
        }}
      />

      <style>
        {`
          @media (max-width: 640px) {
            canvas {
              top: -50% !important;
              filter: brightness(0.9) !important;
            }
          }
          @media (min-width: 1920px) {
            canvas {
              top: -12% !important;
              transform: translateX(-50%) scale(1.1);
            }
          }
          @media (min-width: 2560px) {
            canvas {
              top: -10% !important;
              transform: translateX(-50%) scale(1.25);
            }
          }
        `}
      </style>

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
