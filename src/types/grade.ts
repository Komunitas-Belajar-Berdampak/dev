export type MhsGrade = {
  summary: {
    totalTugas: number | 0;
    totalDinilai: number | 0;
    totalBelumDinilai: number | 0;
    rataRataNilai: number | 0;
  };
  courses: {
    id: string;
    kodeMatkul: string;
    namaMatkul: string;
    kelas: string;
    sks: 0;
    summary: {
      totalTugas: 0;
      totalDinilai: 0;
      totalBelumDinilai: 0;
      rataRataNilai: 0;
    };
    assignments: {
      id: string;
      judul: string;
      tenggat: string;
      pertemuan: number;
      submission: {
        submitted: true;
        submittedAt: string;
        nilai: number;
        gradedAt: string;
      };
    }[];
  }[];
};
