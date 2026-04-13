export type AboutNavItem = {
  id: string;
  label: string;
};

export type AboutContentSection = {
  id: string;
  label: string;
  title: string;
  paragraphs: string[];
  highlight?: string;
};

export type AboutResourceLink = {
  label: string;
  href: string;
  description?: string;
};

export const ABOUT_HERO = {
  eyebrow: 'Komunitas Belajar Berdampak',
  title: 'Tentang Platform LMS Komunitas Belajar Berdampak',
  description:
    'Komunitas Belajar Berdampak merupakan platform Learning Management System (LMS) yang baru dirintis untuk memperkuat ekosistem pembelajaran kolaboratif. Platform ini dikembangkan untuk memfasilitasi ruang belajar yang terstruktur, terukur, dan relevan dengan tantangan pembelajaran modern, khususnya pada dinamika study group lintas mata kuliah.',
};

export const ABOUT_CONTENT_SECTIONS: AboutContentSection[] = [
  {
    id: 'ringkasan',
    label: 'Ringkasan Platform',
    title: 'Ringkasan Platform',
    paragraphs: [
      'Platform ini dirancang sebagai infrastruktur pembelajaran yang menghubungkan dosen, mahasiswa, dan komunitas belajar dalam satu ekosistem yang utuh. Dengan pendekatan LMS terpadu, setiap kegiatan belajar tidak hanya didokumentasikan, namun juga diarahkan untuk menghasilkan dampak nyata melalui keterlibatan aktif anggota study group.',
      'Komunitas Belajar Berdampak menempatkan pembelajaran kolaboratif sebagai fondasi utama. Karena itu, platform menyediakan ruang diskusi topik, pengelolaan tugas bersama, pemantauan kontribusi anggota, dan refleksi progres pembelajaran secara berkala. Pendekatan ini diharapkan mampu menumbuhkan budaya belajar yang lebih partisipatif, akuntabel, dan berorientasi hasil.',
    ],
  },
  {
    id: 'permasalahan',
    label: 'Permasalahan Study Group',
    title: 'Permasalahan Study Group',
    paragraphs: [
      'Pada praktiknya, banyak study group mengalami kendala yang berulang: pembagian tugas tidak merata, koordinasi kurang terdokumentasi, evaluasi kontribusi bersifat subjektif, dan tindak lanjut diskusi tidak berjalan konsisten. Kondisi ini sering membuat proses kolaborasi kehilangan arah, walaupun semangat belajar anggota cukup tinggi.',
      'Selain itu, aktivitas belajar kelompok acap kali terpisah dari sistem akademik utama. Informasi tersebar di berbagai kanal, sehingga dosen dan mahasiswa sulit mendapatkan gambaran perkembangan secara menyeluruh. Tanpa sistem yang terintegrasi, potensi pembelajaran berbasis komunitas menjadi tidak optimal.',
    ],
  },
  {
    id: 'pendekatan',
    label: 'Pendekatan Solusi',
    title: 'Pendekatan Solusi',
    paragraphs: [
      'Untuk menjawab tantangan tersebut, platform ini menerapkan pendekatan end-to-end: mulai dari pembentukan study group, penyusunan topik pembahasan, manajemen tugas terstruktur, hingga pemetaan kontribusi individu dalam tiap aktivitas. Setiap interaksi dikembangkan agar mudah ditelusuri dan dapat digunakan sebagai basis pengambilan keputusan pembelajaran.',
      'Mekanisme ini tidak hanya memudahkan operasional harian, tetapi juga membangun praktik pembelajaran reflektif. Dosen dapat memonitor dinamika kelompok secara lebih adil, sementara mahasiswa memiliki visibilitas yang lebih baik terhadap peran dan kemajuan masing-masing dalam proses kolaborasi.',
    ],
  },
  {
    id: 'teknologi',
    label: 'Teknologi Terkini',
    title: 'Teknologi Terkini yang Digunakan',
    paragraphs: [
      'Pada sisi front-end, aplikasi dikembangkan menggunakan React 19, TypeScript, dan Vite untuk menghadirkan antarmuka yang responsif, maintainable, serta memiliki jaminan kualitas tipe data. Pengelolaan data client dilakukan melalui Axios dan TanStack Query, sementara validasi formulir menggunakan Zod yang terintegrasi dengan React Hook Form.',
      'Lalu pada sisi back-end dikelola melalui layanan API berbasis Node.js dan Express. Pengelolaan basis data menggunakan MongoDB melalui Mongoose, dilengkapi penguatan keamanan seperti Helmet, CORS, rate limiting, sanitasi input, serta autentikasi berbasis JSON Web Token.',
      'Untuk dukungan kolaborasi konten, platform memanfaatkan TipTap sebagai rich text editor. Pada aspek observabilitas dan dokumentasi API, backend menggunakan Pino untuk logging serta Swagger (swagger-jsdoc dan swagger-ui-express) agar proses pengembangan, pengujian, dan kolaborasi tim dapat berjalan lebih terstruktur.',
    ],
  },
];

