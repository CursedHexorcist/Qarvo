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

    // Fragment shader source (shooting star animation)
    const fragmentSrc = `#version 300 es
    precision highp float;
    out vec4 O;
    uniform vec2 resolution;
    uniform float time;
    
    // Returns a pseudo random number for a given point (white noise)
    float rnd(vec2 p) {
      p = fract(p * vec2(12.9898, 78.233));
      p += dot(p, p + 34.56);
      return fract(p.x * p.y);
    }
    
    // Returns a pseudo random number for a given point (value noise)
    float noise(in vec2 p) {
      vec2 i = floor(p), f = fract(p), u = f * f * (3. - 2. * f);
      float
      a = rnd(i),
      b = rnd(i + vec2(1, 0)),
      c = rnd(i + vec2(0, 1)),
      d = rnd(i + 1.);
      return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
    }
    
    // Returns a pseudo random number for a given point (fractal noise)
    float fbm(vec2 p) {
      float t = 0., a = 1.; mat2 m = mat2(1., -.5, .2, 1.2);
      for (int i = 0; i < 5; i++) {
        t += a * noise(p);
        p *= 2. * m;
        a *= .5;
      }
      return t;
    }
    
    float clouds(vec2 p) {
      float d = 1., t = 0.;
      for (float i = 0.; i < 3.; i++) {
        float a = d * fbm(i * 10. + p.x * .2 + .2 * (1. + i) * p.y + d + i * i + p);
        t = mix(t, d, a);
        d = a;
        p *= 2. / (i + 1.);
      }
      return t;
    }
    
    void main(void) {
      vec2 uv = (gl_FragCoord.xy - .5 * resolution) / min(resolution.x, resolution.y);
      vec2 st = uv * vec2(2, 1);
      vec3 col = vec3(0);
      float bg = clouds(vec2(st.x + time * .5, -st.y));
      uv *= 1. - .3 * (sin(time * .2) * .5 + .5);
      
      for (float i = 1.; i < 12.; i++) {
        uv += .1 * cos(i * vec2(.1 + .01 * i, .8) + i * i + time * .5 + .1 * uv.x);
        vec2 p = uv;
        float d = length(p);
        col += .00125 / d * (cos(sin(i) * vec3(1, 2, 3)) + 1.);
        float b = noise(i + p + bg * 1.731);
        col += .002 * b / length(max(p, vec2(b * p.x * .02, p.y)));
        col = mix(col, vec3(bg * .25, bg * .137, bg * .05), d);
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
    
    function render(now) {
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

      {/* Shooting star animation */}
      <canvas
        ref={canvasRef}
        className="absolute left-1/2 transform -translate-x-1/2 w-[130vw] h-[130vh] object-cover z-[-10] pointer-events-none
                   top-[-30%] sm:top-[-30%] md:top-[-20%] lg:top-[-15%] xl:top-[-12%] 2xl:top-[-10%]"
        style={{
          filter: "brightness(0.75)",
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
