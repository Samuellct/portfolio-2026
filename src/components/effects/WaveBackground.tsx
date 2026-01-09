'use client'

import { useRef, useEffect } from 'react'
import * as THREE from 'three'

// Vertex Shader - transforme les positions des particules
const vertexShader = `
  uniform float uTime;
  uniform float uSize;
  uniform vec2 uMouse;
  
  attribute float aScale;
  attribute vec3 aRandomness;
  
  varying vec3 vColor;
  
  void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    
    // Wave effect - slower and more subtle
    float waveX = sin(modelPosition.x * 0.4 + uTime * 0.15) * 0.2;
    float waveY = sin(modelPosition.y * 0.25 + uTime * 0.1) * 0.2;
    float waveZ = sin(modelPosition.x * 0.2 + modelPosition.y * 0.2 + uTime * 0.12) * 0.3;
    
    modelPosition.x += waveX + aRandomness.x;
    modelPosition.y += waveY + aRandomness.y;
    modelPosition.z += waveZ + aRandomness.z;
    
    // Mouse interaction - very subtle push effect
    float distanceToMouse = length(modelPosition.xy - uMouse * 3.0);
    float mouseInfluence = smoothstep(4.0, 0.0, distanceToMouse) * 0.15;
    modelPosition.z += mouseInfluence;
    
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    
    gl_Position = projectedPosition;
    
    // Size attenuation - smaller particles
    gl_PointSize = uSize * aScale;
    gl_PointSize *= (1.0 / -viewPosition.z);
    
    // Color based on position and time - slower color shift
    float colorMix = sin(modelPosition.x * 0.15 + uTime * 0.08) * 0.5 + 0.5;
    vColor = mix(
      vec3(0.0, 0.94, 1.0),  // Cyan
      vec3(0.65, 0.33, 0.97), // Purple
      colorMix
    );
  }
`

// Fragment Shader - dessine chaque particule
const fragmentShader = `
  varying vec3 vColor;
  
  void main() {
    // Circular particle with soft edge
    float distanceToCenter = length(gl_PointCoord - vec2(0.5));
    float alpha = 1.0 - smoothstep(0.3, 0.5, distanceToCenter);
    
    // Glow effect
    alpha *= 0.6;
    
    gl_FragColor = vec4(vColor, alpha);
  }
`

interface WaveBackgroundProps {
  className?: string
}

export default function WaveBackground({ className = '' }: WaveBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const materialRef = useRef<THREE.ShaderMaterial | null>(null)
  const frameRef = useRef<number>(0)
  const mouseRef = useRef({ x: 0, y: 0 })
  const isVisibleRef = useRef(true)
  
  useEffect(() => {
    if (!containerRef.current) return
    
    const container = containerRef.current
    const width = container.clientWidth
    const height = container.clientHeight
    
    // Scene
    const scene = new THREE.Scene()
    sceneRef.current = scene
    
    // Camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100)
    camera.position.z = 3
    cameraRef.current = camera
    
    // Renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: 'high-performance'
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)
    rendererRef.current = renderer
    
    // Particles geometry - reduced count
    const particlesCount = 2500
    const positions = new Float32Array(particlesCount * 3)
    const scales = new Float32Array(particlesCount)
    const randomness = new Float32Array(particlesCount * 3)
    
    for (let i = 0; i < particlesCount; i++) {
      const i3 = i * 3
      
      // Spread particles in a plane with some depth
      positions[i3] = (Math.random() - 0.5) * 12
      positions[i3 + 1] = (Math.random() - 0.5) * 12
      positions[i3 + 2] = (Math.random() - 0.5) * 2
      
      scales[i] = Math.random() * 0.4 + 0.3
      
      randomness[i3] = (Math.random() - 0.5) * 0.2
      randomness[i3 + 1] = (Math.random() - 0.5) * 0.2
      randomness[i3 + 2] = (Math.random() - 0.5) * 0.2
    }
    
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1))
    geometry.setAttribute('aRandomness', new THREE.BufferAttribute(randomness, 3))
    
    // Material with shaders
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: 20 },
        uMouse: { value: new THREE.Vector2(0, 0) }
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    materialRef.current = material
    
    // Points
    const particles = new THREE.Points(geometry, material)
    scene.add(particles)
    
    // Intersection Observer for performance
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting
      },
      { threshold: 0.1 }
    )
    observer.observe(container)
    
    // Animation
    const clock = new THREE.Clock()
    
    const animate = () => {
      // Only render if visible
      if (isVisibleRef.current) {
        const elapsedTime = clock.getElapsedTime()
        
        if (materialRef.current) {
          materialRef.current.uniforms.uTime.value = elapsedTime
          materialRef.current.uniforms.uMouse.value.x += (mouseRef.current.x - materialRef.current.uniforms.uMouse.value.x) * 0.05
          materialRef.current.uniforms.uMouse.value.y += (mouseRef.current.y - materialRef.current.uniforms.uMouse.value.y) * 0.05
        }
        
        renderer.render(scene, camera)
      }
      
      frameRef.current = requestAnimationFrame(animate)
    }
    
    animate()
    
    // Mouse move handler
    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current.x = (event.clientX / width) * 2 - 1
      mouseRef.current.y = -(event.clientY / height) * 2 + 1
    }
    
    // Resize handler
    const handleResize = () => {
      const newWidth = container.clientWidth
      const newHeight = container.clientHeight
      
      camera.aspect = newWidth / newHeight
      camera.updateProjectionMatrix()
      
      renderer.setSize(newWidth, newHeight)
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('resize', handleResize)
    
    return () => {
      cancelAnimationFrame(frameRef.current)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
      observer.disconnect()
      
      geometry.dispose()
      material.dispose()
      renderer.dispose()
      
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])
  
  return (
    <div 
      ref={containerRef} 
      className={`absolute inset-0 ${className}`}
      style={{ zIndex: 0 }}
    />
  )
}
