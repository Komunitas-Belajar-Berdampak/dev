import type { MatakuliahDetail } from "./types";

export const matakuliahDetailDummy: MatakuliahDetail[] = [
  {
    id: "1",
    kodeMatkul: "IN212",
    namaMatkul: "WEB DASAR",
    sks: 4,
    kelas: "A",
    deskripsi:
      "Mata kuliah Web Dasar membahas konsep fundamental dalam pengembangan web, dimulai dari pemahaman cara kerja web, struktur halaman, serta teknologi utama yang digunakan dalam membangun sebuah website.\n\nPada mata kuliah ini, mahasiswa akan mempelajari HTML sebagai fondasi struktur halaman web, CSS untuk mengatur tampilan dan layout agar lebih menarik dan responsif, serta JavaScript sebagai bahasa pemrograman untuk menambahkan interaktivitas pada halaman web.\n\nSelain aspek teknis, mahasiswa juga diperkenalkan pada prinsip dasar desain web, seperti keterbacaan, konsistensi, dan user experience (UX). Di akhir perkuliahan, mahasiswa diharapkan mampu membangun sebuah website sederhana yang terstruktur dengan baik, memiliki tampilan yang rapi, serta interaktif.",
    pertemuan: [
      {
        id: "p1",
        pertemuan: 1,
        judul: "Pengenalan Web",
        deskripsi:
          "Membahas sejarah perkembangan web, cara kerja internet, serta peran web dalam sistem informasi modern.",
      },
      {
        id: "p2",
        pertemuan: 2,
        judul: "HTML Dasar",
        deskripsi:
          "Mempelajari struktur dasar HTML, penggunaan tag, atribut, serta semantic HTML untuk membangun halaman web yang terstruktur.",
      },
      {
        id: "p3",
        pertemuan: 3,
        judul: "CSS Dasar",
        deskripsi:
          "Mengenal konsep styling, layout dasar, serta penggunaan CSS untuk mempercantik dan mengatur tampilan halaman web.",
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
      "Mata kuliah Jaringan Komputer membahas konsep dasar komunikasi data dan bagaimana komputer saling terhubung dalam sebuah jaringan.\n\nMahasiswa akan mempelajari model referensi jaringan seperti OSI dan TCP/IP untuk memahami proses pengiriman data dari satu perangkat ke perangkat lain. Selain itu, mata kuliah ini juga membahas perangkat jaringan seperti hub, switch, router, serta media transmisi yang digunakan.\n\nDi akhir perkuliahan, mahasiswa diharapkan mampu memahami cara kerja jaringan lokal (LAN), jaringan luas (WAN), serta dasar troubleshooting jaringan sederhana.",
    pertemuan: [
      {
        id: "p1",
        pertemuan: 1,
        judul: "Pengantar Jaringan",
        deskripsi:
          "Pengenalan konsep jaringan komputer, jenis jaringan, serta manfaat jaringan dalam kehidupan sehari-hari.",
      },
      {
        id: "p2",
        pertemuan: 2,
        judul: "Model OSI & TCP/IP",
        deskripsi:
          "Pembahasan lapisan-lapisan pada model OSI dan TCP/IP serta fungsi masing-masing layer dalam komunikasi data.",
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
      "Mata kuliah Basis Data membahas konsep penyimpanan dan pengelolaan data secara terstruktur menggunakan sistem basis data.\n\nMahasiswa akan mempelajari perancangan database relasional menggunakan Entity Relationship Diagram (ERD), proses normalisasi untuk menghindari redundansi data, serta penerapan aturan integritas data.\n\nSelain itu, mahasiswa juga akan mempraktikkan penggunaan Structured Query Language (SQL) untuk melakukan manipulasi data seperti insert, update, delete, dan query data. Di akhir perkuliahan, mahasiswa diharapkan mampu merancang dan mengimplementasikan basis data sederhana menggunakan DBMS.",
    pertemuan: [
      {
        id: "p1",
        pertemuan: 1,
        judul: "Konsep Basis Data",
        deskripsi:
          "Pengenalan konsep data, informasi, basis data, serta peran DBMS dalam pengelolaan data.",
      },
      {
        id: "p2",
        pertemuan: 2,
        judul: "ERD & Normalisasi",
        deskripsi:
          "Mempelajari perancangan database menggunakan ERD serta proses normalisasi untuk menghasilkan struktur tabel yang efisien.",
      },
      {
        id: "p3",
        pertemuan: 3,
        judul: "SQL Dasar",
        deskripsi:
          "Pengenalan perintah SQL dasar untuk mengelola dan mengambil data dari basis data relasional.",
      },
    ],
  },
];