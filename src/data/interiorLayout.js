// Tata letak interior rumah — dipakai BERSAMA oleh House.jsx (visual) dan
// FirstPersonRig.jsx (deteksi tabrakan) supaya posisi dinding/furnitur yang
// terlihat selalu sama persis dengan yang menghalangi jalan pemain.

export const PLAYER_RADIUS = 0.3
export const PLAYER_EYE_HEIGHT = 1.6

// Batas terluar area yang boleh dipijak pemain (sedikit di dalam dinding luar)
export const PLAYER_BOUNDS = { minX: -2.78, maxX: 2.78, minZ: -1.78, maxZ: 1.78 }

export const WALL_HEIGHT = 2.85
export const WALL_Y = WALL_HEIGHT / 2

// Dinding partisi antar ruangan, masing-masing menyisakan celah sebagai pintu.
export const PARTITION_WALLS = [
  // Wall A — pembatas ruang tamu vs dapur/kamar mandi (di z = -0.2), celah di x:[-0.6, 0.6]
  { minX: -2.85, maxX: -0.6, minZ: -0.25, maxZ: -0.15 },
  { minX: 0.6, maxX: 2.85, minZ: -0.25, maxZ: -0.15 },
  // Wall B — pembatas dapur vs kamar mandi (di x = 0.5), celah di z:[-1.35, -0.65]
  { minX: 0.45, maxX: 0.55, minZ: -1.85, maxZ: -1.35 },
  { minX: 0.45, maxX: 0.55, minZ: -0.65, maxZ: -0.2 },
]

// Kotak tabrakan furnitur (juga jadi acuan ukuran/posisi mesh visualnya)
export const FURNITURE = {
  sofa: { minX: -2.85, maxX: -1.85, minZ: 0.25, maxZ: 1.55 },
  coffeeTable: { minX: -1.65, maxX: -0.95, minZ: 0.5, maxZ: 1.0 },
  tvStand: { minX: -1.85, maxX: -0.75, minZ: -0.3, maxZ: 0.05 },
  kitchenCounter: { minX: -2.8, maxX: 0.35, minZ: -1.85, maxZ: -1.4 },
  fridge: { minX: -2.85, maxX: -2.3, minZ: -0.85, maxZ: -0.25 },
  vanity: { minX: 0.65, maxX: 1.75, minZ: -1.85, maxZ: -1.4 },
  tub: { minX: 2.1, maxX: 2.85, minZ: -1.55, maxZ: -0.25 },
}

export const ROOM_ZONES = {
  livingRoom: { minX: -2.85, maxX: 2.85, minZ: -0.2, maxZ: 1.85 },
  kitchen: { minX: -2.85, maxX: 0.5, minZ: -1.85, maxZ: -0.2 },
  bathroom: { minX: 0.5, maxX: 2.85, minZ: -1.85, maxZ: -0.2 },
}

// Helper: ubah kotak {minX,maxX,minZ,maxZ} jadi info mesh {cx, cz, w, d}
export function boxToMesh(box) {
  return {
    cx: (box.minX + box.maxX) / 2,
    cz: (box.minZ + box.maxZ) / 2,
    w: box.maxX - box.minX,
    d: box.maxZ - box.minZ,
  }
}

export function getCollisionBoxes() {
  return [...PARTITION_WALLS, ...Object.values(FURNITURE)]
}
