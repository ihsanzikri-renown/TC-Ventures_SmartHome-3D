// Tata letak interior rumah — dipakai BERSAMA oleh House.jsx (visual) dan
// FirstPersonRig.jsx (deteksi tabrakan) supaya posisi dinding/furnitur yang
// terlihat selalu sama persis dengan yang menghalangi jalan pemain.

export const PLAYER_RADIUS = 0.2
export const PLAYER_EYE_HEIGHT = 1.6

// Batas terluar area yang boleh dipijak pemain (sedikit di dalam dinding luar)
export const PLAYER_BOUNDS = { minX: -2.78, maxX: 2.78, minZ: -1.78, maxZ: 1.78 }

export const WALL_HEIGHT = 2.85
export const WALL_Y = WALL_HEIGHT / 2

// Dinding partisi antar ruangan. Setiap ruangan punya pintu sendiri dengan lebar
// bersih >= 0.8 m (cukup untuk pemain berdiameter 2 x PLAYER_RADIUS = 0.4 m).
//
// Sebelumnya satu pintu lebar di Wall A "ditabrak" ujung Wall B di tengahnya,
// sehingga kamar mandi hanya bisa dicapai lewat celah < 10 cm (praktis mustahil).
// Sekarang: dapur & kamar mandi masing-masing punya pintu ke ruang tamu, ditambah
// satu pintu penghubung dapur <-> kamar mandi di Wall B.
export const PARTITION_WALLS = [
  // Wall A — ruang tamu vs dapur/kamar mandi (z = -0.2)
  //   pintu dapur     : x -0.7 .. 0.4
  //   pintu kamar mandi: x  0.6 .. 1.6
  { minX: -2.85, maxX: -0.7, minZ: -0.25, maxZ: -0.15 },
  { minX: 0.4, maxX: 0.6, minZ: -0.25, maxZ: -0.15 }, // tiang di sambungan Wall B
  { minX: 1.6, maxX: 2.85, minZ: -0.25, maxZ: -0.15 },
  // Wall B — dapur vs kamar mandi (x = 0.5), pintu penghubung di z -1.45 .. -0.65
  { minX: 0.45, maxX: 0.55, minZ: -1.85, maxZ: -1.45 },
  { minX: 0.45, maxX: 0.55, minZ: -0.65, maxZ: -0.25 },
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
