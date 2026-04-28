import type { ApiResponse } from '@/types/api';
import type { ContributionReview, ContributionReviewQueryParams, ReviewContributionPayload } from '@/types/contribution-review';
import type { JSONContent } from '@tiptap/react';

const MOCK_DELAY_MS = 350;
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

const paragraph = (text: string): JSONContent => ({
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [{ type: 'text', text }],
    },
  ],
});

const mockContributionReviewsBySg = new Map<string, ContributionReview[]>();

const createMockContributionReviews = (studyGroupId: string): ContributionReview[] => {
  const baseReviews: Omit<ContributionReview, 'id' | 'post' | 'threadId'>[] = [
    {
      threadTitle: 'Analisis Kebutuhan Sistem',
      assignment: 'Assignment 1',
      student: { id: 'mhs-1', nrp: '5025211001', nama: 'Andi Pratama' },
      aiSuggestedPoints: 8,
      aiReason: 'Mahasiswa memberikan jawaban relevan, menjelaskan kebutuhan sistem, dan menambahkan alasan manfaat pencatatan progres.',
      finalPoints: null,
      lecturerNote: null,
      status: 'PENDING',
      createdAt: '2026-04-27T12:30:00.000Z',
      reviewedAt: null,
    },
    {
      threadTitle: 'Desain Database Kontribusi',
      assignment: 'Assignment 2',
      student: { id: 'mhs-2', nrp: '5025211002', nama: 'Bella Maharani' },
      aiSuggestedPoints: 10,
      aiReason: 'Mahasiswa memberi usulan struktur data yang spesifik dan relevan dengan kebutuhan audit kontribusi.',
      finalPoints: null,
      lecturerNote: null,
      status: 'PENDING',
      createdAt: '2026-04-27T13:15:00.000Z',
      reviewedAt: null,
    },
    {
      threadTitle: 'Analisis Kebutuhan Sistem',
      assignment: 'Assignment 1',
      student: { id: 'mhs-3', nrp: '5025211003', nama: 'Citra Amelia' },
      aiSuggestedPoints: 7,
      aiReason: 'Mahasiswa menanggapi pendapat anggota lain dan mengaitkan diskusi dengan kebutuhan validasi dosen.',
      finalPoints: 7,
      lecturerNote: 'Kontribusi sudah relevan dan menunjukkan kesadaran terhadap akuntabilitas penilaian.',
      status: 'REVIEWED',
      createdAt: '2026-04-27T14:05:00.000Z',
      reviewedAt: '2026-04-27T15:00:00.000Z',
    },
    {
      threadTitle: 'Dashboard Kontribusi Assignment',
      assignment: 'Assignment 3',
      student: { id: 'mhs-4', nrp: '5025211004', nama: 'Dimas Arya' },
      aiSuggestedPoints: 9,
      aiReason: 'Mahasiswa menghubungkan kebutuhan dashboard dengan evaluasi konsistensi kontribusi antar assignment.',
      finalPoints: null,
      lecturerNote: null,
      status: 'PENDING',
      createdAt: '2026-04-27T15:20:00.000Z',
      reviewedAt: null,
    },
    {
      threadTitle: 'Prototype Fitur Utama',
      assignment: 'Assignment 3',
      student: { id: 'mhs-5', nrp: '5025211005', nama: 'Eka Putri' },
      aiSuggestedPoints: 6,
      aiReason: 'Mahasiswa memberikan masukan singkat tentang prioritas fitur, tetapi belum menjelaskan dampaknya secara mendalam.',
      finalPoints: null,
      lecturerNote: null,
      status: 'PENDING',
      createdAt: '2026-04-27T16:05:00.000Z',
      reviewedAt: null,
    },
    {
      threadTitle: 'Evaluasi dan Presentasi',
      assignment: 'Assignment 4',
      student: { id: 'mhs-6', nrp: '5025211006', nama: 'Fajar Nugroho' },
      aiSuggestedPoints: 8,
      aiReason: 'Mahasiswa menyusun saran evaluasi yang dapat dipakai untuk memperbaiki presentasi kelompok.',
      finalPoints: 8,
      lecturerNote: 'Saran cukup praktis dan relevan untuk persiapan presentasi.',
      status: 'REVIEWED',
      createdAt: '2026-04-27T16:40:00.000Z',
      reviewedAt: '2026-04-27T17:00:00.000Z',
    },
    {
      threadTitle: 'Pembagian Tugas Kelompok',
      assignment: 'Assignment 2',
      student: { id: 'mhs-7', nrp: '5025211007', nama: 'Gita Anindya' },
      aiSuggestedPoints: 5,
      aiReason: 'Mahasiswa membantu koordinasi tugas, namun kontribusi analitis terhadap materi masih terbatas.',
      finalPoints: null,
      lecturerNote: null,
      status: 'PENDING',
      createdAt: '2026-04-27T17:10:00.000Z',
      reviewedAt: null,
    },
    {
      threadTitle: 'Validasi Alur Sistem',
      assignment: 'Assignment 4',
      student: { id: 'mhs-8', nrp: '5025211008', nama: 'Hana Safira' },
      aiSuggestedPoints: 9,
      aiReason: 'Mahasiswa mengidentifikasi risiko alur review kontribusi dan menawarkan solusi validasi.',
      finalPoints: null,
      lecturerNote: null,
      status: 'PENDING',
      createdAt: '2026-04-27T17:45:00.000Z',
      reviewedAt: null,
    },
    {
      threadTitle: 'Refleksi Progres Kelompok',
      assignment: 'Assignment 4',
      student: { id: 'mhs-9', nrp: '5025211009', nama: 'Irfan Maulana' },
      aiSuggestedPoints: 6,
      aiReason: 'Mahasiswa menyampaikan refleksi progres, tetapi belum memberi tindak lanjut yang konkret.',
      finalPoints: 5,
      lecturerNote: 'Refleksi sudah ada, namun tindak lanjut masih perlu diperjelas.',
      status: 'REVIEWED',
      createdAt: '2026-04-27T18:10:00.000Z',
      reviewedAt: '2026-04-27T18:30:00.000Z',
    },
    {
      threadTitle: 'Analisis Kebutuhan Sistem',
      assignment: 'Assignment 1',
      student: { id: 'mhs-2', nrp: '5025211002', nama: 'Bella Maharani' },
      aiSuggestedPoints: 7,
      aiReason: 'Mahasiswa menambahkan contoh kebutuhan non-fungsional yang relevan untuk sistem study group.',
      finalPoints: null,
      lecturerNote: null,
      status: 'PENDING',
      createdAt: '2026-04-27T18:45:00.000Z',
      reviewedAt: null,
    },
    {
      threadTitle: 'Desain Database Kontribusi',
      assignment: 'Assignment 2',
      student: { id: 'mhs-4', nrp: '5025211004', nama: 'Dimas Arya' },
      aiSuggestedPoints: 8,
      aiReason: 'Mahasiswa memperjelas relasi antara post, thread, dan contribution review.',
      finalPoints: 8,
      lecturerNote: 'Relasi data yang dijelaskan sudah tepat dan membantu desain backend.',
      status: 'REVIEWED',
      createdAt: '2026-04-27T19:05:00.000Z',
      reviewedAt: '2026-04-27T19:35:00.000Z',
    },
    {
      threadTitle: 'Prototype Fitur Utama',
      assignment: 'Assignment 3',
      student: { id: 'mhs-1', nrp: '5025211001', nama: 'Andi Pratama' },
      aiSuggestedPoints: 7,
      aiReason: 'Mahasiswa memberi ide tampilan review dosen agar rekomendasi AI lebih mudah diverifikasi.',
      finalPoints: null,
      lecturerNote: null,
      status: 'PENDING',
      createdAt: '2026-04-27T19:30:00.000Z',
      reviewedAt: null,
    },
  ];

  const postContents = [
    'Menurut saya kebutuhan utama sistem ini adalah pencatatan progres setiap anggota. Kalau semua aktivitas tercatat, dosen bisa melihat siapa yang aktif membantu diskusi dan siapa yang masih pasif.',
    'Untuk desain database, tabel activity log sebaiknya menyimpan id user, id thread, tipe aktivitas, poin, dan timestamp supaya riwayat kontribusi bisa diaudit ulang.',
    'Saya setuju dengan ide tersebut, tetapi menurut saya perlu ada status review agar poin dari AI tidak langsung dianggap final sebelum dosen melihat konteks diskusinya.',
    'Kalau dashboard kontribusi dibuat per assignment, dosen bisa membandingkan apakah kontribusi mahasiswa konsisten di semua tugas atau hanya aktif pada tugas tertentu.',
    'Fitur yang paling perlu dibuat lebih dulu menurut saya adalah daftar rekomendasi kontribusi karena dosen butuh mengecek alasan dari setiap poin.',
    'Untuk evaluasi presentasi, kita bisa menampilkan contoh sebelum dan sesudah dosen melakukan review supaya alur human validation lebih terlihat.',
    'Aku bisa bantu membuat pembagian tugas berdasarkan thread supaya setiap anggota punya area tanggung jawab yang jelas.',
    'Menurutku validasi alur sistem perlu memastikan post yang dihapus tidak lagi dihitung dalam total kontribusi.',
    'Progress minggu ini cukup baik, tetapi kita perlu menyelesaikan bagian catatan dosen agar mahasiswa tahu alasan poin finalnya.',
    'Kebutuhan non-fungsionalnya bisa mencakup audit trail, respons cepat pada diskusi, dan tampilan kontribusi yang mudah dipahami.',
    'Relasi datanya bisa dibuat dari post ke contribution review, lalu final points dihitung dari review yang sudah berstatus reviewed.',
    'Di prototype, dosen sebaiknya bisa melihat konten post, alasan AI, dan input final points dalam satu modal.',
  ];

  return baseReviews.map((review, index) => ({
    ...review,
    id: `${studyGroupId}-review-${index + 1}`,
    post: {
      id: `${studyGroupId}-post-${index + 1}`,
      konten: paragraph(postContents[index]),
      createdAt: review.createdAt,
      updatedAt: review.createdAt,
    },
    threadId: `${studyGroupId}-thread-${(index % 4) + 1}`,
  }));
};

