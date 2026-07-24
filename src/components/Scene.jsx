import { useEffect, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Grid, Environment, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import House from './House'
import HotspotPin from './HotspotPin'
import FirstPersonRig from './FirstPersonRig'
import { hotspots, defaultView } from '../data/hotspots'

const tmpCamTarget = new THREE.Vector3()
const tmpLookTarget = new THREE.Vector3()

function CameraRig({ focusView, autoRotate }) {
  const controlsRef = useRef()
  const { camera } = useThree()

  useEffect(() => {
    const view = focusView ?? defaultView
    tmpCamTarget.set(...view.camera)
    tmpLookTarget.set(...view.lookAt)
  }, [focusView])

  // Set the starting look-at point exactly once. We never pass `target` as a
  // prop to <OrbitControls>, because a new array literal on every re-render
  // would make it re-sync and fight the manual lerp below on every click.
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.target.set(...defaultView.lookAt)
      controlsRef.current.update()
    }
  }, [])

  useFrame(() => {
    camera.position.lerp(tmpCamTarget, 0.055)
    if (controlsRef.current) {
      controlsRef.current.target.lerp(tmpLookTarget, 0.055)
      controlsRef.current.update()
    }
  })

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableDamping
      dampingFactor={0.08}
      minDistance={2.5}
      maxDistance={16}
      minPolarAngle={0.15}
      maxPolarAngle={Math.PI / 2.05}
      autoRotate={autoRotate}
      autoRotateSpeed={0.6}
    />
  )
}

export default function Scene({
  activeId,
  onSelect,
  autoRotate,
  focusView,
  interiorView,
  garageOpen,
  moveInputRef,
  lookDeltaRef,
}) {
  const visibleHotspots = hotspots.filter((h) =>
    interiorView ? h.zone === 'interior' : h.zone === 'exterior'
  )

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: defaultView.camera, fov: 42, near: 0.1, far: 60 }}
      gl={{ antialias: true }}
    >
      <color attach="background" args={['#0b1622']} />
      <fog attach="fog" args={['#0b1622', 14, 32]} />

      <ambientLight intensity={interiorView ? 0.75 : 0.55} color="#4a6fa5" />
      <directionalLight
        position={[8, 10, 5]}
        intensity={1.5}
        color="#fff3e0"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
      />
      <directionalLight position={[-6, 4, -6]} intensity={0.35} color="#4fd1c5" />

      <Environment preset="city" environmentIntensity={0.35} />

      <Grid
        position={[0, 0, 0]}
        args={[60, 60]}
        cellSize={0.5}
        cellThickness={0.5}
        cellColor="#1c3245"
        sectionSize={4}
        sectionThickness={1}
        sectionColor="#2f5a72"
        fadeDistance={26}
        fadeStrength={1.5}
        infiniteGrid
      />

      <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#0e1c16" roughness={1} />
      </mesh>

      <ContactShadows
        position={[0, 0.01, 0]}
        opacity={0.55}
        scale={16}
        blur={2}
        far={4}
        color="#01060a"
      />

      <House garageOpen={garageOpen} />

      {visibleHotspots.map((h) => (
        <HotspotPin key={h.id} hotspot={h} isActive={activeId === h.id} onSelect={onSelect} />
      ))}

      {interiorView ? (
        <FirstPersonRig active={interiorView} moveInputRef={moveInputRef} lookDeltaRef={lookDeltaRef} />
      ) : (
        <CameraRig focusView={focusView} autoRotate={autoRotate} />
      )}
    </Canvas>
  )
}
