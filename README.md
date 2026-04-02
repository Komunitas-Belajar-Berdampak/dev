# Komunitas Belajar Berdampak - Frontend

## Release Version

Alpha (v0.1.0-alpha)

## Tujuan

Platform manajemen pembelajaran kolaboratif untuk tiga peran utama: Super Admin, Dosen, dan Mahasiswa.

## Tech Stack

- React 19 + TypeScript + Vite
- React Router DOM untuk routing dan proteksi role
- TanStack React Query + Axios untuk data fetching
- React Hook Form + Zod untuk form dan validasi
- Zustand untuk state management
- Tailwind CSS 4 + Radix UI untuk UI components
- TipTap untuk rich text editor
- ApexCharts untuk visualisasi data

## Fitur

- Autentikasi login dan role-based access (Super Admin, Dosen, Mahasiswa)
- Manajemen data akademik oleh Super Admin: user, fakultas, program studi, tahun akademik/semester, mata kuliah
- Fitur Dosen: kelola pertemuan, materi/tugas, penilaian submission, dashboard perkuliahan, dan study group
- Fitur Mahasiswa: akses mata kuliah, upload submission, kelola private file, dan ikut diskusi study group
- Manajemen profil pengguna

## Directory Utama

```text
src/
  api/            # Service API per modul
  components/     # Layout, pages, dan shared components
  hooks/          # Custom React hooks
  lib/            # Utility (axios client, helper, formatter)
  routes/         # Konfigurasi routing dan route guard
  styles/         # Styling global dan variables
  types/          # Type definitions per domain
```

## Cara Install

1. Clone repository ini.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Buat file environment dari template:

   ```powershell
   Copy-Item .env.example .env
   ```

4. Jalankan project:

   ```bash
   npm run dev
   ```

## Environment

Gunakan variabel berikut di file `.env`:

```env
VITE_API_URL=http://localhost:3000/api
```

## Script Penting

- `npm run dev` menjalankan development server
- `npm run build` build untuk production
- `npm run preview` preview hasil build
- `npm run lint` menjalankan ESLint
