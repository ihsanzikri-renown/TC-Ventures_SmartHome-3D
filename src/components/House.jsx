import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import {
  PARTITION_WALLS,
  WALL_HEIGHT,
  WALL_Y,
  boxToMesh,
} from '../data/interiorLayout'

// Palet warna model — netral & hangat, supaya pin hotspot (amber) tetap menonjol.
const COLORS = {
  wall: '#e7e2d6',
  wallShade: '#d8d2c2',
  roof: '#5c3a3a',
  roofDark: '#4a2e2e',
  door: '#7a4a2b',
  frame: '#3a3f47',
  glass: '#9fd4e8',
  garageDoor: '#454b54',
  garageDoorLine: '#5c636d',
  concrete: '#b9b6ac',
  metal: '#8b9096',
  metalDark: '#5c6067',
  chimney: '#8a5a52',
  solar: '#1c2733',
  solarLine: '#3a5164',
  foliage: '#2f6b52',
  trunk: '#5a4230',
  lampGlow: '#ffce85',
  // interior
  ceiling: '#f3efe3',
  partition: '#e3ddd0',
  floorLiving: '#8a6a45',
  floorKitchen: '#cdc6b6',
  floorBath: '#bcdbe1',
  sofaFabric: '#3f6f72',
  sofaFabricDark: '#325a5c',
  woodTable: '#6b4a33',
  tvScreen: '#12161c',
  tvStand: '#3a3f47',
  counterBody: '#dcd7c8',
  counterTop: '#3a3f47',
  fridgeBody: '#cfd4d8',
  fridgeAccent: '#9aa2a9',
  vanityBody: '#e7e2d5',
  basinWhite: '#f5f7f7',
  tubBody: '#eef5f7',
  mirrorGlass: '#a9d8e6',
  carBody: '#a6472c',
  carGlass: '#22303a',
  wheelDark: '#1c1c1c',
}

function WallSegment({ box, color = COLORS.partition }) {
  const { cx, cz, w, d } = boxToMesh(box)
  return (
    <mesh position={[cx, WALL_Y, cz]} castShadow receiveShadow>
      <boxGeometry args={[w, WALL_HEIGHT, d]} />
      <meshStandardMaterial color={color} roughness={0.85} />
    </mesh>
  )
}

function GarageCar() {
  return (
    <group position={[0.1, 0, -0.4]}>
      <mesh position={[0, 0.32, 0]} castShadow>
        <boxGeometry args={[1.5, 0.45, 0.72]} />
        <meshStandardMaterial color={COLORS.carBody} roughness={0.35} metalness={0.3} />
      </mesh>
      <mesh position={[-0.05, 0.62, 0]} castShadow>
        <boxGeometry args={[0.85, 0.32, 0.66]} />
        <meshStandardMaterial color={COLORS.carGlass} roughness={0.2} metalness={0.4} />
      </mesh>
      {[
        [-0.48, 0.16, -0.32],
        [-0.48, 0.16, 0.32],
        [0.55, 0.16, -0.32],
        [0.55, 0.16, 0.32],
      ].map((p, i) => (
        <mesh key={i} position={p} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.17, 0.17, 0.14, 14]} />
          <meshStandardMaterial color={COLORS.wheelDark} roughness={0.7} />
        </mesh>
      ))}
    </group>
  )
}

