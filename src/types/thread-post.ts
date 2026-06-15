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
  parentPostId?: string | null;
  parentPost?: ThreadParentPostPreview | null;
  createdAt: string;
  updatedAt: string;
};

export type ThreadParentPostPreview = {
  id: string;
  author: {
    nrp: string;
    nama: string;
  } | null;
  kontenPreview: string;
  createdAt: string | null;
};

export type ThreadLatestUpdate = {
  latestUpdatedAt: string | null;
  totalPosts: number;
};
