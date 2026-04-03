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
    idMeeting: string;
    idCourse: string;
    judul: string;
    tenggat: string;
    sudahLewat: true;
    matkul: string;
    pertemuan: number;
  }[];
  summary: {
    jumlahKelas: number;
    tugasBelumSelesai: number;
    deadlineTerdekat: string;
  };
  lastMateri: {
    id: string;
    idMeeting: string;
    namaFile: string;
    tipe: string;
    accessedAt: string;
    matkul: {
      id: string;
      namaMatkul: string;
      kodeMatkul: string;
    };
    pertemuan: number;
  };
};
