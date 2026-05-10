import { createLearningApproach, updateLearningApproach } from '@/api/approach';
import { getUserByNrp } from '@/api/profile';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Title from '@/components/shared/Title';
import { getUser } from '@/lib/authStorage';
import { cn } from '@/lib/cn';
import type { ApiResponse } from '@/types/api';
import type { UserProfile } from '@/types/profile';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

type AnswerKey = 'a' | 'b' | 'c' | 'd';
type VarkKey = 'V' | 'A' | 'R' | 'K';

const VARK_MAP: Record<AnswerKey, VarkKey> = { a: 'V', b: 'A', c: 'R', d: 'K' };

const VARK_LABEL: Record<VarkKey, string> = {
  V: 'Visual',
  A: 'Auditory',
  R: 'Reading/Writing',
  K: 'Kinesthetic',
};

const VARK_DB_KEY: Record<VarkKey, string> = {
  V: 'visual',
  A: 'auditory',
  R: 'reading/writing',
  K: 'kinesthetic',
};

const VARK_DESCRIPTION: Record<VarkKey, string> = {
  V: 'Kamu belajar paling efektif melalui gambar, diagram, grafik, dan representasi visual. Manfaatkan video, infografis, dan mind map untuk memaksimalkan pemahaman.',
  A: 'Kamu belajar paling efektif melalui pendengaran dan diskusi. Podcast, rekaman kuliah, dan berdiskusi dengan teman sangat cocok untuk kamu.',
  R: 'Kamu belajar paling efektif melalui membaca dan menulis. Buku, artikel, dan membuat catatan terstruktur adalah cara belajar terbaik kamu.',
  K: 'Kamu belajar paling efektif melalui pengalaman langsung. Praktikum, simulasi, dan latihan soal adalah metode yang paling efektif untuk kamu.',
};

const VARK_BG: Record<VarkKey, string> = {
  V: 'bg-blue-500',
  A: 'bg-green-500',
  R: 'bg-purple-500',
  K: 'bg-orange-500',
};

const VARK_TEXT: Record<VarkKey, string> = {
  V: 'text-blue-600',
  A: 'text-green-600',
  R: 'text-purple-600',
  K: 'text-orange-600',
};

const VARK_BG_LIGHT: Record<VarkKey, string> = {
  V: 'bg-blue-50 border-blue-200',
  A: 'bg-green-50 border-green-200',
  R: 'bg-purple-50 border-purple-200',
  K: 'bg-orange-50 border-orange-200',
};

type Question = {
  id: number;
  text: string;
  options: Record<AnswerKey, string>;
};

