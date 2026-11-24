// Data titik interaktif (hotspot) pada model rumah pintar 3D.
//
// `zone`        -> 'exterior' (dilihat lewat kamera orbit di luar) atau
//                  'interior' (dilihat dengan jalan-jalan first-person di dalam)
// `position`    -> lokasi penanda pada model (x, y, z)
// `camera` / `lookAt` -> HANYA dipakai oleh hotspot exterior, untuk kamera
//                  fly-to saat titik diklik. Hotspot interior tidak memakai
//                  ini karena kamera first-person dikendalikan pemain sendiri.
// `action`      -> tombol aksi opsional di panel info (mis. "Masuk Rumah",
//                  "Buka Pintu Garasi"). `action.type` dibaca oleh App.jsx.
//
// Semua koordinat disesuaikan langsung dengan geometri di House.jsx

export const hotspots = [
  {
    id: 'door-lock',
    code: '01',
    zone: 'exterior',
    category: 'Keamanan',
    title: 'Kunci Pintu Pintar',
    status: 'Terkunci',
    statusTone: 'locked',
    description:
      'Kunci otomatis di pintu depan yang bisa dibuka lewat PIN, sidik jari, atau aplikasi smartphone. Tidak perlu lagi membawa anak kunci fisik.',
    features: [
      'Buka kunci via PIN, sidik jari, atau smartphone',
      'Notifikasi real-time setiap kali pintu diakses',
      'Kunci otomatis terjadwal saat malam hari',
      'Riwayat akses tersimpan rapi di cloud',
    ],
    position: [-1.15, 1.0, 2.15],
    camera: [-1.1, 1.7, 6.2],
    lookAt: [-1.15, 1.1, 2.0],
    action: { type: 'enter-house', label: 'Buka & Masuk ke Rumah →' },
  },
  {
    id: 'doorbell-cam',
    code: '02',
    zone: 'exterior',
    category: 'Keamanan',
    title: 'Bel Pintu & Kamera',
    status: 'Online',
    statusTone: 'online',
    description:
      'Kamera HD di atas pintu dengan deteksi gerak dan penglihatan malam. Setiap tamu yang datang langsung terlihat di aplikasi, kapan pun.',
    features: [
      'Live streaming 24 jam ke aplikasi',
      'Deteksi gerak dengan notifikasi instan',
      'Night vision inframerah',
      'Rekaman otomatis tersimpan di cloud',
    ],
    position: [-1.5, 2.35, 2.15],
    camera: [-1.4, 2.7, 6.2],
    lookAt: [-1.5, 2.2, 2.0],
  },
  {
    id: 'porch-light',
    code: '03',
    zone: 'exterior',
    category: 'Pencahayaan',
    title: 'Lampu Teras Pintar',
    status: 'Menyala',
    statusTone: 'on',
    description:
      'Lampu LED yang otomatis menyala saat matahari terbenam dan meredup sesuai jadwal. Warna dan kecerahannya bisa diatur langsung dari genggaman.',
    features: [
      'Atur warna & kecerahan dari aplikasi',
      'Jadwal otomatis mengikuti waktu matahari terbenam',
      'Menyala otomatis saat sensor mendeteksi gerakan',
      'Mode hemat energi di jam sepi',
    ],
    position: [-0.6, 2.05, 2.2],
    camera: [-0.55, 2.3, 6.0],
    lookAt: [-0.6, 2.0, 2.0],
  },
  {
    id: 'ac-thermostat',
    code: '04',
    zone: 'exterior',
    category: 'Iklim',
    title: 'AC & Termostat Pintar',
    status: '24° C',
    statusTone: 'neutral',
    description:
      'Mengatur suhu rumah otomatis berdasarkan kebiasaan penghuni. Bisa dinyalakan dari jalan supaya rumah sudah sejuk saat kamu tiba.',
    features: [
      'Kontrol suhu dari jarak jauh',
      'Penjadwalan otomatis setiap hari',
      'Laporan konsumsi energi bulanan',
      'Terhubung dengan Google Home & Alexa',
    ],
    position: [-3.35, 0.75, 1.2],
    camera: [-6.6, 1.8, 3.6],
    lookAt: [-3.35, 0.6, 1.2],
  },
  {
    id: 'garage-door',
    code: '05',
    zone: 'exterior',
    category: 'Akses',
    title: 'Pintu Garasi Otomatis',
    status: 'Tertutup',
    statusTone: 'locked',
    description:
      'Buka dan tutup pintu garasi cukup dari aplikasi. Sensor kendaraan mengenali saat mobil mendekat dan menutup otomatis setelahnya.',
    features: [
      'Buka/tutup lewat smartphone',
      'Deteksi otomatis kedatangan kendaraan',
      'Auto-close 5 menit setelah dibuka',
      'Alarm jika pintu terbuka terlalu lama',
    ],
    position: [4.6, 1.0, 2.1],
    camera: [4.7, 1.7, 6.4],
    lookAt: [4.6, 1.0, 2.0],
    action: { type: 'toggle-garage', label: 'Buka/Tutup Pintu Garasi' },
  },
  {
    id: 'solar-panel',
    code: '06',
    zone: 'exterior',
    category: 'Energi',
    title: 'Panel Surya & Monitor Energi',
    status: '3.2 kWh',
    statusTone: 'online',
    description:
      'Panel surya di atap menghasilkan listrik terbarukan. Monitor energi menampilkan produksi, konsumsi, dan efisiensi rumah secara real-time.',
    features: [
      'Monitor produksi energi real-time',
      'Estimasi penghematan listrik bulanan',
      'Notifikasi performa panel',
      'Terintegrasi dengan baterai penyimpanan',
    ],
    position: [1.0, 3.8, 1.7],
    camera: [1.6, 5.4, 6.4],
    lookAt: [1.0, 3.5, 1.6],
  },

  // ---------------- INTERIOR (dijelajahi first-person) ----------------
  {
    id: 'living-room-tv',
    code: '07',
    zone: 'interior',
    room: 'Ruang Tamu',
    category: 'Hiburan',
    title: 'Smart TV & Speaker',
    status: 'Menyala',
    statusTone: 'on',
    description:
      'TV dan soundbar yang terhubung ke semua layanan streaming, bisa dinyalakan lewat suara, dan otomatis meredupkan lampu ruang tamu saat mode nonton dimulai.',
    features: [
      'Kontrol suara lewat asisten pintar',
      'Mode "Nonton" meredupkan lampu otomatis',
      'Sinkron dengan speaker di seluruh ruangan',
      'Rekomendasi tontonan personal',
    ],
    position: [-1.3, 1.5, -0.06],
  },
  {
    id: 'kitchen-appliances',
    code: '08',
    zone: 'interior',
    room: 'Dapur',
    category: 'Dapur',
    title: 'Kulkas & Kompor Pintar',
    status: '4° C',
    statusTone: 'neutral',
    description:
      'Kulkas dengan kamera internal untuk cek isi dari luar rumah, dan kompor induksi yang otomatis mati sendiri kalau lupa dimatikan.',
    features: [
      'Lihat isi kulkas lewat aplikasi',
      'Notifikasi stok bahan makanan menipis',
      'Kompor otomatis mati jika ditinggal',
      'Jadwal masak terhubung ke resep digital',
    ],
    position: [-2.6, 1.4, -0.2],
  },
  {
    id: 'bathroom-fixtures',
    code: '09',
    zone: 'interior',
    room: 'Kamar Mandi',
    category: 'Kamar Mandi',
    title: 'Pemanas Air & Cermin Pintar',
    status: '38° C',
    statusTone: 'online',
    description:
      'Pemanas air yang menyiapkan suhu favoritmu otomatis di jam mandi biasa, dan cermin dengan layar kecil untuk cek cuaca sambil bersiap.',
    features: [
      'Suhu air otomatis sesuai jadwal',
      'Cermin menampilkan cuaca & jadwal harian',
      'Deteksi kebocoran air otomatis',
      'Mode hemat air saat rumah kosong',
    ],
    position: [1.1, 1.5, -1.65],
  },
]

export const defaultView = {
  camera: [7.5, 5, 9],
  lookAt: [0, 1.3, 0],
}

// Titik & arah hadap awal saat pemain "masuk" ke mode first-person interior.
export const interiorSpawn = {
  position: [0, 1.6, 1.3],
  yaw: 0, // menghadap ke dalam rumah (ke arah -z, ke ruang tamu & TV)
}
