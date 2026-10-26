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

  admin: {
    language: { label: 'Bahasa dashboard', english: 'Inggris', indonesian: 'Indonesia', switchToEnglish: 'Ganti bahasa dashboard ke Inggris', switchToIndonesian: 'Ganti bahasa dashboard ke Indonesia' },
    shell: {
      brandTitle: 'Bandara Sam Ratulangi', brandSubtitle: 'Operasional aerodrome · MDC', pilot: 'Pilot internal', pilotTooltip: 'Pilot operasional bandara internal dengan input penerbangan manual',
      clockLabel: 'Waktu bandara saat ini', timeZone: 'WITA', themeToLight: 'Ganti ke tema terang', themeToDark: 'Ganti ke tema gelap',
      eventLog: (unread) => `Log kejadian${unread ? `, ${unread} belum dibaca` : ''}`, openEventLog: 'Buka log kejadian', signOut: (email) => `Keluar${email ? ` ${email}` : ''}`,
      sessionChecking: 'Memeriksa sesi pilot…',
    },
    navigation: {
      label: 'Bagian admin', overview: 'Ringkasan', monitor: 'Monitor penerbangan', eventLog: 'Log kejadian',
      conflictCount: (count) => `${count} konflik`, unreadCount: (count) => `${count} pemberitahuan belum dibaca`,
      footerDuty: 'Petugas piket · WITA', manualPilot: 'PILOT INTERNAL · DATA DEMO SINTETIS',
    },
    operationalAlerts: {
      label: 'Status operasional', attention: 'Perlu perhatian', scheduleUpdates: 'Pembaruan jadwal', noAlerts: 'Tidak ada peringatan operasional aktif', syntheticScope: 'Pilot internal · data sintetis',
      conflictCount: (count) => `${count} konflik gate aktif`,
      delayCount: (count) => `${count} pemberitahuan keterlambatan prioritas tinggi terbaru`,
      gateChangeCount: (count) => `${count} pemberitahuan perubahan gate terbaru`,
      viewMonitor: 'Buka pemantauan penerbangan', viewEventLog: 'Buka log aktivitas',
    },
    summaryMetrics: {
      heading: 'Ringkasan metrik', scope: 'Seluruh bandara · data sintetis pilot internal', activeFlights: 'Penerbangan aktif', delayedFlights: 'Penerbangan terlambat',
      onTimeEstimate: 'Kinerja tepat waktu · estimasi pilot', gateUtilization: 'Penggunaan gate',
      trackedFlights: (tracked) => `${tracked} terpantau · pembatalan dikecualikan`,
      delayedOfTracked: (delayed, tracked) => `${delayed} dari ${tracked} penerbangan terpantau`,
      estimateBasis: (onTime, tracked) => `${onTime} tidak berstatus terlambat / ${tracked} terpantau · pembatalan dikecualikan`,
      gateOccupancy: (used, total) => `${used} dari ${total} gate terisi`,
    },
    page: {
      overviewEyebrow: 'Operasional / Terminal', overviewTitle: 'Operasional bandara', overviewDescription: 'Status giliran, pengecualian aktif, dan ringkasan pergerakan.',
      monitorEyebrow: 'Operasional / Penerbangan', monitorTitle: 'Monitor penerbangan', monitorDescription: 'Cari dan perbarui penerbangan terjadwal, kedatangan, dan keberangkatan.',
      eventEyebrow: 'Operasional / Aktivitas', eventTitle: 'Log kejadian', eventDescription: 'Pemberitahuan operasional dan pembaruan status penerbangan terbaru. Status belum dibaca dibagikan untuk meja pilot ini.',
      dutyOfficer: 'Petugas piket', loading: 'Memuat data operasional pilot…', retry: 'Coba lagi', filterWing: 'Filter sayap bandara', allWings: 'Semua sayap',
      domesticWing: 'Sayap domestik', internationalWing: 'Sayap internasional', dateLabel: 'Tanggal operasional dalam WITA',
      broadcastNotice: 'Kirim pemberitahuan', addFlight: 'Tambah penerbangan', coreVitals: 'Metrik inti', metricsPending: 'Definisi metrik menunggu persetujuan operasional',
      pilotDateSummary: (date) => `Pilot internal · data demo sintetis · ${date} · WITA`, highAlerts: (count) => `${count} prioritas tinggi`, operationsNotices: 'Pemberitahuan operasional', alertEyebrow: 'Pemberitahuan / Internal', viewEventLog: 'Lihat log kejadian',
    },
    common: {
      all: 'Semua', cancel: 'Batal', keep: 'Pertahankan', confirm: 'Konfirmasi', review: 'Tinjau', edit: 'Ubah', save: 'Simpan',
      searchFlights: 'Cari penerbangan', searchFlightRouteGate: 'Cari nomor, rute, atau gate', noFlightsMatch: 'Tidak ada penerbangan yang cocok dengan filter aktif.',
      departure: 'Keberangkatan', arrival: 'Kedatangan', domestic: 'Domestik', international: 'Internasional', gate: 'Gate', gateConflict: 'Konflik gate', route: 'Rute', status: 'Status', estimate: 'Perkiraan',
      notAvailable: '—', flights: 'penerbangan', completed: 'Selesai',
    },
    status: { SCHEDULED: 'Terjadwal', 'CHECK-IN': 'Check-in', BOARDING: 'Boarding', 'FINAL CALL': 'Panggilan terakhir', DEPARTED: 'Berangkat', LANDED: 'Mendarat', DELAYED: 'Tertunda', CANCELLED: 'Dibatalkan' },
    severity: { high: 'TINGGI', med: 'SEDANG', info: 'INFO' },
    actions: {
      openCheckIn: 'Buka check-in', startBoarding: 'Mulai boarding', finalCall: 'Panggilan terakhir', markDeparted: 'Tandai berangkat', markLanded: 'Tandai mendarat', advance: 'Lanjutkan', completed: 'Selesai',
      delay: (flight, minutes) => `Tunda ${flight} selama ${minutes} menit`,
    },
    vitals: {
      labels: { completion: 'Penerbangan selesai', delayRate: 'Tingkat keterlambatan', boarding: 'Sedang boarding', gateUtilisation: 'Penggunaan gate', activeFlights: 'Penerbangan aktif' },
      units: { completedTracked: 'Berangkat atau mendarat / tercatat', delayedTracked: 'Tertunda / penerbangan tercatat', boardingActive: 'Boarding atau panggilan terakhir / aktif', gatesUsedTotal: 'Gate digunakan / total gate', activeTracked: 'Berjalan / tercatat' },
    },
    queue: {
      eyebrow: 'Antrean tindakan / 01', title: 'Penerbangan prioritas', subtitle: 'Dahulukan yang tertunda. Lanjutkan status untuk menuntaskan alur.', delayed: 'Tertunda', noDelayed: 'Tidak ada penerbangan tertunda', delayedOnly: 'Hanya yang tertunda', showAll: 'Tampilkan semua',
      attention: (count) => `Perlu perhatian (${count})`, allActive: (count) => `Semua aktif (${count})`, flightRoute: 'Penerbangan / rute', gateEstimateStatus: 'Gate · Perkiraan · Status', to: 'Ke', from: 'Dari', gateConflictTitle: 'Konflik gate',
      noFlightsMatchView: 'Tidak ada penerbangan yang cocok dengan tampilan ini.', confirmCancel: (flight) => `Konfirmasi pembatalan ${flight}`, delayFlight: (flight, minutes) => `Tunda ${flight} selama ${minutes} menit`,
    },
    conflicts: {
      eyebrow: 'Pusat konflik / 00', title: 'Konflik gate', noConflicts: 'Tidak ada konflik gate yang terdeteksi', needsAction: 'Perlu tindakan', autoResolve: (count) => `Atasi otomatis ${count}`,
      noFreeGate: (wing) => `Tidak ada gate ${wing} yang kosong — tunda penerbangan atau ubah waktunya.`, noFreeGatePlan: (count) => `${count} konflik tidak memiliki gate kosong — sesuaikan waktu atau tunda penerbangan.`,
      draftRule: 'Aturan pilot masih berupa draf dan menunggu persetujuan operasional: gate sama dalam rentang 30 menit atau gate di luar rentang sayap.',
      doubleBooked: (gate) => `Gate ${gate} digunakan bersamaan`, invalidGate: (gate) => `Gate ${gate} tidak valid`, moveFlight: (flight, gate) => `Pindahkan ${flight} ke ${gate}`, reviewFlight: 'Tinjau penerbangan',
    },
    gates: {
      eyebrow: 'Matriks gate / 02', title: 'Status gate', selectGate: 'Pilih gate untuk melihat penerbangannya.', occupied: 'Terisi', boarding: 'Boarding', delayed: 'Tertunda', free: 'Kosong',
      gates: 'gate', activeFlights: (count) => `${count} aktif`, flightAbbr: 'pnb', noFlightsOnGate: 'Tidak ada penerbangan aktif di gate ini.', gateAccessible: (gate, count) => `Gate ${gate}, ${count} penerbangan aktif`,
    },
    traffic: {
      eyebrow: 'Pergerakan / 04', title: 'Pergerakan per jam', departures: 'Keberangkatan', arrivals: 'Kedatangan', chartLabel: 'Keberangkatan dan kedatangan berdasarkan perkiraan jam',
      chartDescription: (hour, count, direction) => `Pukul ${hour}:00 — ${count} ${direction}`, groupedByEstimate: 'Dikelompokkan berdasarkan perkiraan waktu (WITA). Kolom sorotan menunjukkan jam saat ini.',
    },
    statusMix: { eyebrow: 'Komposisi status / 05', title: 'Penerbangan menurut status', chartLabel: (count) => `${count} penerbangan menurut status`, empty: 'Tidak ada penerbangan pada tampilan ini.' },
    airlines: { eyebrow: 'Maskapai / 03', title: 'Lalu lintas per maskapai', rightLabel: 'Penerbangan · porsi keterlambatan', empty: 'Tidak ada penerbangan pada tampilan ini.' },
    notices: {
      empty: 'Belum ada pemberitahuan.', severityLabel: 'Tingkat prioritas pemberitahuan',
      system: {
        flightAdded: (flight, direction, city) => `Operasional menambahkan penerbangan ${flight} ${direction} ${city}.`,
        delayed: (flight, direction, city, minutes) => `Penerbangan ${flight} ${direction} ${city} terlambat ${minutes} menit.`,
        cancelled: (flight, direction, city) => `Penerbangan ${flight} ${direction} ${city} dibatalkan. Silakan hubungi maskapai.`,
        gateChanged: (flight, gate) => `Perubahan gate: penerbangan ${flight} kini menggunakan Gate ${gate}.`,
        statusUpdated: (flight, status) => `Operasional memperbarui ${flight}: ${status.toLowerCase()}.`,
      },
    },
    eventLog: {
      eyebrow: 'Log kejadian / 03', title: 'Pemberitahuan terbaru', highRecent: (total, high) => `${total} · ${high} prioritas tinggi · kejadian terbaru`, filterLabel: 'Filter pemberitahuan', all: 'Semua', delays: 'Keterlambatan', gateChanges: 'Perubahan gate', boarding: 'Boarding', info: 'Info', emptyType: 'Tidak ada pemberitahuan dengan jenis ini.',
    },
    monitor: {
      eyebrow: 'Manajemen penerbangan / 02', title: 'Monitor penerbangan', flightType: 'Jenis penerbangan', allFlights: 'Semua penerbangan', departures: 'Keberangkatan', arrivals: 'Kedatangan',
      sortBy: 'Urutkan penerbangan berdasarkan', sortEstimate: 'Perkiraan waktu', sortFlight: 'Nomor penerbangan', sortAirline: 'Maskapai', sortRoute: 'Rute', sortGate: 'Gate', sortStatus: 'Status', sortAscending: 'Urutkan naik', sortDescending: 'Urutkan turun',
      searchPlaceholder: 'Cari nomor, rute, atau gate', tableFlight: 'Penerbangan', tableRoute: 'Rute', tableGate: 'Gate', tableEstimate: 'Perkiraan', tableStatus: 'Status', nextStep: 'Tindakan berikutnya',
      gateFor: (flight) => `Gate untuk ${flight}`, estimateFor: (flight) => `Perkiraan waktu ${flight}`, statusFor: (flight) => `Status ${flight}`, invalidGate: 'Gate tidak sesuai dengan sayap ini.', gateConflict: 'Konflik gate: penerbangan aktif lain menggunakan gate ini dalam rentang 30 menit.', schedule: (time) => `jadwal ${time}`,
      showing: (start, end, total) => `Menampilkan ${start}–${end} dari ${total} penerbangan yang dimuat`, noMatches: 'Tidak ada penerbangan yang cocok dengan filter aktif.', previous: 'Sebelumnya', next: 'Berikutnya',
    },
    dialogs: {
      eyebrow: 'Tindakan operasional', close: 'Tutup dialog', addTitle: 'Tambah penerbangan', editTitle: (flight) => 'Ubah ' + flight, noticeTitle: 'Kirim pemberitahuan', flightNumber: 'Nomor penerbangan', airline: 'Maskapai', destination: 'Tujuan', origin: 'Asal', flightType: 'Jenis penerbangan', wing: 'Sayap', gate: 'Gate', operatingDate: 'Tanggal operasional (WITA)', scheduledWita: 'Jadwal (WITA)', estimatedWita: 'Perkiraan (WITA)', status: 'Status', noticeLabel: 'Pemberitahuan operasional internal', noticePlaceholder: 'Tulis pemberitahuan operasional internal…', noticeInfo: 'Disimpan di Log kejadian internal. Pilot ini tidak menerbitkan pemberitahuan ke situs publik.', gateExample: 'mis. D1 atau I3', createFlight: 'Buat penerbangan', saveFlight: 'Simpan penerbangan', publishNotice: 'Terbitkan pemberitahuan', saving: 'Menyimpan…', errorFlight: 'Tindakan penerbangan tidak dapat diselesaikan.',
    },
    errors: {
      generic: 'Permintaan tidak dapat diselesaikan.', authRequired: 'Masuk untuk menggunakan operasional bandara.', permissionDenied: 'Akun ini tidak dapat melakukan tindakan operasional bandara.', validation: 'Periksa detail penerbangan, lalu coba lagi.', duplicateRecord: 'Data dengan detail tersebut sudah ada.', duplicateActiveFlight: 'Penerbangan aktif dengan detail tersebut sudah ada di papan.', flightNotFound: 'Penerbangan tidak ditemukan. Muat ulang papan, lalu coba lagi.', versionConflict: 'Data penerbangan berubah. Muat ulang dan periksa nilai terbaru sebelum menyimpan.', flightFinished: 'Penerbangan ini sudah selesai.', rateLimited: 'Terlalu banyak percobaan masuk. Coba lagi nanti.', originRejected: 'Asal permintaan tidak diizinkan.',
    },
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
