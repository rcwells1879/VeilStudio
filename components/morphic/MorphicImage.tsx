'use client'

/* eslint-disable @next/next/no-img-element */

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import {
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
  type PointerEvent,
} from 'react'
import { useReducedMotion } from 'motion/react'
import * as THREE from 'three'

type MorphicImageProps = {
  src: string
  alt: string
  imageAspect: number
  className?: string
  intensity?: number
}

type DistortedPlaneProps = {
  src: string
  imageAspect: number
  intensity: number
  hoverRef: MutableRefObject<number>
  pointerRef: MutableRefObject<{ x: number; y: number }>
}

const vertexShader = `
  uniform float uTime;
  uniform float uHover;
  uniform float uIntensity;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec3 pos = position;
    float swell = sin((uv.x + uTime * 0.08) * 6.283185) * cos((uv.y - uTime * 0.06) * 6.283185);
    pos.z += swell * 0.045 * uHover * uIntensity;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

const fragmentShader = `
  precision highp float;

  uniform sampler2D uTexture;
  uniform float uTime;
  uniform float uHover;
  uniform float uImageAspect;
  uniform float uPlaneAspect;
  uniform float uIntensity;
  uniform vec2 uPointer;
  varying vec2 vUv;

  vec2 coverUv(vec2 uv, float imageAspect, float planeAspect) {
    vec2 ratio = vec2(1.0);

    if (planeAspect < imageAspect) {
      ratio.x = planeAspect / imageAspect;
    } else {
      ratio.y = imageAspect / planeAspect;
    }

    return (uv - 0.5) * ratio + 0.5;
  }

  float filament(vec2 p) {
    float a = sin((p.x + uTime * 0.035) * 19.0);
    float b = cos((p.y - uTime * 0.045) * 13.0);
    float c = sin((p.x + p.y + uTime * 0.025) * 9.0);
    return (a + b + c) / 3.0;
  }

  void main() {
    vec2 uv = coverUv(vUv, uImageAspect, uPlaneAspect);
    vec2 dir = vUv - uPointer;
    float d = length(dir);
    float influence = smoothstep(0.58, 0.0, d) * uHover;
    float ripple = sin(d * 46.0 - uTime * 7.4) * influence;
    vec2 normal = normalize(dir + vec2(0.0001));
    vec2 flow = vec2(
      filament(vUv + vec2(0.0, 0.23)),
      filament(vUv.yx + vec2(0.17, 0.0))
    ) * 0.0065 * uIntensity;

    uv += normal * ripple * 0.024 * uIntensity;
    uv += flow * (0.45 + uHover * 0.9);

    vec2 spectral = normal * influence * 0.008 * uIntensity;
    vec3 red = texture2D(uTexture, uv + spectral).rgb;
    vec3 base = texture2D(uTexture, uv).rgb;
    vec3 blue = texture2D(uTexture, uv - spectral).rgb;
    vec3 color = vec3(red.r, base.g, blue.b);

    vec3 seaGlass = vec3(0.70, 1.02, 0.94);
    vec3 ember = vec3(1.08, 0.92, 0.62);
    color = mix(color, color * seaGlass + ember * 0.035, influence * 0.42);
    color += vec3(0.018, 0.026, 0.02) * sin(uTime + vUv.x * 5.0) * uHover;

    gl_FragColor = vec4(color, 1.0);
  }
`

function DistortedPlane({ src, imageAspect, intensity, hoverRef, pointerRef }: DistortedPlaneProps) {
  const texture = useTexture(src)
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const targetPointer = useMemo(() => new THREE.Vector2(0.5, 0.5), [])
  const { viewport } = useThree()

  const uniforms = useMemo(
    () => ({
      uTexture: { value: texture },
      uTime: { value: 0 },
      uHover: { value: 0 },
      uImageAspect: { value: imageAspect },
      uPlaneAspect: { value: viewport.width / viewport.height },
      uIntensity: { value: intensity },
      uPointer: { value: new THREE.Vector2(0.5, 0.5) },
    }),
    [imageAspect, intensity, texture, viewport.height, viewport.width],
  )

  useFrame((state, delta) => {
    const material = materialRef.current

    if (!material) {
      return
    }

    targetPointer.set(pointerRef.current.x, pointerRef.current.y)
    material.uniforms.uTime.value = state.clock.elapsedTime
    material.uniforms.uPlaneAspect.value = viewport.width / viewport.height
    material.uniforms.uHover.value = THREE.MathUtils.damp(
      material.uniforms.uHover.value,
      hoverRef.current,
      5.4,
      delta,
    )
    material.uniforms.uPointer.value.lerp(targetPointer, 1 - Math.pow(0.0008, delta))
  })

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1, 96, 96]} />
      <shaderMaterial
        ref={materialRef}
        args={[
          {
            uniforms,
            vertexShader,
            fragmentShader,
          },
        ]}
      />
    </mesh>
  )
}

export default function MorphicImage({
  src,
  alt,
  imageAspect,
  className,
  intensity = 1,
}: MorphicImageProps) {
  const hoverRef = useRef(0)
  const pointerRef = useRef({ x: 0.5, y: 0.5 })
  const [supportsHover, setSupportsHover] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    const query = window.matchMedia('(hover: hover) and (pointer: fine)')
    const update = () => setSupportsHover(query.matches)

    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  const updatePointer = (event: PointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    pointerRef.current.x = (event.clientX - bounds.left) / bounds.width
    pointerRef.current.y = 1 - (event.clientY - bounds.top) / bounds.height
  }

  const showShader = supportsHover && !prefersReducedMotion

  return (
    <div
      className={['morphic-image', isHovering ? 'is-hovering' : '', className]
        .filter(Boolean)
        .join(' ')}
      onPointerEnter={(event) => {
        hoverRef.current = 1
        setIsHovering(true)
        updatePointer(event)
      }}
      onPointerMove={updatePointer}
      onPointerLeave={() => {
        hoverRef.current = 0
        setIsHovering(false)
      }}
    >
      <img className="morphic-source" src={src} alt={alt} />
      {showShader && (
        <div className="morphic-canvas-layer" aria-hidden="true">
          <Canvas
            orthographic
            camera={{ position: [0, 0, 2], zoom: 1 }}
            dpr={[1, 2]}
            gl={{ antialias: true, powerPreference: 'high-performance' }}
          >
            <Suspense fallback={null}>
              <DistortedPlane
                src={src}
                imageAspect={imageAspect}
                intensity={intensity}
                hoverRef={hoverRef}
                pointerRef={pointerRef}
              />
            </Suspense>
          </Canvas>
        </div>
      )}
    </div>
  )
}
