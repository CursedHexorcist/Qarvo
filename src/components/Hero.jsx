import Typewriter from "typewriter-effect";
import { curve } from "../assets";
import Button from "./Button";
import Section from "./Section";
import { useEffect, useRef } from "react";

const Hero = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const gl = canvas.getContext("webgl2");
    if (!gl) return;

    // Vertex shader source
    const vertexSrc = `#version 300 es
    precision highp float;
    in vec4 position;
    void main() {
      gl_Position = position;
    }`;

    // Fragment shader source (optimized shooting star animation)
    const fragmentSrc = `#version 300 es
    precision highp float;
    out vec4 O;
    uniform vec2 resolution;
    uniform float time;
    
    // Optimized noise functions
    float rnd(vec2 p) {
      p = fract(p * vec2(12.9898, 78.233));
      p += dot(p, p + 34.56);
      return fract(p.x * p.y);
    }
    
    float noise(in vec2 p) {
      vec2 i = floor(p), f = fract(p), u = f * f * (3. - 2. * f);
      return mix(mix(rnd(i), rnd(i + vec2(1, 0)), u.x),
                mix(rnd(i + vec2(0, 1)), rnd(i + 1.), u.x), u.y);
    }
    
    float fbm(vec2 p) {
      float t = 0., a = 0.5; 
      for (int i = 0; i < 3; i++) {
        t += a * noise(p);
        p *= 2.;
        a *= 0.5;
      }
      return t;
    }
    
    float clouds(vec2 p) {
      float t = 0.;
      for (float i = 0.; i < 2.; i++) {
        t = mix(t, fbm(i * 5. + p), fbm(i * 3. + p));
        p *= 1.5;
      }
      return t;
    }
    
    void main(void) {
      vec2 uv = (gl_FragCoord.xy - .5 * resolution) / min(resolution.x, resolution.y);
      vec3 col = vec3(0);
      
      // Purple cloud background (dark purple + amethyst mix)
      float bg = clouds(uv * 1.5 + time * 0.1);
      vec3 cloudColor = mix(
        mix(vec3(0.25, 0.1, 0.3), vec3(0.15, 0.05, 0.2), bg),
        vec3(0.35, 0.15, 0.45),
        bg * 0.7
      );
      col = cloudColor;
      
      // Simplified stars with purple aura
      for (float i = 1.; i < 8.; i++) {
        vec2 p = uv * (1.0 + 0.1 * sin(time * 0.2 + i));
        float d = length(p);
        float star = 0.01 / d * (0.7 + 0.3 * sin(time * 0.5 + i));
        
        // White star core with purple aura
        vec3 starColor = mix(
          vec3(1.0), // White core
          vec3(0.7, 0.3, 1.0), // Purple aura
          smoothstep(0.01, 0.1, d)
        );
        
        col += star * starColor * (0.5 + 0.5 * noise(vec2(i, i)));
      }
      
      O = vec4(col, 1);
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
    let lastFrameTime = startTime;
    const targetFPS = 30; // Lower target FPS for reduced animation intensity
    const frameDelay = 1000 / targetFPS;
    
    function render(now) {
      // Throttle frame rate
      if (now - lastFrameTime < frameDelay) {
        requestAnimationFrame(render);
        return;
      }
      lastFrameTime = now;
      
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
      
      requestAnimationFrame(render);
    }
    
    requestAnimationFrame(render);

    return () => {
      // Clean up
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

      {/* Optimized shooting star animation */}
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