const questions: Question[] = [
  {
    id: 1,
    text: 'Saya lebih mudah mengingat sesuatu dari …',
    options: {
      a: 'Yang dilihat',
      b: 'Yang didengar',
      c: 'Yang dibaca dan tulis ulang',
      d: 'Yang dipraktikkan langsung',
    },
  },
  {
    id: 2,
    text: 'Saya lebih suka belajar dengan cara …',
    options: {
      a: 'Melihat gambar, grafik, atau ilustrasi',
      b: 'Mendengarkan penjelasan langsung',
      c: 'Membaca buku atau modul',
      d: 'Praktik atau mencoba langsung',
    },
  },
  {
    id: 3,
    text: 'Saat mencatat materi, saya biasanya …',
    options: {
      a: 'Membuat banyak catatan disertai gambar atau warna',
      b: 'Sedikit mencatat karena lebih mengandalkan pendengaran',
      c: 'Membuat catatan lengkap dan terstruktur',
      d: 'Menulis hal-hal yang ingin segera dipraktikkan',
    },
  },
  {
    id: 4,
    text: 'Saat belajar, kondisi saya biasanya …',
    options: {
      a: 'Tidak mudah terganggu keributan di sekitar',
      b: 'Mudah terganggu oleh suara atau keributan',
      c: 'Butuh bahan bacaan yang lengkap untuk fokus',
      d: 'Sulit duduk diam dalam waktu lama',
    },
  },
  {
    id: 5,
    text: 'Ketika menjawab pertanyaan, saya cenderung …',
    options: {
      a: 'Menjawab singkat, seperti ya atau tidak',
      b: 'Menjawab panjang lebar dan suka bercerita',
      c: 'Menjawab dengan tulisan atau poin terstruktur',
      d: 'Menjawab sambil menggunakan gestur atau gerakan',
    },
  },
  {
    id: 6,
    text: 'Cara saya mengingat materi adalah …',
    options: {
      a: 'Membayangkan tampilan visual atau gambarnya',
      b: 'Mengucapkan atau mengulang secara lisan',
      c: 'Menulisnya kembali berkali-kali',
      d: 'Mempraktikkan atau menggunakannya langsung',
    },
  },
  {
    id: 7,
    text: 'Waktu luang saya biasanya diisi dengan …',
    options: {
      a: 'Menonton film atau konten visual',
      b: 'Mendengarkan musik atau podcast',
      c: 'Membaca buku atau artikel',
      d: 'Olahraga atau aktivitas fisik',
    },
  },
  {
    id: 8,
    text: 'Saya lebih mudah memahami pelajaran dengan …',
    options: {
      a: 'Melihat demonstrasi atau peraga',
      b: 'Berdiskusi atau mendengarkan penjelasan',
      c: 'Membaca modul atau handout',
      d: 'Praktik langsung',
    },
  },
  {
    id: 9,
    text: 'Di antara hal berikut, saya lebih menyukai …',
    options: {
      a: 'Gambar dan karya visual',
      b: 'Musik dan audio',
      c: 'Buku dan tulisan',
      d: 'Permainan dan aktivitas fisik',
    },
  },
  {
    id: 10,
    text: 'Format materi belajar yang paling membantu saya adalah …',
    options: {
      a: 'Video atau infografis',
      b: 'Podcast atau rekaman kuliah',
      c: 'E-book atau artikel ilmiah',
      d: 'Simulasi atau praktikum',
    },
  },
  {
    id: 11,
    text: 'Saat menghadapi konsep yang sulit, saya biasanya …',
    options: {
      a: 'Mencari video atau visualisasi penjelasan',
      b: 'Bertanya langsung atau diskusi bersama teman',
      c: 'Mencari buku atau artikel referensi',
      d: 'Langsung mencoba lewat soal latihan',
    },
  },
  {
    id: 12,
    text: 'Cara saya mempersiapkan ujian adalah …',
    options: {
      a: 'Membuat mind map atau tabel ringkasan',
      b: 'Diskusi bersama teman atau dengar ulang rekaman',
      c: 'Membaca ulang dan merangkum catatan',
      d: 'Mengerjakan banyak soal latihan',
    },
  },
  {
    id: 13,
    text: 'Peran saya yang paling nyaman dalam belajar kelompok adalah …',
    options: {
      a: 'Membuat slide, bagan, atau materi visual',
      b: 'Menjelaskan materi secara lisan kepada anggota',
      c: 'Menyusun laporan atau rangkuman tertulis',
      d: 'Mendemonstrasikan praktik langsung',
    },
  },
  {
    id: 14,
    text: 'Saya lebih mudah memahami instruksi tugas jika …',
    options: {
      a: 'Disertai diagram alur atau contoh gambar',
      b: 'Dijelaskan secara lisan dengan detail',
      c: 'Ditulis secara langkah demi langkah',
      d: 'Langsung dicontohkan kemudian saya coba',
    },
  },
  {
    id: 15,
    text: 'Ketika menjelaskan sesuatu kepada orang lain, saya cenderung …',
    options: {
      a: 'Menggambar sketsa atau diagram',
      b: 'Menjelaskan panjang lebar secara lisan',
      c: 'Menuliskan poin-poin pentingnya',
      d: 'Mencontohkan atau mendemonstrasikan langsung',
    },
  },
  {
    id: 16,
    text: 'Format tugas yang paling saya sukai adalah …',
    options: {
      a: 'Laporan dengan grafik atau infografis',
      b: 'Presentasi lisan',
      c: 'Esai atau laporan tertulis',
      d: 'Demonstrasi atau produk nyata',
    },
  },
  {
    id: 17,
    text: 'Saya lebih nyaman berkomunikasi dengan cara …',
    options: {
      a: 'Tatap muka sambil melihat ekspresi lawan bicara',
      b: 'Melalui telepon atau pesan suara',
      c: 'Melalui pesan teks atau surat',
      d: 'Sambil melakukan kegiatan bersama',
    },
  },
  {
    id: 18,
    text: 'Lingkungan belajar yang paling nyaman bagi saya adalah …',
    options: {
      a: 'Ruangan rapi dengan tata letak visual yang baik',
      b: 'Tempat sunyi tanpa gangguan suara',
      c: 'Perpustakaan dengan banyak bahan bacaan',
      d: 'Ruang yang bebas untuk bergerak',
    },
  },
  {
    id: 19,
    text: 'Untuk mengingat istilah atau konsep baru, saya …',
    options: {
      a: 'Menghubungkannya dengan gambar atau simbol',
      b: 'Mengucapkannya berulang kali',
      c: 'Menulisnya berulang kali di catatan',
      d: 'Menggunakannya langsung dalam latihan nyata',
    },
  },
  {
    id: 20,
    text: 'Saat belajar mandiri di rumah, saya biasanya …',
    options: {
      a: 'Membuat mind map atau diagram',
      b: 'Mendengarkan ulang rekaman kuliah',
      c: 'Membaca ulang dan merangkum catatan',
      d: 'Mengerjakan soal atau simulasi kasus',
    },
  },
];

