export type Thread = {
  id: string;
  judul: string;
  assignment: string;
};

export type ThreadDetail = {
  id: string;
  author: {
    nrp: string;
    nama: string;
  };
  konten: import('@tiptap/react').JSONContent;
  updatedAt: string;
};
