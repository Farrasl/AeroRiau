# Sistem Pemantauan Kualitas Udara & Titik Panas (Hotspot) Real-Time Riau

Aplikasi Web GIS canggih berbasis **Turborepo Monorepo** untuk pemantauan titik panas (*fire hotspots*) dan Indeks Standar Pencemar Udara (ISPU / AQI) secara real-time di Provinsi Riau, Indonesia.

---

## 🏛️ Arsitektur Monorepo

```
D:\GIS Web\
├── apps/
│   ├── web/                     # Next.js 14 (App Router) + Tailwind + shadcn/ui + Mapbox GL + Zustand
│   └── api/                     # NestJS + Cron Ingestion Worker + Prisma PostGIS + Spatial Endpoints
├── packages/
│   └── types/                   # Kontrak bersama GeoJSON & Domain Types
├── turbo.json                   # Konfigurasi orkestrasi Turborepo
└── package.json
```

---

## 🚀 Panduan Setup & Menjalankan

### 1. Hubungkan ke Supabase Cloud (Gratis)
1. Buat akun & proyek baru di [https://supabase.com/](https://supabase.com/) (Pilih region terdekat: **Singapore**).
2. Di Dashboard Supabase, buka menu **Database** -> **Extensions**.
3. Cari **`postgis`** dan klik tombol toggle untuk mengaktifkannya (*1-click enable*).
4. Masuk ke **Project Settings** -> **Database** -> **Connection string** (URI).
5. Buat file `.env` di root proyek atau salin dari `.env.example`:
   ```bash
   cp .env.example .env
   ```
   Isi `DATABASE_URL` dan `DIRECT_URL` dengan connection string dari Supabase Anda.

---

### 2. Install Dependensi & Inisialisasi Database
Jalankan di terminal:

```bash
# 1. Install seluruh workspace dependencies
npm install

# 2. Sinkronkan skema PostGIS ke Supabase
npm run db:push

# 3. Seed data awal stasiun pemantau ISPU di Riau
npm run db:seed
```

---

### 3. Jalankan Aplikasi (Mode Development)

```bash
# Menjalankan Frontend (port 3000) dan Backend (port 4000) secara serentak via Turborepo
npm run dev
```

- **Frontend Web GIS**: [http://localhost:3000](http://localhost:3000)
- **Backend API & Swagger/Docs**: [http://localhost:4000/api](http://localhost:4000/api)
  - `GET /api/hotspots` (GeoJSON FeatureCollection titik api)
  - `GET /api/peatlands` (GeoJSON poligon kubah lahan gambut Riau)
  - `GET /api/air-quality/stations` (Data stasiun ISPU, PM2.5, suhu, angin)
  - `GET /api/stats/summary` (Ringkasan analitik 24 jam)
  - `POST /api/hotspots/sync` (Trigger sinkronisasi NASA FIRMS manual)

---

### 4. API Keys Eksternal (Opsional)
- **NASA FIRMS API**: Dapatkan MAP_KEY gratis di [https://firms.modaps.eosdis.nasa.gov/api/map_key/](https://firms.modaps.eosdis.nasa.gov/api/map_key/). Masukkan ke `NASA_FIRMS_MAP_KEY` di `.env`. *(Jika belum diisi, sistem otomatis mengaktifkan generator titik panas Riau berbasis kecerdasan spasial real-time)*.
- **Mapbox Token**: Masukkan `NEXT_PUBLIC_MAPBOX_TOKEN`. *(Jika dibiarkan kosong, aplikasi otomatis beralih menggunakan Dark Basemap terbuka tanpa biaya)*.
- **Open-Meteo Weather & AQI**: Telah terintegrasi otomatis secara gratis tanpa butuh API key.
