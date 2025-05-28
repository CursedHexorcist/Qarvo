import { useRef, useEffect } from "react";
import Typewriter from "typewriter-effect";
import { curve } from "../assets";
import Button from "./Button";
import Section from "./Section";
import { motion } from "framer-motion";

const Hero = () => {
  const canvasRef = useRef(null);
  const glRef = useRef(null);
  const programRef = useRef(null);
  const timeRef = useRef(0);
  const animationRef = useRef(null);
  const mousePosRef = useRef([0, 0]);

  useEffect(() => {
    // Initialize WebGL
    const canvas = canvasRef.current;
    const gl = canvas.getContext("webgl2");
    if (!gl) return;

    glRef.current = gl;

    // Vertex shader source
    const vsSource = `#version 300 es
    precision highp float;
    in vec4 position;
    void main() {
      gl_Position = position;
    }`;

    // Fragment shader source (simplified version of the original)
    const fsSource = `#version 300 es
    precision highp float;
    out vec4 O;
    uniform vec2 resolution;
    uniform float time;
    uniform vec2 mouse;
    
    // Returns a pseudo random number for a given point (white noise)
    float rnd(vec2 p) {
      p = fract(p * vec2(12.9898, 78.233));
      p += dot(p, p + 34.56);
      return fract(p.x * p.y);
    }
    
    // Returns a pseudo random number for a given point (value noise)
    float noise(in vec2 p) {
      vec2 i = floor(p), f = fract(p), u = f * f * (3.0 - 2.0 * f);
      float a = rnd(i), b = rnd(i + vec2(1.0, 0.0));
      float c = rnd(i + vec2(0.0, 1.0)), d = rnd(i + 1.0);
      return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
    }
    
    // Returns a pseudo random number for a given point (fractal noise)
    float fbm(vec2 p) {
      float t = 0.0, a = 1.0; mat2 m = mat2(1.0, -0.5, 0.2, 1.2);
      for (int i = 0; i < 5; i++) {
        t += a * noise(p);
        p *= 2.0 * m;
        a *= 0.5;
      }
      return t;
    }
    
    float clouds(vec2 p) {
      float d = 1.0, t = 0.0;
      for (float i = 0.0; i < 3.0; i++) {
        float a = d * fbm(i * 10.0 + p.x * 0.2 + 0.2 * (1.0 + i) * p.y + d + i * i + p);
        t = mix(t, d, a);
        d = a;
        p *= 2.0 / (i + 1.0);
      }
      return t;
    }
    
    void main() {
      vec2 uv = (gl_FragCoord.xy - 0.5 * resolution) / min(resolution.x, resolution.y);
      vec2 st = uv * vec2(2.0, 1.0);
      vec3 col = vec3(0.0);
      float bg = clouds(vec2(st.x + time * 0.5, -st.y));
      
      uv *= 1.0 - 0.3 * (sin(time * 0.2) * 0.5 + 0.5);
      
      for (float i = 1.0; i < 12.0; i++) {
        uv += 0.1 * cos(i * vec2(0.1 + 0.01 * i, 0.8) + i * i + time * 0.5 + 0.1 * uv.x);
        vec2 p = uv;
        float d = length(p);
        col += 0.00125 / d * (cos(sin(i) * vec3(1.0, 2.0, 3.0) + 1.0);
        float b = noise(i + p + bg * 1.731);
        col += 0.002 * b / length(max(p, vec2(b * p.x * 0.02, p.y)));
        col = mix(col, vec3(bg * 0.25, bg * 0.137, bg * 0.05), d);
      }
      
      O = vec4(col, 1.0);
    }`;

    // Compile shader
    const compileShader = (gl, source, type) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        return null;
      }
      return shader;
    };

    // Create program
    const vs = compileShader(gl, vsSource, gl.VERTEX_SHADER);
    const fs = compileShader(gl, fsSource, gl.FRAGMENT_SHADER);
    
    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      return;
    }
    
    programRef.current = program;

    // Set up geometry
    const vertices = new Float32Array([-1, 1, -1, -1, 1, 1, 1, -1]);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const position = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    // Get uniform locations
    program.resolution = gl.getUniformLocation(program, "resolution");
    program.time = gl.getUniformLocation(program, "time");
    program.mouse = gl.getUniformLocation(program, "mouse");

    // Handle resize
    const handleResize = () => {
      canvas.width = window.innerWidth * window.devicePixelRatio;
      canvas.height = window.innerHeight * window.devicePixelRatio;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);

    // Mouse movement
    const handleMouseMove = (e) => {
      mousePosRef.current = [
        e.clientX * window.devicePixelRatio,
        (window.innerHeight - e.clientY) * window.devicePixelRatio
      ];
    };
    
    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    const animate = (time) => {
      timeRef.current = time * 0.001;
      
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(programRef.current);
      gl.uniform2f(programRef.current.resolution, canvas.width, canvas.height);
      gl.uniform1f(programRef.current.time, timeRef.current);
      gl.uniform2f(programRef.current.mouse, ...mousePosRef.current);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationRef.current);
      gl.deleteProgram(programRef.current);
    };
  }, []);

  return (
    <Section
      id="hero"
      customPaddings
      className="pt-[12rem] -mt-[5.25rem] relative overflow-hidden"
    >
      {/* Canvas for WebGL rendering */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full z-[-10] pointer-events-none"
      />

      {/* Overlay gradient */}
      <div
        className="absolute inset-0 z-[-9] pointer-events-none"
        style={{
          background: "linear-gradient(180deg, rgba(18, 18, 18, 0.8) 0%, rgba(0, 0, 0, 0.9) 90%)",
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
