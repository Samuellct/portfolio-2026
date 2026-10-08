'use client'

import { useEffect, useRef } from 'react'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { RISO } from '@/lib/theme'

// The hero's night plate (DEC-16i): a sparse pastel sky printed in halftone,
// under a film grain, ending in a paper halftone fringe. One WebGL draw call.
//
// Motion: the sky turns very slowly around a point far below the screen, on three
// depth planes (0.5 / 1.5 / 3 px/s). The former WaveBackground survives as the
// sine field that makes the stars sway (same frequencies), plus a light pointer
// parallax and a phased twinkle on about one star in ten. Reduced motion prints a
// single still frame.

const PASTELS: Array<[number, [number, number, number]]> = [
  [0.3, [255, 179, 220]], // pink ink, pastel
  [0.35, [158, 201, 240]], // blue ink, pastel
  [0.27, [255, 244, 232]], // warm white
  [0.08, [255, 243, 160]], // yellow ink, pastel (rare)
]
const PLANE_SPEED = [0.5, 1.5, 3] // px/s along the arc
const CANDIDATES = 160
const CROSSES = 4
// Lifted, slightly warm black: the plate is printed, not a screen void.
const BASE = [17 / 255, 16 / 255, 23 / 255]
const FRINGE_HEIGHT = 56
const FRINGE_STEP = 6

const vertexShader = `
attribute vec4 aA; // x, y (css px), size (css px), kind (0 pinprick, 1 halo, 2 cross)
attribute vec4 aB; // plane, softness, twinkle phase, twinkle on
attribute vec4 aColor;
uniform vec2 uRes;
uniform float uDpr;
uniform float uTime;
uniform float uDist;
uniform float uHalf;
uniform vec2 uMouse;
varying vec4 vColor;
varying float vKind;
varying float vSoft;

void main() {
  float plane = aB.x;
  float speed = plane < 0.5 ? ${PLANE_SPEED[0].toFixed(1)} : (plane < 1.5 ? ${PLANE_SPEED[1].toFixed(1)} : ${PLANE_SPEED[2].toFixed(1)});
  vec2 c = vec2(uRes.x * 0.5, uRes.y * 0.5 + uDist);
  vec2 rel = aA.xy - c;
  float r = length(rel);
  float up = -1.5707963;
  float th = atan(rel.y, rel.x) + speed / uDist * uTime;
  float d = mod(th - up + uHalf, 2.0 * uHalf) - uHalf;
  vec2 p = c + r * vec2(cos(up + d), sin(up + d));

  // WaveBackground's sines, now a sway field.
  float amp = 2.0 + plane * 2.0;
  p += vec2(sin(aA.x * 0.004 + uTime * 0.15), sin(aA.y * 0.0025 + uTime * 0.1)) * amp;
  p += uMouse * (2.0 + plane * 3.0);

  vec2 clip = p / uRes * 2.0 - 1.0;
  gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
  gl_PointSize = aA.z * uDpr;

  float period = 4.0 + 5.0 * fract(aB.z * 7.31);
  float twinkle = 1.0 + 0.15 * aB.w * sin(uTime * 6.2831853 / period + aB.z * 6.2831853);
  vColor = vec4(aColor.rgb, aColor.a * twinkle);
  vKind = aA.w;
  vSoft = aB.y;
}
`

const fragmentShader = `
precision mediump float;
uniform float uDotScale;
varying vec4 vColor;
varying float vKind;
varying float vSoft;

void main() {
  vec2 q = gl_PointCoord * 2.0 - 1.0;
  float d2 = dot(q, q);
  float edge = 1.0 - smoothstep(0.8, 1.0, sqrt(d2));
  float light;
  if (vKind < 0.5) {
    light = exp(-d2 * mix(14.0, 5.0, vSoft));
  } else {
    float core = exp(-d2 * mix(60.0, 26.0, vSoft));
    float halo = exp(-d2 * 3.2);
    // Halftone halo: a 15-degree dot screen whose dots grow with the light.
    vec2 g = mat2(0.966, -0.259, 0.259, 0.966) * gl_FragCoord.xy / uDotScale;
    float cell = length(fract(g) - 0.5);
    float rad = halo * 0.6;
    float dots = 1.0 - smoothstep(rad - 0.07, rad + 0.07, cell);
    light = core + dots * 0.6 + halo * 0.16;
    if (vKind > 1.5) {
      vec2 a = abs(q);
      float spikes = max(exp(-a.y * 46.0) * pow(1.0 - a.x, 2.0), exp(-a.x * 46.0) * pow(1.0 - a.y, 2.0));
      light += spikes * 0.6;
    }
  }
  float k = light * edge * vColor.a;
  gl_FragColor = vec4(vColor.rgb * k, 1.0);
}
`

