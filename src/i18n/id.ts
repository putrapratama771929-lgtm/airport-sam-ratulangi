import type { Translations } from './types'

export const id: Translations = {
  lang: 'id',

  nav: {
    flights: 'Penerbangan',
    map: 'Peta',
    parking: 'Parkir',
    transport: 'Transportasi',
    terminals: 'Terminal',
    facilities: 'Fasilitas',
    guide: 'Panduan',
    services: 'Layanan',
    faq: 'FAQ',
  },

  header: {
    notificationsTitle: 'Notifikasi penerbangan',
  },

  hero: {
    eyebrow: 'Bandar Udara Internasional Sam Ratulangi',
    title1: 'Gerbang',
    title2: 'Sulawesi Utara',
    subtitle:
      'Prototipe informasi penerbangan dengan peta terminal, parkir, dan informasi penting penumpang MDC — semua dalam satu halaman.',
    searchPlaceholder: 'Cari nomor penerbangan, maskapai, atau kota — mis. GA 601, Garuda, Jakarta',
    liveBoard: 'Papan Live',
    noResults: (q) => `Tidak ada penerbangan yang cocok dengan "${q}"`,
    localTime: 'Waktu lokal · WITA',
    weather: 'Cuaca',
    stats: {
      departuresToday: 'Keberangkatan hari ini',
      nowBoarding: 'Boarding sekarang',
      delayed: 'Tertunda',
      airlinesServing: 'Maskapai beroperasi',
    },
    disclaimer: 'Data demo saja — bukan layanan informasi penerbangan operasional',
  },

  flightBoard: {
    eyebrow: '01 · Informasi penerbangan',
    title: 'Papan Live',
    subtitle: 'Diperbarui terus-menerus. Baris boarding dan final call berkedip — seperti papan di atas gate.',
    departures: 'Keberangkatan',
    arrivals: 'Kedatangan',
    filterPlaceholder: 'Cari penerbangan…',
    colTime: 'Waktu',
    colFlight: 'Penerbangan',
    colDestination: 'Tujuan',
    colOrigin: 'Asal',
    colGate: 'Gate',
    colEst: 'Est.',
    colStatus: 'Status',
    noResults: (tab) =>
      tab === 'departure'
        ? 'Tidak ada keberangkatan yang sesuai filter'
        : 'Tidak ada kedatangan yang sesuai filter',
    to: 'ke',
    from: 'dari',
    footnote:
      '* Data prototipe — status diperbarui otomatis setiap beberapa detik untuk mensimulasikan feed langsung (keterlambatan, perubahan gate, panggilan boarding). Semua waktu dalam WITA (UTC+8).',
  },

  map: {
    eyebrow: '02 · Peta bandara',
    title: 'Temukan jalan Anda',
    subtitle: 'Ketuk zona pada denah untuk melihat isinya — gate, lounge, toilet, restoran, dan layanan.',
    selectedZone: 'Zona dipilih',
    toiletsNote: 'Toilet & lift tersedia di setiap zona',
    legendPassenger: 'Zona penumpang',
    legendSelected: 'Dipilih',
    legendAirside: 'Sisi udara',
    zones: {
      checkin: {
        label: 'Aula Check-in',
        desc: 'Konter A–F, kios layanan mandiri, dan pengiriman bagasi.',
        items: [
          'Konter A–C: Garuda, Batik, Citilink',
          'Konter D–F: Lion Group & lainnya',
          '8 kios layanan mandiri',
          'Konter bagasi oversize',
        ],
      },
      domestic: {
        label: 'Sayap Domestik · Gate D1–D8',
        desc: 'Semua keberangkatan domestik setelah pemeriksaan keamanan.',
        items: ['Gate D1–D8', 'Food court & Kopi Kawanua', 'Area anak & ruang laktasi', 'Charging bar di gate'],
      },
      international: {
        label: 'Sayap Internasional · Gate I1–I4',
        desc: 'Imigrasi, duty free, dan gate internasional regional.',
        items: ['Imigrasi & e-gate', 'MDC Duty Free', 'Minahasa Executive Lounge', 'Transit rest pod'],
      },
      arrivals: {
        label: 'Kedatangan & Pengambilan Bagasi',
        desc: 'Belt 1–6, bea cukai, dan area penjemputan.',
        items: ['Belt bagasi 1–6', 'Bea cukai (jalur cepat e-CD)', 'Zona taksi & ride-hailing', 'Halte bus DAMRI'],
      },
      landside: {
        label: 'Layanan Sisi Darat',
        desc: 'Layanan aula publik sebelum pemeriksaan keamanan.',
        items: ['Meja informasi', 'Barang hilang & temuan', 'Pusat ATM & money changer', 'Toko suvenir'],
      },
    },
  },

  parking: {
    eyebrow: '03 · Parkir',
    title: 'Parkir & Terbang',
    subtitle: 'Kapasitas parkir terkini di semua area. Indikator berubah kuning saat area mulai penuh.',
    occupancy: 'Kapasitas terpakai',
    baysFree: (free, capacity) =>
      `${free.toLocaleString('id-ID')} dari ${capacity.toLocaleString('id-ID')} tempat tersedia`,
  },

  transport: {
    eyebrow: '04 · Transportasi',
    title: 'Ke & dari Manado',
    subtitle: 'Bandara berjarak 13 km di timur laut pusat kota Manado — sekitar 45 menit perjalanan.',
    fare: 'Tarif',
    schedule: 'Jadwal',
    where: 'Lokasi',
  },

  terminal: {
    eyebrow: '05 · Panduan terminal',
    title: 'Satu terminal, dua sayap',
    floors: (n) => `${n} lantai`,
    airlines: 'Maskapai',
    keyFacilities: 'Fasilitas utama',
  },

  facilities: {
    eyebrow: '06 · Fasilitas',
    title: 'Makan, belanja, isi daya',
    subtitle: 'Restoran, toko, ATM, lounge, area istirahat, dan titik pengisian daya di kedua sayap.',
    catAll: 'Semua',
    wing: 'Sayap',
    where: 'Lokasi',
    hours: 'Jam buka',
    domestic: 'Domestik',
    international: 'Internasional',
  },

  guide: {
    eyebrow: '07 · Panduan perjalanan',
    title: 'Sebelum & sesudah terbang',
    departing: 'Berangkat dari MDC',
    arriving: 'Tiba di MDC',
    departSteps: [
      {
        title: 'Tiba lebih awal',
        desc: 'Domestik: 2 jam sebelum keberangkatan. Internasional: 3 jam.',
        time: 'T-3j hingga T-2j',
      },
      {
        title: 'Check-in',
        desc: 'Konter, kios layanan mandiri, atau check-in online melalui aplikasi maskapai Anda.',
        time: 'Hingga T-45m',
      },
      {
        title: 'Pengiriman bagasi',
        desc: 'Kirim bagasi terdaftar di konter bagasi. Cairan kabin dibatasi 100 ml.',
        time: 'Hingga T-45m',
      },
      {
        title: 'Pemeriksaan keamanan',
        desc: 'Siapkan boarding pass & ID. Lepas jaket, ikat pinggang, dan elektronik besar.',
        time: '± 15 menit',
      },
      {
        title: 'Imigrasi (intl.)',
        desc: 'Paspor berlaku minimal 6 bulan dan dokumen perjalanan lengkap.',
        time: '± 20 menit',
      },
      {
        title: 'Menuju gate',
        desc: 'Pantau papan — gate bisa berubah. Boarding ditutup 20 menit sebelum keberangkatan.',
        time: 'T-40m',
      },
    ],
    arriveSteps: [
      {
        title: 'Imigrasi (intl.)',
        desc: 'Antre berdasarkan kewarganegaraan; gunakan autogate jika terdaftar.',
        time: '± 15 menit',
      },
      {
        title: 'Ambil bagasi',
        desc: 'Periksa nomor belt pada layar klaim bagasi.',
        time: '± 20 menit',
      },
      {
        title: 'Bea cukai',
        desc: 'Isi e-CD (deklarasi bea cukai elektronik) sebelum tiba untuk jalur cepat.',
        time: '± 10 menit',
      },
      {
        title: 'Zona penjemputan',
        desc: 'Ride-hailing dan taksi resmi memiliki zona terpisah — ikuti petunjuk arah.',
        time: '—',
      },
      {
        title: 'Perjalanan lanjutan',
        desc: 'Bus DAMRI, taksi, atau shuttle gratis untuk penerbangan sambungan.',
        time: '—',
      },
    ],
  },

  services: {
    eyebrow: '08 · Layanan penumpang',
    title: 'Bantuan saat Anda butuhkan',
    weatherTitle: 'Cuaca di MDC',
    feelsLike: 'Terasa seperti',
    wind: 'Angin',
    humidity: 'Kelembapan',
    visibility: 'Jarak pandang',
    lostFoundTitle: 'Barang Hilang & Temuan',
    desk: 'Meja',
    hours: 'Jam',
    phone: 'Telepon',
    email: 'Email',
    accessibilityTitle: 'Aksesibilitas',
    accessibilityItems: [
      {
        title: 'Bantuan kursi roda',
        desc: 'Gratis — minta melalui maskapai Anda minimal 48 jam sebelum keberangkatan, atau di meja informasi.',
      },
      {
        title: 'Jalur prioritas',
        desc: 'Jalur check-in, keamanan, dan boarding khusus untuk lansia, ibu hamil, dan penumpang disabilitas.',
      },
      {
        title: 'Fasilitas aksesibel',
        desc: 'Jalur bebas tangga, ubin pemandu, toilet aksesibel di kedua lantai, dan tempat parkir khusus di P1.',
      },
      {
        title: 'Bepergian dengan pendamping',
        desc: 'Satu pendamping dapat menemani penumpang dengan mobilitas terbatas hingga ke gate boarding.',
      },
    ],
    emergencyTitle: 'Informasi darurat',
    emergencyTips: [
      'Saat evakuasi, tinggalkan semua barang dan ikuti tanda keluar hijau yang menyala.',
      'Titik berkumpul berada di P2 East Lot dan halaman kedatangan.',
      'Unit AED terpasang di setiap meja informasi dan Gate D4 / I2.',
      'Laporkan barang yang ditinggalkan kepada petugas berseragam — jangan disentuh atau dipindahkan.',
    ],
    lostFoundSteps: [
      'Laporkan barang di meja Barang Hilang & Temuan atau melalui email dengan detail penerbangan Anda.',
      'Berikan deskripsi: merek, warna, isi, dan terakhir kali terlihat.',
      'Anda akan menerima nomor kasus untuk pelacakan dalam 1×24 jam.',
      'Barang disimpan selama 90 hari; barang yang tidak diklaim diserahkan ke pihak berwenang.',
    ],
  },

  faq: {
    eyebrow: '09 · FAQ',
    title: 'Pertanyaan umum',
    subtitle: 'Tidak menemukan jawaban? Tanya Nara, asisten kami, di gelembung obrolan kanan bawah.',
    items: [
      {
        q: 'Berapa lama sebelum penerbangan saya harus tiba di bandara?',
        a: 'Untuk penerbangan domestik, tiba minimal 2 jam sebelum keberangkatan; untuk internasional, 3 jam. Konter check-in tutup 45 menit sebelum keberangkatan.',
      },
      {
        q: 'Apa aturan cairan untuk bagasi kabin?',
        a: 'Cairan, aerosol, dan gel di bagasi kabin harus dalam wadah 100 ml atau kurang, ditempatkan dalam satu tas transparan dapat ditutup kembali berukuran 1 liter.',
      },
      {
        q: 'Apakah ada Wi-Fi gratis di bandara?',
        a: 'Ya. Hubungkan ke jaringan "MDC-FreeWiFi" di seluruh terminal. Tidak ada batas waktu; cukup terima syarat ketentuan di halaman masuk.',
      },
      {
        q: 'Di mana saya bisa menitipkan bagasi?',
        a: 'Konter penitipan bagasi tersedia di Lantai 1 sayap domestik (06:00–21:00). Tarif mulai IDR 25.000 per item per 4 jam.',
      },
      {
        q: 'Bagaimana cara ke Bunaken dari bandara?',
        a: 'Naik taksi atau bus DAMRI ke pelabuhan Manado (± 45 menit), lalu naik kapal umum atau charter ke Pulau Bunaken. Kapal biasanya berangkat sebelum pukul 15:00.',
      },
      {
        q: 'Bisakah saya tidur di bandara semalam?',
        a: 'Terminal buka 24 jam. Transit rest pod di sayap internasional dan area tempat duduk sisi darat tersedia; tarif parkir semalam berlaku untuk kendaraan.',
      },
      {
        q: 'Dokumen apa yang saya butuhkan untuk penerbangan internasional?',
        a: 'Paspor berlaku minimal 6 bulan, visa yang diperlukan, dan deklarasi bea cukai e-CD yang sudah diisi. Periksa persyaratan masuk negara tujuan Anda sebelum terbang.',
      },
    ],
  },

  footer: {
    address: 'Jl. A.A. Maramis, Manado 95374, Sulawesi Utara, Indonesia. IATA: MDC · ICAO: WAMM.',
    explore: 'Jelajahi',
    contact: 'Kontak',
    links: [
      ['Penerbangan', '#flights'],
      ['Peta bandara', '#map'],
      ['Parkir', '#parking'],
      ['Transportasi', '#transport'],
      ['Fasilitas', '#facilities'],
      ['Panduan perjalanan', '#guide'],
      ['Layanan', '#services'],
      ['FAQ', '#faq'],
    ],
    infoLabel: 'Informasi',
    emergencyLabel: 'Darurat',
    lostFoundLabel: 'Barang Hilang & Temuan',
    openHours: 'Buka 24 jam · WITA (UTC+8)',
    copyright: '© 2026 Bandar Udara Internasional Sam Ratulangi — prototipe desain',
  },

  chatbot: {
    greeting:
      'Halo! Saya Nara, asisten bandara MDC. Tanya saya tentang penerbangan, gate, parkir, transportasi, atau fasilitas.',
    title: 'Nara · Asisten Bandara',
    online: 'Online · 24/7',
    placeholder: 'Tanya tentang penerbangan, parkir…',
    fallback:
      'Saya bisa membantu soal penerbangan, parkir, transportasi, fasilitas, barang hilang, dan lainnya. Coba tanya "Di mana GA 601?" atau "Berapa tarif parkir?"',
  },
}
