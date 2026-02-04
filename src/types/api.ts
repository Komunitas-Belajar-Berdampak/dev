export type ApiPagination = {
  limit: number;
  page: number;
  total_items: number;
  total_pages: number;
};

export type ApiResponse<TData> = {
  status: 'success' | 'error';
  message: string;
  data: TData;
  pagination?: ApiPagination;
};
