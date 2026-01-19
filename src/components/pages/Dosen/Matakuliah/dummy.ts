import type { MatakuliahDetail } from "./types";

export const matakuliahDetailDummy: MatakuliahDetail = {
    id: "1",
    kodeMatkul: "IN212",
    namaMatkul: "WEB DASAR",
    sks: 4,
    kelas: "A",
    deskripsi: "Web dasar membahas tentang pengenalan HTML, CSS, dan JavaScript untuk membangun halaman web yang responsif dan interaktif. Mata kuliah ini mencakup struktur dasar HTML, styling dengan CSS, serta pemrograman dasar menggunakan JavaScript. Selain itu, mahasiswa juga akan mempelajari konsep desain web yang baik dan praktik terbaik dalam pengembangan web.",
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
};
