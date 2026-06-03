export type NotificationType = 'DEADLINE_SOON' | 'NEW_ASSIGNMENT' | 'LATE_SUBMISSION';

export type NotificationCourse = {
  id: string;
  kodeMatkul: string;
  namaMatkul: string;
};

export type NotificationAssignment = {
  id: string;
  judul: string;
  tenggat: string;
  pertemuan?: number | string;
};

export type Notification = {
  id: string;
  tipe: NotificationType;
  judul: string;
  pesan: string;
  isRead: boolean;
  createdAt: string;
  readAt?: string | null;
  course?: NotificationCourse;
  assignment?: NotificationAssignment;
  /** Hanya diisi untuk DEADLINE_SOON. Tidak disimpan di DB. */
  sisaWaktu?: string;
  /** Hanya diisi untuk LATE_SUBMISSION. Tidak disimpan di DB. */
  submittedAt?: string;
  link?: string;
};

/** Pagination yang dikirim di dalam `data` endpoint /notifications (camelCase). */
export type NotificationPagination = {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
};

export type NotificationListData = {
  totalUnread: number;
  items: Notification[];
  pagination: NotificationPagination;
};

export type UnreadCountData = {
  totalUnread: number;
};

export type MarkReadData = {
  id: string;
  isRead: true;
  readAt: string;
};

export type ReadAllData = {
  totalUpdated: number;
};

export type NotificationQuery = {
  tipe?: NotificationType;
  isRead?: boolean;
  idCourse?: string;
  page?: number;
  limit?: number;
};
