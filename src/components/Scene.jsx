import { useEffect, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Grid, Environment, Lightformer, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import House from './House'
import HotspotPin from './HotspotPin'
import FirstPersonRig from './FirstPersonRig'
import { hotspots, defaultView } from '../data/hotspots'

const tmpCamTarget = new THREE.Vector3()
const tmpLookTarget = new THREE.Vector3()

function CameraRig({ focusView, autoRotate, viewToken }) {
  const controlsRef = useRef()
  const flying = useRef(false)
  const { camera } = useThree()

  // Setiap kali tujuan kamera berubah (pilih hotspot / tutup panel / tombol
  // Reset), tentukan target baru lalu mulai animasi "terbang" ke sana.
  useEffect(() => {
    const view = focusView ?? defaultView
    tmpCamTarget.set(...view.camera)
    tmpLookTarget.set(...view.lookAt)
    flying.current = true
  }, [focusView, viewToken])

  // Set titik pandang awal sekali saja. `target` sengaja tidak dioper sebagai
  // prop <OrbitControls>, karena array literal baru di tiap render akan memaksa
  // sinkron ulang dan berebut dengan animasi di bawah.
  // Begitu pengguna mulai menyeret / zoom, animasi terbang dibatalkan supaya
  // kamera tidak "ditarik balik" ke posisi lama.
  useEffect(() => {
    const controls = controlsRef.current
    if (!controls) return undefined
    controls.target.set(...defaultView.lookAt)
    controls.update()
    const stopFlying = () => {
      flying.current = false
    }
    controls.addEventListener('start', stopFlying)
    return () => controls.removeEventListener('start', stopFlying)
  }, [])

  useFrame((_, delta) => {
    const controls = controlsRef.current
    if (flying.current) {
      // Redaman eksponensial -> kecepatan animasi sama di layar 60Hz maupun 144Hz.
      const k = 1 - Math.exp(-4 * Math.min(delta, 0.1))
      camera.position.lerp(tmpCamTarget, k)
      controls?.target.lerp(tmpLookTarget, k)
      const arrived =
        camera.position.distanceTo(tmpCamTarget) < 0.01 &&
        (!controls || controls.target.distanceTo(tmpLookTarget) < 0.01)
      if (arrived) flying.current = false
    }
    controls?.update()
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
  viewToken,
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
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.04}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
      />
      <directionalLight position={[-6, 4, -6]} intensity={0.35} color="#4fd1c5" />

      {/* Environment dibuat prosedural (Lightformer), BUKAN preset="city":
          preset itu mengunduh file .hdr dari CDN pihak ketiga; kalau diblokir /
          offline, seluruh aplikasi jadi layar kosong. */}
      <Environment resolution={256} environmentIntensity={0.35}>
        <Lightformer form="rect" intensity={2.2} color="#fff3e0" position={[0, 6, 0]} rotation-x={Math.PI / 2} scale={[12, 12, 1]} />
        <Lightformer form="rect" intensity={1.4} color="#ffd9a8" position={[-8, 3, 2]} rotation-y={Math.PI / 2} scale={[8, 4, 1]} />
        <Lightformer form="rect" intensity={1.2} color="#8fd8ff" position={[8, 3, -2]} rotation-y={-Math.PI / 2} scale={[8, 4, 1]} />
        <Lightformer form="ring" intensity={1.5} color="#4fd1c5" position={[0, 3, -9]} scale={4} />
      </Environment>

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
        <CameraRig focusView={focusView} autoRotate={autoRotate} viewToken={viewToken} />
      )}
    </Canvas>
  )
}
