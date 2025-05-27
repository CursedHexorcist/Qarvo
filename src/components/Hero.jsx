import Typewriter from "typewriter-effect";
import { curve } from "../assets";
import Button from "./Button";
import Section from "./Section";
import { useEffect, useRef } from 'react';

const Hero = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas.getContext('webgl2');
    
    if (!gl) {
      console.error('WebGL2 not supported in your browser');
      return;
    }

    // Vertex shader source
    const vertexShaderSource = `#version 300 es
    precision highp float;
    in vec4 position;
    void main() {
      gl_Position = position;
    }`;

    // Fragment shader source with improved stars
    const fragmentShaderSource = `#version 300 es
    precision highp float;
    out vec4 O;
    uniform vec2 resolution;
    uniform float time;
    
    #define FC gl_FragCoord.xy
    #define T time
    #define R resolution
    #define MN min(R.x,R.y)
    
    // Improved noise functions for more natural star patterns
    float hash(vec2 p) {
      p = fract(p * vec2(123.34, 456.21));
      p += dot(p, p + 45.32);
      return fract(p.x * p.y);
    }
    
    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      
      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + 1.0);
      
      return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
    }
    
    float fbm(vec2 p) {
      float total = 0.0;
      float amplitude = 0.5;
      mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
      
      for (int i = 0; i < 6; i++) {
        total += amplitude * noise(p);
        p = rot * p * 2.0;
        amplitude *= 0.5;
      }
      
      return total;
    }
    
    // Star field with improved realism
    vec3 starField(vec2 uv, float time) {
      vec3 color = vec3(0.0);
      float density = 0.8; // Star density
      float brightness = 1.5; // Overall brightness
      float twinkleSpeed = 0.5; // Twinkling speed
      
      // Base star field
      for (int i = 0; i < 100; i++) {
        vec2 p = uv * float(i + 1) * 10.0;
        float rnd = hash(p);
        
        if (rnd > density) continue;
        
        // Star position with slight movement
        p += 0.1 * vec2(
          sin(time * 0.3 + float(i) * 1.2),
          cos(time * 0.2 + float(i) * 1.5)
        );
        
        // Star size and brightness
        float star = 0.01 / length(fract(p) - 0.5);
        star *= smoothstep(0.9, 1.0, rnd) * brightness;
        
        // Twinkling effect
        star *= 0.7 + 0.3 * sin(time * twinkleSpeed + float(i) * 10.0);
        
        // Color variation (mostly white with slight hue variations)
        vec3 starColor = mix(
          vec3(1.0, 1.0, 1.0),
          vec3(0.8, 0.9, 1.0),
          hash(p * 2.0)
        );
        
        color += star * starColor;
      }
      
      return color;
    }
    
    // Shooting stars
    vec3 shootingStars(vec2 uv, float time) {
      vec3 color = vec3(0.0);
      float speed = 2.0; // Shooting star speed
      
      // Multiple shooting stars with different timing
      for (int i = 0; i < 3; i++) {
        float starTime = mod(time * speed + float(i) * 3.0, 20.0);
        
        if (starTime > 5.0) continue; // Only show for first 5 seconds of cycle
        
        vec2 dir = normalize(vec2(-0.5, 0.3 + 0.1 * float(i)));
        vec2 pos = vec2(1.5, 0.7 - 0.3 * float(i)) - dir * starTime;
        
        float dist = length(uv - pos);
        float star = 0.02 / dist;
        
        // Glow effect
        star *= exp(-dist * 20.0);
        
        // Tail effect
        vec2 tailDir = -dir;
        float tail = max(0.0, 1.0 - dot(normalize(uv - pos), tailDir));
        tail = pow(tail, 5.0) * 0.1 / (dist + 0.01);
        
        // Color with slight variation
        vec3 starColor = mix(
          vec3(1.0, 0.9, 0.8),
          vec3(0.8, 0.9, 1.0),
          float(i) * 0.3
        );
        
        color += (star + tail) * starColor;
      }
      
      return color;
    }
    
    void main() {
      vec2 uv = (FC - 0.5 * R) / MN;
      uv.x *= R.x / R.y; // Correct aspect ratio
      
      // Star field background
      vec3 color = starField(uv * 5.0, T);
      
      // Add shooting stars
      color += shootingStars(uv, T);
      
      // Subtle vignette effect
      float vignette = 1.0 - smoothstep(0.7, 1.4, length(uv));
      color *= vignette;
      
      // Final output with gamma correction
      O = vec4(pow(color, vec3(1.0/2.2)), 1.0);
    }`;

    // Compile shader function
    const compileShader = (gl, source, type) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compile error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      
      return shader;
    };

    // Create shader program
    const vertexShader = compileShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);
    
    if (!vertexShader || !fragmentShader) {
      return;
    }
    
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      return;
    }
    
    // Set up geometry
    const vertices = new Float32Array([-1, 1, -1, -1, 1, 1, 1, -1]);
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    
    const positionLocation = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    
    // Get uniform locations
    const resolutionLocation = gl.getUniformLocation(program, 'resolution');
    const timeLocation = gl.getUniformLocation(program, 'time');
    
    // Animation variables
    let startTime = null;
    
    // Render function
    const render = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const currentTime = (timestamp - startTime) / 1000;
      
      // Update viewport if canvas size changed
      if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
      }
      
      // Clear and render
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      
      gl.useProgram(program);
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform1f(timeLocation, currentTime);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      
      requestAnimationFrame(render);
    };
    
    // Start animation
    requestAnimationFrame(render);
    
    // Clean up on unmount
    return () => {
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteBuffer(vertexBuffer);
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
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-40 z-[-9]" />

      {/* Star Animation */}
      <canvas
        ref={canvasRef}
        className="absolute left-1/2 transform -translate-x-1/2 w-[130vw] h-[130vh] object-cover z-[-10] pointer-events-none
                   top-[-30%] sm:top-[-30%] md:top-[-20%] lg:top-[-15%] xl:top-[-12%] 2xl:top-[-10%]"
        style={{
          filter: "brightness(0.85)",
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
