import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { PLAYER_BOUNDS, PLAYER_RADIUS, PLAYER_EYE_HEIGHT, getCollisionBoxes } from '../data/interiorLayout'
import { interiorSpawn } from '../data/hotspots'

const collisionBoxes = getCollisionBoxes()

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v))
}

function collides(x, z) {
  for (const b of collisionBoxes) {
    if (
      x > b.minX - PLAYER_RADIUS &&
      x < b.maxX + PLAYER_RADIUS &&
      z > b.minZ - PLAYER_RADIUS &&
      z < b.maxZ + PLAYER_RADIUS
    ) {
      return true
    }
  }
  return false
}

// Coba gerak penuh; kalau nabrak, coba geser di satu sumbu saja (efek "sliding"
// menyusuri dinding) supaya jalan tidak terasa tersendat waktu nabrak serong.
function resolveMove(x, z, dx, dz) {
  const fullX = clamp(x + dx, PLAYER_BOUNDS.minX, PLAYER_BOUNDS.maxX)
  const fullZ = clamp(z + dz, PLAYER_BOUNDS.minZ, PLAYER_BOUNDS.maxZ)

  if (!collides(fullX, fullZ)) return [fullX, fullZ]
  if (!collides(fullX, z)) return [fullX, z]
  if (!collides(x, fullZ)) return [x, fullZ]
  return [x, z]
}

export default function FirstPersonRig({ active, moveInputRef, lookDeltaRef }) {
  const { camera } = useThree()
  const yaw = useRef(interiorSpawn.yaw)
  const pitch = useRef(0)
  const pos = useRef(new THREE.Vector3(...interiorSpawn.position))
  const wasActive = useRef(false)

  // Saat baru masuk mode interior, teleport ke titik masuk & reset arah pandang.
  useEffect(() => {
    if (active && !wasActive.current) {
      yaw.current = interiorSpawn.yaw
      pitch.current = 0
      pos.current.set(...interiorSpawn.position)
      camera.position.copy(pos.current)
      camera.rotation.set(0, yaw.current, 0, 'YXZ')
      if (lookDeltaRef?.current) {
        lookDeltaRef.current.x = 0
        lookDeltaRef.current.y = 0
      }
    }
    wasActive.current = active
  }, [active, camera, lookDeltaRef])

  useFrame((_, delta) => {
    if (!active) return
    const dt = Math.min(delta, 0.05)

    if (lookDeltaRef?.current) {
      yaw.current -= lookDeltaRef.current.x * 0.0028
      pitch.current -= lookDeltaRef.current.y * 0.0028
      pitch.current = clamp(pitch.current, -0.65, 0.65)
      lookDeltaRef.current.x = 0
      lookDeltaRef.current.y = 0
    }

    const input = moveInputRef?.current ?? { x: 0, y: 0 }
    if (input.x !== 0 || input.y !== 0) {
      const speed = 2.4 * dt
      const sinY = Math.sin(yaw.current)
      const cosY = Math.cos(yaw.current)
      const fx = -sinY
      const fz = -cosY
      const rx = cosY
      const rz = -sinY

      const dx = (fx * -input.y + rx * input.x) * speed
      const dz = (fz * -input.y + rz * input.x) * speed

      const [nx, nz] = resolveMove(pos.current.x, pos.current.z, dx, dz)
      pos.current.x = nx
      pos.current.z = nz
    }

    camera.position.set(pos.current.x, PLAYER_EYE_HEIGHT, pos.current.z)
    camera.rotation.set(pitch.current, yaw.current, 0, 'YXZ')
  })

  return null
}