export default function House({ garageOpen = false }) {
  const roofRotationY = Math.PI / 4
  const doorGroupRef = useRef()
  const doorAnim = useRef(0)

  const bushPositions = [
    [-2.6, 0.28, 3.1],
    [-3.2, 0.24, 2.7],
    [1.0, 0.28, 3.3],
    [1.7, 0.24, 3.15],
  ]

  useFrame((_, delta) => {
    const target = garageOpen ? 1 : 0
    doorAnim.current += (target - doorAnim.current) * Math.min(1, delta * 3.2)
    if (doorGroupRef.current) {
      const t = doorAnim.current
      const s = THREE.MathUtils.lerp(1, 0.1, t)
      doorGroupRef.current.scale.y = s
      doorGroupRef.current.position.y = 1.95 - 0.95 * s
    }
  })

  return (
    <group>
      {/* ---------- TANAH KERAS: jalan & carport ---------- */}
      <mesh position={[-1.15, 0.011, 4.2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[1.3, 3.2]} />
        <meshStandardMaterial color={COLORS.concrete} roughness={0.95} />
      </mesh>
      <mesh position={[4.6, 0.011, 4.3]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[3.1, 3.6]} />
        <meshStandardMaterial color={COLORS.concrete} roughness={0.95} />
      </mesh>

      {/* ---------- RUMAH UTAMA ---------- */}
      <group>
        {/* Dinding — dua sisi (DoubleSide) supaya tetap terlihat saat kamera
            masuk ke dalam rumah di mode first-person */}
        <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[6, 3, 4]} />
          <meshStandardMaterial color={COLORS.wall} roughness={0.85} side={THREE.DoubleSide} />
        </mesh>

        {/* Langit-langit, sedikit di bawah atap, supaya rapi dilihat dari dalam */}
        <mesh position={[0, 2.9, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[5.85, 3.85]} />
          <meshStandardMaterial color={COLORS.ceiling} roughness={0.9} side={THREE.DoubleSide} />
        </mesh>

        {/* Garis pondasi (alas beton tipis) */}
        <mesh position={[0, 0.08, 0]}>
          <boxGeometry args={[6.1, 0.16, 4.1]} />
          <meshStandardMaterial color={COLORS.wallShade} roughness={0.9} />
        </mesh>

        {/* Atap perisai (hip roof) */}
        <mesh position={[0, 3.85, 0]} rotation={[0, roofRotationY, 0]} castShadow>
          <coneGeometry args={[3.85, 1.7, 4]} />
          <meshStandardMaterial color={COLORS.roof} roughness={0.75} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 3.05, 0]} rotation={[0, roofRotationY, 0]}>
          <coneGeometry args={[4.05, 0.16, 4]} />
          <meshStandardMaterial color={COLORS.roofDark} roughness={0.8} />
        </mesh>

        {/* Cerobong */}
        <mesh position={[-2, 4.05, -1]} castShadow>
          <boxGeometry args={[0.45, 1.1, 0.45]} />
          <meshStandardMaterial color={COLORS.chimney} roughness={0.9} />
        </mesh>

        {/* Pintu depan */}
        <mesh position={[-1.5, 1.05, 2.03]} castShadow>
          <boxGeometry args={[1, 2.1, 0.08]} />
          <meshStandardMaterial color={COLORS.door} roughness={0.6} />
        </mesh>
        <mesh position={[-1.5, 1.05, 2.08]}>
          <boxGeometry args={[0.8, 1.85, 0.02]} />
          <meshStandardMaterial color={COLORS.frame} roughness={0.4} metalness={0.2} />
        </mesh>
        {/* Bingkai pintu */}
        <mesh position={[-1.5, 1.08, 2.0]}>
          <boxGeometry args={[1.14, 2.3, 0.06]} />
          <meshStandardMaterial color={COLORS.frame} roughness={0.5} />
        </mesh>

        {/* Jendela depan */}
        {[0.6, 1.9].map((x, i) => (
          <group key={i} position={[x, 1.85, 2.02]}>
            <mesh>
              <boxGeometry args={[0.95, 1.05, 0.1]} />
              <meshStandardMaterial color={COLORS.frame} roughness={0.5} metalness={0.1} />
            </mesh>
            <mesh position={[0, 0, 0.06]}>
              <boxGeometry args={[0.8, 0.9, 0.02]} />
              <meshStandardMaterial
                color={COLORS.glass}
                roughness={0.1}
                metalness={0.3}
                emissive={COLORS.glass}
                emissiveIntensity={0.12}
              />
            </mesh>
          </group>
        ))}

        {/* Jendela samping */}
        <group position={[-3.02, 1.85, -0.3]} rotation={[0, Math.PI / 2, 0]}>
          <mesh>
            <boxGeometry args={[1.1, 1.05, 0.1]} />
            <meshStandardMaterial color={COLORS.frame} roughness={0.5} />
          </mesh>
          <mesh position={[0, 0, 0.06]}>
            <boxGeometry args={[0.95, 0.9, 0.02]} />
            <meshStandardMaterial
              color={COLORS.glass}
              roughness={0.1}
              emissive={COLORS.glass}
              emissiveIntensity={0.12}
            />
          </mesh>
        </group>

        {/* Lampu teras (dekat pintu) */}
        <mesh position={[-0.6, 1.95, 2.08]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.16, 10]} />
          <meshStandardMaterial color={COLORS.metalDark} roughness={0.4} metalness={0.6} />
        </mesh>
        <mesh position={[-0.6, 1.82, 2.1]}>
          <sphereGeometry args={[0.1, 12, 12]} />
          <meshStandardMaterial
            color={COLORS.lampGlow}
            emissive={COLORS.lampGlow}
            emissiveIntensity={0.9}
            roughness={0.3}
          />
        </mesh>

        {/* Kamera bel pintu, di atas pintu */}
        <mesh position={[-1.5, 2.22, 2.08]} rotation={[0.3, 0, 0]} castShadow>
          <boxGeometry args={[0.16, 0.12, 0.1]} />
          <meshStandardMaterial color={COLORS.metalDark} roughness={0.3} metalness={0.7} />
        </mesh>
        <mesh position={[-1.5, 2.22, 2.14]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.2} />
        </mesh>

        {/* ================= INTERIOR ================= */}

        {/* Lantai per-ruangan */}
        <mesh position={[0, 0.015, 0.825]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[5.7, 2.05]} />
          <meshStandardMaterial color={COLORS.floorLiving} roughness={0.8} />
        </mesh>
        <mesh position={[-1.175, 0.015, -1.025]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[3.35, 1.65]} />
          <meshStandardMaterial color={COLORS.floorKitchen} roughness={0.7} />
        </mesh>
        <mesh position={[1.675, 0.015, -1.025]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[2.35, 1.65]} />
          <meshStandardMaterial color={COLORS.floorBath} roughness={0.55} />
        </mesh>

        {/* Dinding partisi antar ruangan */}
        {PARTITION_WALLS.map((box, i) => (
          <WallSegment key={i} box={box} />
        ))}

        {/* --- Ruang Tamu: sofa, meja, TV --- */}
        <group>
          <mesh position={[-2.35, 0.32, 0.9]} castShadow>
            <boxGeometry args={[0.85, 0.4, 1.25]} />
            <meshStandardMaterial color={COLORS.sofaFabric} roughness={0.9} />
          </mesh>
          <mesh position={[-2.72, 0.62, 0.9]} castShadow>
            <boxGeometry args={[0.2, 0.65, 1.25]} />
            <meshStandardMaterial color={COLORS.sofaFabricDark} roughness={0.9} />
          </mesh>
          <mesh position={[-1.3, 0.32, 0.75]} castShadow>
            <boxGeometry args={[0.55, 0.35, 0.45]} />
            <meshStandardMaterial color={COLORS.woodTable} roughness={0.5} />
          </mesh>
          <mesh position={[-1.3, 0.22, -0.12]} castShadow>
            <boxGeometry args={[1.05, 0.44, 0.32]} />
            <meshStandardMaterial color={COLORS.tvStand} roughness={0.6} />
          </mesh>
          <mesh position={[-1.3, 1.5, -0.14]} castShadow>
            <boxGeometry args={[1.0, 0.58, 0.05]} />
            <meshStandardMaterial
              color={COLORS.tvScreen}
              roughness={0.3}
              emissive={COLORS.tvScreen}
              emissiveIntensity={0.4}
            />
          </mesh>
        </group>

        {/* --- Dapur: kabinet, kompor, kulkas --- */}
        <group>
          <mesh position={[-1.2, 0.45, -1.65]} castShadow>
            <boxGeometry args={[3.0, 0.9, 0.55]} />
            <meshStandardMaterial color={COLORS.counterBody} roughness={0.7} />
          </mesh>
          <mesh position={[-1.2, 0.91, -1.65]}>
            <boxGeometry args={[3.05, 0.04, 0.6]} />
            <meshStandardMaterial color={COLORS.counterTop} roughness={0.4} metalness={0.2} />
          </mesh>
          {[-0.75, -0.45].map((x, i) => (
            <mesh key={i} position={[x, 0.935, -1.65]}>
              <cylinderGeometry args={[0.12, 0.12, 0.015, 16]} />
              <meshStandardMaterial color="#1a1d21" roughness={0.3} metalness={0.5} />
            </mesh>
          ))}
          <mesh position={[-2.6, 0.9, -0.55]} castShadow>
            <boxGeometry args={[0.6, 1.8, 0.6]} />
            <meshStandardMaterial color={COLORS.fridgeBody} roughness={0.4} metalness={0.3} />
          </mesh>
          <mesh position={[-2.6, 1.05, -0.24]}>
            <boxGeometry args={[0.5, 0.03, 0.03]} />
            <meshStandardMaterial color={COLORS.fridgeAccent} roughness={0.3} metalness={0.5} />
          </mesh>
        </group>

        {/* --- Kamar mandi: wastafel, cermin, bak --- */}
        <group>
          <mesh position={[1.2, 0.42, -1.65]} castShadow>
            <boxGeometry args={[1.0, 0.8, 0.5]} />
            <meshStandardMaterial color={COLORS.vanityBody} roughness={0.7} />
          </mesh>
          <mesh position={[1.2, 0.83, -1.65]}>
            <boxGeometry args={[0.9, 0.06, 0.42]} />
            <meshStandardMaterial color={COLORS.basinWhite} roughness={0.3} />
          </mesh>
          <mesh position={[1.2, 1.55, -1.8]}>
            <boxGeometry args={[0.7, 0.55, 0.03]} />
            <meshStandardMaterial
              color={COLORS.mirrorGlass}
              roughness={0.05}
              metalness={0.4}
              emissive={COLORS.mirrorGlass}
              emissiveIntensity={0.15}
            />
          </mesh>
          <mesh position={[2.475, 0.25, -0.9]} castShadow>
            <boxGeometry args={[0.7, 0.5, 1.3]} />
            <meshStandardMaterial color={COLORS.tubBody} roughness={0.35} />
          </mesh>
        </group>
      </group>

      {/* ---------- UNIT AC OUTDOOR ---------- */}
      <group position={[-3.35, 0.4, 1.2]}>
        <mesh castShadow>
          <boxGeometry args={[0.55, 0.7, 0.4]} />
          <meshStandardMaterial color={COLORS.metal} roughness={0.5} metalness={0.4} />
        </mesh>
        {[0.14, 0.02, -0.1].map((y, i) => (
          <mesh key={i} position={[0, y + 0.1, 0.21]}>
            <boxGeometry args={[0.42, 0.03, 0.01]} />
            <meshStandardMaterial color={COLORS.metalDark} roughness={0.4} />
          </mesh>
        ))}
      </group>

      {/* ---------- GARASI ---------- */}
      <group position={[4.6, 0, 0.2]}>
        {/* Lantai */}
        <mesh position={[0, 0.05, 0]} receiveShadow>
          <boxGeometry args={[2.9, 0.1, 3.5]} />
          <meshStandardMaterial color={COLORS.concrete} roughness={0.9} />
        </mesh>
        {/* Dinding belakang & samping (depan sengaja kosong — pintu yang menutupnya) */}
        <mesh position={[0, 1.1, -1.775]} castShadow receiveShadow>
          <boxGeometry args={[3, 2.2, 0.15]} />
          <meshStandardMaterial color={COLORS.wall} roughness={0.85} />
        </mesh>
        <mesh position={[-1.425, 1.1, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.15, 2.2, 3.6]} />
          <meshStandardMaterial color={COLORS.wall} roughness={0.85} />
        </mesh>
        <mesh position={[1.425, 1.1, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.15, 2.2, 3.6]} />
          <meshStandardMaterial color={COLORS.wall} roughness={0.85} />
        </mesh>
        {/* Atap datar */}
        <mesh position={[0, 2.28, 0]} castShadow>
          <boxGeometry args={[3.2, 0.16, 3.8]} />
          <meshStandardMaterial color={COLORS.roofDark} roughness={0.8} />
        </mesh>

        {/* Mobil kecil di dalam — kelihatan begitu pintu terbuka */}
        <GarageCar />

        {/* Pintu garasi (roller) — meluncur & menggulung ke atas saat dibuka */}
        <group ref={doorGroupRef} position={[0, 1.0, 1.82]}>
          <mesh castShadow>
            <boxGeometry args={[2.5, 1.9, 0.08]} />
            <meshStandardMaterial color={COLORS.garageDoor} roughness={0.5} metalness={0.3} />
          </mesh>
          {[0.6, 0.2, -0.2, -0.6].map((y, i) => (
            <mesh key={i} position={[0, y, 0.05]}>
              <boxGeometry args={[2.4, 0.03, 0.02]} />
              <meshStandardMaterial color={COLORS.garageDoorLine} roughness={0.4} metalness={0.4} />
            </mesh>
          ))}
        </group>
      </group>

      {/* ---------- PANEL SURYA DI ATAP ---------- */}
      <group position={[1.3, 3.55, -0.5]} rotation={[-0.42, 0, 0]}>
        <mesh castShadow>
          <boxGeometry args={[1.6, 0.04, 1.1]} />
          <meshStandardMaterial color={COLORS.solar} roughness={0.3} metalness={0.5} />
        </mesh>
        {[-0.55, -0.18, 0.18, 0.55].map((x, i) => (
          <mesh key={i} position={[x, 0.025, 0]}>
            <boxGeometry args={[0.02, 0.01, 1.1]} />
            <meshStandardMaterial color={COLORS.solarLine} roughness={0.3} />
          </mesh>
        ))}
      </group>

      {/* ---------- HALAMAN: pohon & semak ---------- */}
      <group position={[-5.2, 0, -2.6]}>
        <mesh position={[0, 0.55, 0]} castShadow>
          <cylinderGeometry args={[0.14, 0.18, 1.1, 8]} />
          <meshStandardMaterial color={COLORS.trunk} roughness={0.9} />
        </mesh>
        <mesh position={[0, 1.5, 0]} castShadow>
          <coneGeometry args={[0.85, 1.6, 8]} />
          <meshStandardMaterial color={COLORS.foliage} roughness={0.85} />
        </mesh>
        <mesh position={[0, 2.05, 0]} castShadow>
          <coneGeometry args={[0.6, 1.1, 8]} />
          <meshStandardMaterial color={COLORS.foliage} roughness={0.85} />
        </mesh>
      </group>

      <group position={[6.4, 0, -1.8]}>
        <mesh position={[0, 0.45, 0]} castShadow>
          <cylinderGeometry args={[0.11, 0.15, 0.9, 8]} />
          <meshStandardMaterial color={COLORS.trunk} roughness={0.9} />
        </mesh>
        <mesh position={[0, 1.15, 0]} castShadow>
          <coneGeometry args={[0.65, 1.3, 8]} />
          <meshStandardMaterial color={COLORS.foliage} roughness={0.85} />
        </mesh>
      </group>

      {bushPositions.map((pos, i) => (
        <mesh key={i} position={pos} castShadow>
          <sphereGeometry args={[0.26, 10, 10]} />
          <meshStandardMaterial color={COLORS.foliage} roughness={0.9} />
        </mesh>
      ))}

      {/* Lampu interior lembut — satu per ruangan, supaya jelajah di dalam tidak gelap */}
      <pointLight position={[-1.0, 2.6, 0.9]} intensity={7} distance={6} color="#ffe6bf" />
      <pointLight position={[-1.2, 2.6, -1.1]} intensity={6} distance={5} color="#fff2df" />
      <pointLight position={[1.4, 2.6, -1.1]} intensity={6} distance={5} color="#eaf6fb" />
    </group>
  )
}
