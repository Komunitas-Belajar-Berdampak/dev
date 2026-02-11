import { api } from '@/lib/axios';
import type { ApiResponse } from '@/types/api';
import type { Thread, ThreadDetail } from '@/types/thread-post';

const getThreadsByStudyGroup = async (studyGroupId: string, page: number = 1, limit: number = 20): Promise<ApiResponse<Thread[]>> => {
  const res = await api.get<ApiResponse<Thread[]>>(`/threads/${studyGroupId}?page=${page}&limit=${limit}`);

  return res.data;
};

const getThreadsById = async (threadId: string): Promise<ApiResponse<ThreadDetail[]>> => {
  // const res = await api.get<ApiResponse<ThreadDetail[]>>(`/threads/${threadId}`);

  const res = await new Promise<{ data: ApiResponse<ThreadDetail[]> }>((resolve) => {
    setTimeout(
      () =>
        resolve({
          data: {
            status: 'success',
            message: 'Fetched thread details successfully (mock).',
            data: [
              {
                id: threadId,
                author: {
                  nrp: '22722008',
                  nama: 'Joshua Subianto',
                },
                konten: {
                  type: 'doc',
                  content: [
                    {
                      type: 'image',
                      attrs: {
                        src: 'https://placehold.co/1000x500/png',
                        alt: 'Placeholder image',
                        title: 'Placeholder',
                      },
                    },
                    {
                      type: 'paragraph',
                    },
                    {
                      type: 'paragraph',
                      content: [
                        {
                          type: 'text',
                          text: 'Halo ini test buat discussion check satu ',
                        },
                        {
                          type: 'text',
                          marks: [
                            {
                              type: 'bold',
                            },
                          ],
                          text: 'dua',
                        },
                        {
                          type: 'hardBreak',
                        },
                        {
                          type: 'hardBreak',
                        },
                        {
                          type: 'text',
                          text: 'ini aku space ',
                        },
                        {
                          type: 'text',
                          marks: [
                            {
                              type: 'italic',
                            },
                          ],
                          text: 'bla bla bla',
                        },
                      ],
                    },
                    {
                      type: 'paragraph',
                    },
                    {
                      type: 'paragraph',
                    },
                  ],
                },
                updatedAt: '2025-09-23T14:30:00Z',
              },
              {
                id: 'threadId2',
                author: {
                  nrp: 'D0001',
                  nama: 'Dosen Contoh',
                },
                konten: {
                  type: 'doc',
                  content: [
                    {
                      type: 'paragraph',
                      content: [
                        {
                          type: 'text',
                          text: 'Halo ini test buat discussion check satu ',
                        },
                        {
                          type: 'text',
                          marks: [
                            {
                              type: 'bold',
                            },
                          ],
                          text: 'dua',
                        },
                        {
                          type: 'hardBreak',
                        },
                        {
                          type: 'text',
                          text: 'ini test ',
                        },
                        {
                          type: 'text',
                          marks: [
                            {
                              type: 'italic',
                            },
                          ],
                          text: 'bla bla bla',
                        },
                      ],
                    },
                  ],
                },
                updatedAt: '2025-09-24T10:15:00Z',
              },
            ],
          },
        }),
      1000,
    );
  });

  return res.data;
};

const addPost = async (threadId: string, payload: { konten: unknown }): Promise<ApiResponse<null>> => {
  // const res = await api.post<ApiResponse<null>>(`/threads/${threadId}`, payload);
  // return res.data;

  const res = await new Promise<{ data: ApiResponse<null> }>((resolve) => {
    setTimeout(
      () =>
        resolve({
          data: {
            status: 'success',
            message: 'Created new discussion successfully (mock).',
            data: null,
          },
        }),
      800,
    );
  });

  void payload;
  return res.data;
};

const editPost = async (postId: string, payload: { konten: unknown }): Promise<ApiResponse<null>> => {
  // const res = await api.put<ApiResponse<null>>(`/posts/${postId}`, payload);

  const res = await new Promise<{ data: ApiResponse<null> }>((resolve) => {
    setTimeout(
      () =>
        resolve({
          data: {
            status: 'success',
            message: 'Edited post successfully (mock).',
            data: null,
          },
        }),
      800,
    );
  });

  void payload;

  return res.data;
};

const getPostById = async (postId: string): Promise<ApiResponse<ThreadDetail>> => {
  // const res = await api.get<ApiResponse<ThreadDetail>>(`/posts/${postId}`);

  const res = await new Promise<{ data: ApiResponse<ThreadDetail> }>((resolve) => {
    setTimeout(
      () =>
        resolve({
          data: {
            status: 'success',
            message: 'Fetched post successfully (mock).',
            data: {
              id: postId,
              author: {
                nrp: 'D0001',
                nama: 'Dosen Contoh',
              },
              konten: {
                type: 'doc',
                content: [
                  {
                    type: 'paragraph',
                  },
                  {
                    type: 'paragraph',
                    content: [
                      {
                        type: 'text',
                        text: 'Halo ini test buat discussion check satu ',
                      },
                      {
                        type: 'text',
                        marks: [
                          {
                            type: 'bold',
                          },
                        ],
                        text: 'dua',
                      },
                      {
                        type: 'hardBreak',
                      },
                      {
                        type: 'hardBreak',
                      },
                      {
                        type: 'text',
                        text: 'ini aku space ',
                      },
                      {
                        type: 'text',
                        marks: [
                          {
                            type: 'italic',
                          },
                        ],
                        text: 'bla bla bla',
                      },
                    ],
                  },
                  {
                    type: 'paragraph',
                  },
                  {
                    type: 'paragraph',
                  },
                ],
              },
              updatedAt: '2025-09-24T10:15:00Z',
            },
          },
        }),
      800,
    );
  });
  return res.data;
};

const deletePost = async (postId: string): Promise<ApiResponse<null>> => {
  // const res = await api.delete<ApiResponse<null>>(`/posts/${postId}`);

  const res = await new Promise<{ data: ApiResponse<null> }>((resolve) => {
    setTimeout(
      () =>
        resolve({
          data: {
            status: 'success',
            message: 'Deleted post successfully (mock).',
            data: null,
          },
        }),
      800,
    );
  });

  return res.data;
};

export { addPost, deletePost, editPost, getPostById, getThreadsById, getThreadsByStudyGroup };
