# Rumah Pintar 3D — Denah Interaktif

Website React yang menampilkan model **rumah pintar 3D** interaktif. Putar
dan zoom modelnya di luar, ketuk titik bernomor untuk info perangkat, **masuk
ke dalam rumah dan jalan-jalan first-person** di ruang tamu/dapur/kamar
mandi, dan **buka pintu garasi** untuk melihat isinya.

Dibangun dengan **React + Vite** dan **react-three-fiber / drei** (Three.js).
Model rumah dibuat murni dari kode (procedural geometry), jadi tidak
memerlukan file `.glb`/`.gltf` eksternal.

## Kontrol

**Di luar rumah (mode orbit):** seret untuk memutar kamera, gulir untuk
zoom, ketuk titik bernomor untuk info perangkat.

**Masuk ke rumah:** tombol "Masuk Rumah" di bar bawah, atau tombol "Buka &
Masuk ke Rumah" di panel info Kunci Pintu Pintar.

**Di dalam rumah (mode jalan first-person):** seret layar untuk menengok,
pakai joystick di pojok kiri-bawah (atau tombol WASD/panah di keyboard)
untuk jalan. Tabrakan sederhana mencegah menembus dinding & furnitur.
Tombol "Keluar Rumah" di pojok kanan-atas untuk kembali ke tampilan luar.

**Pintu garasi:** buka panel info "Pintu Garasi Otomatis", lalu tekan tombol
"Buka/Tutup Pintu Garasi" — pintu akan menggulung ke atas dan mobil kecil di
dalamnya akan terlihat.

## Menjalankan di lokal

Butuh [Node.js](https://nodejs.org) versi 18 ke atas.

```bash
npm install
npm run dev
```

Buka `http://localhost:5173` di browser.

Untuk build production:

```bash
npm run build   # hasil ada di folder dist/
npm run preview # coba jalankan hasil build
```

## Struktur proyek

```
src/
├── data/
│   └── hotspots.js        # Data 6 titik info: posisi, judul, deskripsi, fitur
├── components/
│   ├── House.jsx           # Model 3D rumah (dibangun dari primitive Three.js)
│   ├── Scene.jsx            # Canvas, kamera, cahaya, grid, animasi fokus kamera
│   ├── HotspotPin.jsx       # Marker bernomor yang bisa diklik di titik 3D
│   ├── InfoPanel.jsx        # Panel detail perangkat (drawer kanan / bottom sheet)
│   └── DeviceLegend.jsx     # Daftar semua perangkat (panel navigasi)
├── App.jsx                  # Merangkai semua komponen + UI overlay
└── App.css                  # Tema visual "blueprint"
```

## Cara menambah atau mengubah titik info

Semua info perangkat ada di satu tempat: **`src/data/hotspots.js`**. Setiap
hotspot berbentuk objek seperti ini:

```js
{
  id: 'door-lock',
  code: '01',
  category: 'Keamanan',
  title: 'Kunci Pintu Pintar',
  status: 'Terkunci',
  statusTone: 'locked',       // 'locked' | 'online' | 'on' | 'neutral'
  description: '...',
  features: ['...', '...'],
  position: [-1.15, 1.0, 2.15],  // lokasi marker di model 3D (x, y, z)
  camera:   [-1.1, 1.7, 6.2],    // posisi kamera saat titik ini difokuskan
  lookAt:   [-1.15, 1.1, 2.0],   // titik yang dilihat kamera
}
```

Tambahkan objek baru ke array `hotspots` untuk menambah titik, lalu (jika
perlu) tambahkan entri ikon baru di `DeviceLegend.jsx` (objek `ICONS`,
menggunakan ikon dari [lucide-react](https://lucide.dev)).

## Mengganti model dengan file .glb/.gltf sendiri

Saat ini rumah dibangun dari kode (box, cone, cylinder) di `House.jsx` agar
proyek berjalan tanpa aset eksternal. Jika Anda punya model 3D sendiri
(`.glb`/`.gltf`), gantikan isi `House.jsx` dengan:

```jsx
import { useGLTF } from '@react-three/drei'

export default function House() {
  const { scene } = useGLTF('/model-rumah.glb') // taruh file di folder public/
  return <primitive object={scene} />
}
```

Lalu sesuaikan koordinat `position`/`camera`/`lookAt` di `hotspots.js` agar
pas dengan geometri model baru Anda.

## Kustomisasi tampilan

Seluruh palet warna, tipografi, dan tata letak diatur lewat CSS variable di
bagian atas `src/App.css` (di dalam selector `.app`) — ubah nilainya untuk
mengganti tema warna secara keseluruhan.