function seeded(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

function pickColor(t: number) {
  let acc = 0
  for (const [weight, rgb] of PASTELS) {
    acc += weight
    if (t <= acc) return rgb
  }
  return PASTELS[0][1]
}

// Same seed for every viewport, so the sky keeps its constellation across sizes.
function buildStars(width: number, height: number) {
  const rand = seeded(7)
  const desktop = width >= 1024
  const target = Math.max(28, Math.min(80, Math.round((width * height) / 22000)))
  // Keep the name and the four star-projects clear on desktop.
  const clear = (x: number, y: number) => {
    if (!desktop) return true
    const nx = (x - 0.5) / 0.27
    const ny = (y - 0.5) / 0.24
    if (nx * nx + ny * ny < 1) return false
    const slots = [[0.26, 0.22], [0.74, 0.24], [0.25, 0.76], [0.75, 0.74]]
    return slots.every(([sx, sy]) => Math.hypot((x - sx) * width, (y - sy) * height) > 110)
  }

  const a: number[] = []
  const b: number[] = []
  const c: number[] = []
  let crosses = 0
  for (let i = 0; i < CANDIDATES && a.length / 4 < target; i++) {
    const x = rand()
    const y = rand()
    const roll = rand()
    const soft = rand()
    const phase = rand()
    const twinkle = rand() < 0.1 ? 1 : 0
    const plane = Math.floor(rand() * 3)
    const color = pickColor(rand())
    if (!clear(x, y)) continue
    const kind = crosses < CROSSES && roll < 0.12 ? 2 : roll < 0.37 ? 1 : 0
    if (kind === 2) crosses++
    const size = kind === 2 ? 40 + soft * 10 : kind === 1 ? 22 + soft * 18 : 5 + soft * 4
    const alpha = kind === 0 ? 0.45 + phase * 0.35 : 0.85
    a.push(x * width, y * height, size, kind)
    b.push(plane, soft, phase, twinkle)
    c.push(color[0] / 255, color[1] / 255, color[2] / 255, alpha)
  }
  return { a: new Float32Array(a), b: new Float32Array(b), c: new Float32Array(c), count: a.length / 4 }
}

// Paper halftone fringe at the bottom edge: dots grow until they become paper.
function paintFringe(canvas: HTMLCanvasElement, dpr: number) {
  const w = canvas.clientWidth
  canvas.width = Math.round(w * dpr)
  canvas.height = Math.round(FRINGE_HEIGHT * dpr)
  const g = canvas.getContext('2d')
  if (!g) return
  g.scale(dpr, dpr)
  g.fillStyle = RISO.paper
  for (let row = 0, y = FRINGE_STEP / 2; y < FRINGE_HEIGHT + FRINGE_STEP; row++, y += FRINGE_STEP * 0.866) {
    const t = Math.min(1, y / FRINGE_HEIGHT)
    const r = FRINGE_STEP * 0.72 * Math.pow(t, 1.6)
    if (r < 0.35) continue
    for (let x = (row % 2) * (FRINGE_STEP / 2); x < w + FRINGE_STEP; x += FRINGE_STEP) {
      g.beginPath()
      g.arc(x, y, r, 0, Math.PI * 2)
      g.fill()
    }
  }
}

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader
  if (process.env.NODE_ENV !== 'production') console.warn('[HeroSky]', gl.getShaderInfoLog(shader))
  return null
}