const getMockContributionReviews = (studyGroupId: string) => {
  const existing = mockContributionReviewsBySg.get(studyGroupId);
  if (existing) return existing;

  const reviews = createMockContributionReviews(studyGroupId);
  mockContributionReviewsBySg.set(studyGroupId, reviews);
  return reviews;
};

const getContributionReviewsByStudyGroup = async (studyGroupId: string, params: ContributionReviewQueryParams = {}): Promise<ApiResponse<ContributionReview[]>> => {
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));

  const page = Math.max(params.page ?? DEFAULT_PAGE, 1);
  const limit = Math.max(params.limit ?? DEFAULT_LIMIT, 1);
  const allReviews = getMockContributionReviews(studyGroupId);
  const filteredReviews = allReviews
    .filter((review) => !params.status || review.status === params.status)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  const totalItems = filteredReviews.length;
  const totalPages = Math.max(Math.ceil(totalItems / limit), 1);
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * limit;
  const paginatedReviews = filteredReviews.slice(start, start + limit);

  return {
    status: 'success',
    message: 'data berhasil diambil!',
    data: paginatedReviews,
    pagination: {
      page: safePage,
      limit,
      total_items: totalItems,
      total_pages: totalPages,
    },
  };
};

const reviewContribution = async (idReview: string, payload: ReviewContributionPayload): Promise<ApiResponse<ContributionReview>> => {
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));

  for (const [studyGroupId, reviews] of mockContributionReviewsBySg.entries()) {
    const reviewIndex = reviews.findIndex((review) => review.id === idReview);
    if (reviewIndex === -1) continue;

    const updatedReview: ContributionReview = {
      ...reviews[reviewIndex],
      finalPoints: payload.finalPoints,
      lecturerNote: payload.lecturerNote,
      status: payload.status,
      reviewedAt: new Date().toISOString(),
    };

    const nextReviews = [...reviews];
    nextReviews[reviewIndex] = updatedReview;
    mockContributionReviewsBySg.set(studyGroupId, nextReviews);

    return {
      status: 'success',
      message: 'data berhasil direview!',
      data: updatedReview,
    };
  }

  throw new Error('Data review kontribusi tidak ditemukan.');
};

export { getContributionReviewsByStudyGroup, reviewContribution };
