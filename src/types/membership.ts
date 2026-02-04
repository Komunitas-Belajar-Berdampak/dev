export type MembershipByStudyGroup = {
  id: string;
  totalRequest: number;
  mahasiswa: {
    id: string;
    nrp: string;
    nama: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
  }[];
};
