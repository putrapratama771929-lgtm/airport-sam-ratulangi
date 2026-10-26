# Portal Bandara Sam Ratulangi

Prototipe informasi penumpang dan pilot internal operasional bandara untuk Bandar Udara Internasional Sam Ratulangi (MDC), Manado.

> **Batasan data:** Papan penerbangan penumpang menggunakan data simulasi. Dashboard admin menggunakan data pilot yang dimasukkan secara manual dan disimpan di basis data SQLite lokal. Keduanya tidak terhubung ke feed langsung bandara atau maskapai, dan data admin tidak diterbitkan ke situs penumpang.

## Fitur

### Situs penumpang (`/`)

- Contoh jadwal keberangkatan dan kedatangan yang dapat dicari, dengan perubahan status simulasi.
- Peta bandara interaktif, informasi parkir dan transportasi, serta panduan layanan.
- Konten berbahasa Indonesia dan Inggris, serta asisten bandara luring berbasis aturan.

### Dashboard admin (`/admin`)

- Tiga area kerja: Ringkasan, Monitor Penerbangan, dan Log Aktivitas.
- Deteksi konflik gate, status penggunaan gate, antrean prioritas, dan ringkasan pergerakan.
- Pembuatan dan penyuntingan data penerbangan secara manual, tindakan status, penundaan dan pembatalan, serta pemindahan gate.
- Setiap perubahan dicatat dalam audit dan menggunakan pemeriksaan versi; status baca log aktivitas digunakan bersama oleh petugas pilot.
- Antarmuka berbahasa Indonesia dan Inggris, dengan preferensi bahasa dan tema yang tersimpan.

Dashboard admin ditujukan untuk validasi pilot lokal dan belum untuk penggunaan operasional. Dashboard ini tidak terhubung ke sistem bandara langsung.

## Teknologi

- React 19, TypeScript 5.9, dan Vite 7.
- Tailwind CSS 3.4, CSS khusus dashboard, dan ikon Lucide.
- React Router 7 dan komponen Radix UI.
- Node.js 24+ untuk API HTTP lokal dan dukungan SQLite bawaan.
- Runner pengujian bawaan Node.js (`node --test`).

## Menjalankan secara lokal

### Persyaratan

- Node.js versi 24 atau lebih baru
- npm versi 10 atau lebih baru

### Instalasi dan menjalankan

```bash
git clone https://github.com/putrapratama771929-lgtm/airport-sam-ratulangi.git
cd airport-sam-ratulangi
npm install
npm run dev
```

Buka [http://127.0.0.1:3000](http://127.0.0.1:3000). Perintah pengembangan menjalankan situs Vite dan API pilot lokal. Secara default, API berjalan di `127.0.0.1:3001`, dan basis data SQLite dibuat di `./var/airport-pilot.sqlite`.

Basis data pilot dimulai tanpa data penerbangan. Untuk mengisi contoh penerbangan, pemberitahuan, dan entri audit sintetis, jalankan perintah berikut satu kali di terminal kedua:

```bash
npm run pilot:seed-demo
```

Seeder menolak mencampurkan data demo ke basis data yang sudah berisi penerbangan. Data yang dibuat bersifat sintetis dan tidak boleh dianggap sebagai data operasional langsung.

### Membuat akun operator pilot

Tidak ada akun bawaan atau pendaftaran publik. Buat akun operator pertama secara lokal:

1. Salin `.env.example` menjadi `.env`.
2. Isi `PILOT_ADMIN_EMAIL` dan `PILOT_ADMIN_PASSWORD` dengan kredensial operator. Gunakan kata sandi unik minimal 12 karakter.
3. Jalankan `npm run pilot:create-operator`.
4. Hapus `PILOT_ADMIN_PASSWORD` dari `.env` setelah pembuatan akun.
5. Masuk melalui `/login`.

Jaga kerahasiaan `.env`; file tersebut diabaikan oleh Git. Buat akun operator melalui proses terpisah dan terkendali.

## Konfigurasi

Nilai bawaan untuk pengembangan tercantum di `.env.example`:

| Variabel | Fungsi | Nilai bawaan |
| --- | --- | --- |
| `PILOT_DB_PATH` | Lokasi berkas basis data SQLite | `./var/airport-pilot.sqlite` |
| `PILOT_HOST` | Alamat bind API/server | `127.0.0.1` |
| `PILOT_API_PORT` | Port API pilot | `3001` |
| `VITE_PORT` | Port server pengembangan Vite | `3000` |

Lingkungan produksi juga memerlukan satu origin HTTPS yang tepat di `PILOT_APP_ORIGIN` dan penyimpanan basis data persisten. Akhiri TLS pada server atau reverse proxy yang disetujui. Aplikasi ini tidak menyiapkan infrastruktur produksi atau pencadangan secara otomatis.

## Perintah

| Perintah | Fungsi |
| --- | --- |
| `npm run dev` | Menjalankan situs lokal dan API pilot |
| `npm run build` | Memeriksa tipe dan membuat build produksi di `dist/` |
| `npm run preview` | Meninjau build produksi Vite secara lokal |
| `npm start` | Menyajikan build produksi dan API |
| `npm run pilot:seed-demo` | Mengisi dataset pilot sintetis ke basis data penerbangan yang kosong |
| `npm run pilot:create-operator` | Membuat akun operator dari variabel lingkungan sementara |
| `npm test` | Menjalankan pengujian domain dan API pilot |
| `npm run lint` | Menjalankan ESLint |

## Batasan operasional dan deployment

- Semua waktu pilot ditampilkan dalam WITA (`Asia/Makassar`, UTC+8).
- Data penerbangan dimasukkan secara manual dan disimpan secara lokal; tidak ada integrasi feed langsung.
- Pemberitahuan dashboard bersifat internal dan tidak dikirim ke situs penumpang.
- Penggunaan produksi memerlukan persetujuan pemilik operasional bandara, host dan kebijakan akses yang disetujui, HTTPS, penyimpanan persisten, serta prosedur pencadangan dan pemulihan yang telah dilatih.

## Lisensi

Proyek ini ditujukan untuk demonstrasi dan validasi pilot internal.