export default function HeroSky() {
  const skyRef = useRef<HTMLCanvasElement>(null)
  const fringeRef = useRef<HTMLCanvasElement>(null)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    const canvas = skyRef.current
    const fringe = fringeRef.current
    if (!canvas || !fringe) return
    const gl = canvas.getContext('webgl', { antialias: false, alpha: false, premultipliedAlpha: false })
    if (!gl) return

    const vs = compile(gl, gl.VERTEX_SHADER, vertexShader)
    const fs = compile(gl, gl.FRAGMENT_SHADER, fragmentShader)
    const program = gl.createProgram()
    if (!vs || !fs || !program) return
    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      if (process.env.NODE_ENV !== 'production') console.warn('[HeroSky]', gl.getProgramInfoLog(program))
      return
    }
    gl.useProgram(program)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.ONE, gl.ONE)
    gl.clearColor(BASE[0], BASE[1], BASE[2], 1)

    const u = (name: string) => gl.getUniformLocation(program, name)
    const uRes = u('uRes'), uDpr = u('uDpr'), uDotScale = u('uDotScale'), uTime = u('uTime'), uDist = u('uDist'), uHalf = u('uHalf'), uMouse = u('uMouse')
    const buffers = (['aA', 'aB', 'aColor'] as const).map((name) => {
      const buffer = gl.createBuffer()
      const loc = gl.getAttribLocation(program, name)
      return { buffer, loc }
    })

    let count = 0
    let frame = 0
    let visible = true
    let last = 0
    const start = performance.now()
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 }
    const mobile = window.matchMedia('(max-width: 767px)').matches
    const minFrameMs = mobile ? 1000 / 30 : 0

    const draw = (seconds: number) => {
      gl.uniform1f(uTime, seconds)
      gl.uniform2f(uMouse, mouse.x, mouse.y)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.drawArrays(gl.POINTS, 0, count)
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      gl.viewport(0, 0, canvas.width, canvas.height)
      const dist = 1.6 * Math.max(w, h)
      gl.uniform2f(uRes, w, h)
      gl.uniform1f(uDpr, dpr)
      gl.uniform1f(uDotScale, 2.6 * dpr)
      gl.uniform1f(uDist, dist)
      // Half the arc that covers the screen plus a margin, seen from the pivot.
      gl.uniform1f(uHalf, Math.atan((w / 2 + 80) / (dist - h / 2 - 80)))
      const stars = buildStars(w, h)
      count = stars.count
      ;[stars.a, stars.b, stars.c].forEach((data, i) => {
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers[i].buffer)
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)
        gl.enableVertexAttribArray(buffers[i].loc)
        gl.vertexAttribPointer(buffers[i].loc, 4, gl.FLOAT, false, 0, 0)
      })
      paintFringe(fringe, dpr)
      draw(prefersReducedMotion ? 0 : (performance.now() - start) / 1000)
    }

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick)
      if (!visible || document.hidden || now - last < minFrameMs) return
      last = now
      mouse.x += (mouse.tx - mouse.x) * 0.04
      mouse.y += (mouse.ty - mouse.y) * 0.04
      draw((now - start) / 1000)
    }

    const onPointer = (e: PointerEvent) => {
      mouse.tx = (e.clientX / window.innerWidth) * 2 - 1
      mouse.ty = (e.clientY / window.innerHeight) * 2 - 1
    }
    const onLost = (e: Event) => {
      e.preventDefault()
      cancelAnimationFrame(frame)
    }

    resize()
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting })
    observer.observe(canvas)
    window.addEventListener('resize', resize)
    canvas.addEventListener('webglcontextlost', onLost)
    if (!prefersReducedMotion) {
      window.addEventListener('pointermove', onPointer, { passive: true })
      frame = requestAnimationFrame(tick)
    }

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onPointer)
      canvas.removeEventListener('webglcontextlost', onLost)
      buffers.forEach(({ buffer }) => gl.deleteBuffer(buffer))
      gl.deleteProgram(program)
      gl.deleteShader(vs)
      gl.deleteShader(fs)
    }
  }, [prefersReducedMotion])

  return (
    <div aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden">
      <canvas ref={skyRef} className="absolute inset-0 w-full h-full" />
      <div className="film-grain" />
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-primary to-transparent" />
      <canvas ref={fringeRef} className="absolute inset-x-0 bottom-0 w-full" style={{ height: FRINGE_HEIGHT }} />
    </div>
  )
}
