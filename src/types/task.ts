export type Task = {
  id: string;
  task: string;
  mahasiswa: {
    id: string;
    nama: string;
  }[];
  status: 'DO' | 'IN PROGRESS' | 'DONE';
};
