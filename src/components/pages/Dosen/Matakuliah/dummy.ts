import type { MatakuliahDetail } from "./types";

export const matakuliahDetailDummy: MatakuliahDetail[] = [
  {
    id: "1",
    kodeMatkul: "IN212",
    namaMatkul: "WEB DASAR",
    sks: 4,
    kelas: "A",
    deskripsi:
      "Web dasar membahas tentang pengenalan HTML, CSS, dan JavaScript untuk membangun halaman web yang responsif dan interaktif. Mata kuliah ini mencakup struktur dasar HTML, styling dengan CSS, serta pemrograman dasar menggunakan JavaScript.\n\nSelain itu, mahasiswa juga akan mempelajari konsep desain web yang baik dan praktik terbaik dalam pengembangan web.",
    pertemuan: [
      {
        id: "p1",
        pertemuanKe: 1,
        judul: "Pengenalan Web",
        deskripsi: "Sejarah dan konsep dasar web",
      },
      {
        id: "p2",
        pertemuanKe: 2,
        judul: "HTML Dasar",
        deskripsi: "Struktur HTML dan semantic tag",
      },
      {
        id: "p3",
        pertemuanKe: 3,
        judul: "CSS Dasar",
        deskripsi: "Styling dan layout dasar",
      },
    ],
  },

  {
    id: "2",
    kodeMatkul: "IN301",
    namaMatkul: "JARINGAN KOMPUTER",
    sks: 3,
    kelas: "B",
    deskripsi:
      "Mata kuliah ini membahas konsep dasar jaringan komputer, model OSI, TCP/IP, serta perangkat jaringan.\n\nMahasiswa akan memahami cara kerja komunikasi data dalam jaringan lokal maupun global.",
    pertemuan: [
      {
        id: "p1",
        pertemuanKe: 1,
        judul: "Pengantar Jaringan",
      },
      {
        id: "p2",
        pertemuanKe: 2,
        judul: "Model OSI & TCP/IP",
      },
    ],
  },

  {
    id: "3",
    kodeMatkul: "IN401",
    namaMatkul: "BASIS DATA",
    sks: 3,
    kelas: "A",
    deskripsi:
      "Mata kuliah Basis Data membahas perancangan database relasional, ERD, normalisasi, serta penggunaan SQL.\n\nMahasiswa akan mengimplementasikan database menggunakan DBMS.",
    pertemuan: [
      {
        id: "p1",
        pertemuanKe: 1,
        judul: "Konsep Basis Data",
      },
      {
        id: "p2",
        pertemuanKe: 2,
        judul: "ERD & Normalisasi",
      },
      {
        id: "p3",
        pertemuanKe: 3,
        judul: "SQL Dasar",
      },
    ],
  },
];