type VarkScores = Record<VarkKey, number>;

function calculateVark(answers: Record<number, AnswerKey>): {
  scores: VarkScores;
  dominant: VarkKey[];
} {
  const scores: VarkScores = { V: 0, A: 0, R: 0, K: 0 };
  Object.values(answers).forEach((ans) => {
    scores[VARK_MAP[ans]]++;
  });
  const max = Math.max(...Object.values(scores));
  const dominant = (Object.keys(scores) as VarkKey[]).filter((k) => max - scores[k] <= 1);
  return { scores, dominant };
}

type SurveyResult = { scores: VarkScores; dominant: VarkKey[] };

// ─── Result screen ────────────────────────────────────────────────────────────

function ResultScreen({
  result,
  onSave,
  isSaving,
  isSaved,
}: {
  result: SurveyResult;
  onSave: () => void;
  isSaving: boolean;
  isSaved: boolean;
}) {
  const navigate = useNavigate();
  const { scores, dominant } = result;
  const total = Object.values(scores).reduce((a, b) => a + b, 0);
  const sortedScores = (Object.entries(scores) as [VarkKey, number][]).sort(([, a], [, b]) => b - a);

  return (
    <div className='w-full max-w-3xl mx-auto space-y-6'>
      <Title
        title='Hasil Kuesioner Gaya Belajar'
        items={[{ label: 'Kuesioner VARK', href: '/survey' }, { label: 'Hasil' }]}
      />

      {/* Dominant result */}
      <Card className='border-primary/40'>
        <CardHeader>
          <div className='flex items-center gap-2'>
            <CheckCircle2 className='text-primary size-5' />
            <CardTitle className='text-primary'>Gaya Belajar Dominan Kamu</CardTitle>
          </div>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex flex-wrap gap-2'>
            {dominant.map((key) => (
              <span
                key={key}
                className={cn('px-3 py-1.5 rounded-full text-sm font-semibold text-white', VARK_BG[key])}
              >
                {VARK_LABEL[key]} ({key})
              </span>
            ))}
          </div>
          <div className='space-y-3'>
            {dominant.map((key) => (
              <div key={key} className={cn('p-4 rounded-lg border', VARK_BG_LIGHT[key])}>
                <p className={cn('font-semibold text-sm mb-1', VARK_TEXT[key])}>{VARK_LABEL[key]}</p>
                <p className='text-sm text-foreground/80'>{VARK_DESCRIPTION[key]}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Score breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Rincian Skor</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          {sortedScores.map(([key, score]) => (
            <div key={key} className='space-y-1.5'>
              <div className='flex justify-between text-sm'>
                <span className={cn('font-medium', VARK_TEXT[key])}>
                  {VARK_LABEL[key]} ({key})
                </span>
                <span className='text-muted-foreground'>
                  {score} / {total}
                </span>
              </div>
              <div className='w-full bg-secondary rounded-full h-2.5'>
                <div
                  className={cn('h-2.5 rounded-full transition-all duration-500', VARK_BG[key])}
                  style={{ width: `${(score / total) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Actions */}
      {isSaved ? (
        <div className='flex flex-col sm:flex-row gap-3 pb-8'>
          <Button variant='outline' onClick={() => navigate('/profile')} className='flex-1'>
            Lihat Profil
          </Button>
          <Button onClick={() => navigate('/mahasiswa', { replace: true })} className='flex-1'>
            Ke Dashboard
          </Button>
        </div>
      ) : (
        <div className='pb-8'>
          <Button onClick={onSave} disabled={isSaving} className='w-full' size='lg'>
            {isSaving ? 'Menyimpan...' : 'Simpan Hasil'}
          </Button>
        </div>
      )}
    </div>
  );
}

// ─── Survey screen ────────────────────────────────────────────────────────────

const breadcrumbItems = [{ label: 'Kuesioner VARK' }];

const SurveyPage = () => {
  const [answers, setAnswers] = useState<Record<number, AnswerKey>>({});
  const [result, setResult] = useState<SurveyResult | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const queryClient = useQueryClient();
  const authUser = getUser();

  const { data: profileData } = useQuery({
    queryKey: ['profile', authUser?.nrp],
    queryFn: () => getUserByNrp(authUser!.nrp),
    enabled: !!authUser?.nrp,
  });

  const gayaBelajarExists = !!(profileData?.data?.gayaBelajar?.length);

  const { mutate: saveApproach, isPending: isSaving } = useMutation({
    mutationFn: () => {
      if (!result || !authUser) throw new Error('No result or user');
      const gayaBelajar = result.dominant.map((k) => VARK_DB_KEY[k]);
      return gayaBelajarExists
        ? updateLearningApproach(authUser.id, { gayaBelajar })
        : createLearningApproach(authUser.id, { gayaBelajar });
    },
    onSuccess: () => {
      if (!result || !authUser) return;
      const gayaBelajar = result.dominant.map((k) => VARK_DB_KEY[k]);
      // Update cache optimistically so the guard sees the new value immediately on navigation
      queryClient.setQueryData(
        ['profile', authUser.nrp],
        (old: ApiResponse<UserProfile> | undefined) =>
          old ? { ...old, data: { ...old.data, gayaBelajar } } : old,
      );
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Gaya belajar berhasil disimpan!', { toasterId: 'global' });
      setIsSaved(true);
    },
    onError: () => {
      toast.error('Gagal menyimpan gaya belajar. Coba lagi.', { toasterId: 'global' });
    },
  });

  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === questions.length;

  const handleSelect = (questionId: number, answer: AnswerKey) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = () => {
    if (!allAnswered) return;
    const calculated = calculateVark(answers);
    setResult(calculated);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (result) {
    return (
      <ResultScreen
        result={result}
        onSave={() => saveApproach()}
        isSaving={isSaving}
        isSaved={isSaved}
      />
    );
  }

  return (
    <div className='w-full max-w-3xl mx-auto space-y-6'>
      <Title title='Kuesioner Gaya Belajar (VARK)' items={breadcrumbItems} />

      <p className='text-muted-foreground text-sm -mt-2'>
        Jawab semua pertanyaan berikut untuk mengetahui gaya belajar yang paling cocok untukmu.
        Pilih jawaban yang paling menggambarkan dirimu, bukan yang dianggap "benar".
      </p>

      {/* Progress bar */}
      <Card className='py-4 px-6 gap-3 flex-row items-center'>
        <div className='flex-1 space-y-2'>
          <div className='flex justify-between text-sm font-medium'>
            <span className='text-muted-foreground'>Progress</span>
            <span className='text-primary'>
              {answeredCount} / {questions.length} pertanyaan dijawab
            </span>
          </div>
          <div className='w-full bg-secondary rounded-full h-2'>
            <div
              className='bg-primary h-2 rounded-full transition-all duration-300'
              style={{ width: `${(answeredCount / questions.length) * 100}%` }}
            />
          </div>
        </div>
      </Card>

      {/* Questions */}
      <div className='space-y-4'>
        {questions.map((q, index) => {
          const selected = answers[q.id];
          return (
            <Card key={q.id} className={cn('py-5 gap-0', selected !== undefined && 'border-primary/40')}>
              <CardHeader className='pb-3'>
                <CardTitle className='text-sm font-semibold text-foreground flex gap-3 items-start'>
                  <span className='flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center mt-0.5'>
                    {index + 1}
                  </span>
                  <span>{q.text}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-2'>
                  {(Object.entries(q.options) as [AnswerKey, string][]).map(([key, label]) => (
                    <button
                      key={key}
                      type='button'
                      onClick={() => handleSelect(q.id, key)}
                      className={cn(
                        'w-full text-left text-sm px-4 py-3 rounded-lg border transition-all duration-150 flex items-center gap-3 cursor-pointer',
                        selected === key
                          ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                          : 'bg-background border-border hover:bg-secondary hover:border-primary/30',
                      )}
                    >
                      <span
                        className={cn(
                          'w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center text-xs font-bold uppercase',
                          selected === key ? 'border-primary-foreground' : 'border-muted-foreground',
                        )}
                      >
                        {key}
                      </span>
                      {label}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Submit */}
      <div className='pb-8 pt-2 space-y-3'>
        {!allAnswered && (
          <p className='text-center text-sm text-muted-foreground'>
            Masih ada <span className='font-semibold text-primary'>{questions.length - answeredCount}</span> pertanyaan yang belum dijawab
          </p>
        )}
        <Button onClick={handleSubmit} disabled={!allAnswered} className='w-full' size='lg'>
          Lihat Hasil Gaya Belajar
        </Button>
      </div>
    </div>
  );
};

export default SurveyPage;