export const ABOUT_TEAM_SECTION = {
  id: 'tim',
  label: 'Pembimbing dan Tim',
  title: 'Pembimbing dan Tim Pengembang',
  mentorLabel: 'Pembimbing',
  mentorName: 'Meliana Christianti Johan, S. Kom., M.T.',
  studentsLabel: 'Tim Mahasiswa',
  students: ['Joshua Subianto', 'Elmosius Suli', 'Nathaniel Valentino Robert', 'Dheandra halwa Ghassani'],
};

export const ABOUT_NAV_ITEMS: AboutNavItem[] = [...ABOUT_CONTENT_SECTIONS.map(({ id, label }) => ({ id, label })), { id: ABOUT_TEAM_SECTION.id, label: ABOUT_TEAM_SECTION.label }];

export const ABOUT_NAV_TITLE = 'Navigasi';
export const ABOUT_BACK_BUTTON_LABEL = 'Kembali';
export const ABOUT_BACK_FALLBACK_GUEST_PATH = '/auth/login';

export const ABOUT_COMMUNITY_LINKS: AboutResourceLink[] = [
  {
    label: 'GitHub Organization Komunitas Belajar Berdampak',
    href: 'https://github.com/Komunitas-Belajar-Berdampak',
    description: 'Halaman utama organisasi untuk melihat seluruh repositori proyek.',
  },
  {
    label: 'Front-end Repository (dev)',
    href: 'https://github.com/Komunitas-Belajar-Berdampak/dev',
    description: 'Repositori front-end berbasis React + TypeScript.',
  },
  {
    label: 'Back-end Repository (be-dev)',
    href: 'https://github.com/Komunitas-Belajar-Berdampak/be-dev',
    description: 'Repositori back-end API berbasis Node.js + Express + MongoDB.',
  },
];

export const ABOUT_TECH_DOCS: AboutResourceLink[] = [
  { label: 'React Documentation', href: 'https://react.dev/' },
  { label: 'TypeScript Documentation', href: 'https://www.typescriptlang.org/docs/' },
  { label: 'Vite Documentation', href: 'https://vite.dev/guide/' },
  { label: 'TanStack Query Documentation', href: 'https://tanstack.com/query/latest/docs/framework/react/overview' },
  { label: 'Express Documentation', href: 'https://expressjs.com/' },
  { label: 'Mongoose Documentation', href: 'https://mongoosejs.com/docs/' },
  { label: 'Tailwind CSS Documentation', href: 'https://tailwindcss.com/docs' },
  { label: 'TipTap Documentation', href: 'https://tiptap.dev/docs/editor/getting-started/overview' },
  { label: 'Swagger OpenAPI Documentation', href: 'https://swagger.io/docs/' },
  { label: 'MongoDB Documentation', href: 'https://www.mongodb.com/docs/' },
];

export const ABOUT_TECH_LINK_SECTION = {
  communityTitle: 'Repositori Komunitas',
  communityDescription: 'Sumber utama pengembangan lintas tim pada organisasi Komunitas Belajar Berdampak.',
  docsTitle: 'Referensi Dokumentasi',
  docsDescription: 'Dokumentasi resmi teknologi yang digunakan untuk pengembangan platform.',
};
