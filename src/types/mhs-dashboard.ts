export type MhsDashboard = {
  matakuliahAktif: {
    id: string;
    kodeMatkul: string;
    namaMatkul: string;
    kelas: string;
    sks: number;
  }[];
  tugasDeadlineDekat: {
    id: string;
    judul: string;
    tenggat: string;
    sudahLewat: boolean;
    matkul: string;
    pertemuan: number;
  }[];
  summary: {
    jumlahKelas: number;
    tugasBelumSelesai: number;
    deadlineTerdekat: string;
  };
  lastMateri:
    | null
    | {
        id: string;
        judul: string;
        tenggat: string;
        sudahLewat: boolean;
        matkul: string;
        pertemuan: number;
      }[];
};
