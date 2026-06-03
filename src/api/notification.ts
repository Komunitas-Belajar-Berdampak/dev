import { api } from '@/lib/axios';
import type { ApiResponse } from '@/types/api';
import type { MarkReadData, Notification, NotificationListData, NotificationQuery, ReadAllData, UnreadCountData } from '@/types/notification';

// GET {{base_url}}/notifications
export const getNotifications = async (query: NotificationQuery = {}): Promise<ApiResponse<NotificationListData>> => {
  const { tipe, isRead, idCourse, page, limit } = query;
  const res = await api.get<ApiResponse<NotificationListData>>('/notifications', {
    params: {
      ...(tipe && { tipe }),
      ...(typeof isRead === 'boolean' && { isRead }),
      ...(idCourse && { idCourse }),
      ...(page && { page }),
      ...(limit && { limit }),
    },
  });
  return res.data;
};

// GET {{base_url}}/notifications/unread-count
export const getUnreadCount = async (): Promise<ApiResponse<UnreadCountData>> => {
  const res = await api.get<ApiResponse<UnreadCountData>>('/notifications/unread-count');
  return res.data;
};

// GET {{base_url}}/notifications/:id
export const getNotificationById = async (id: string): Promise<ApiResponse<Notification>> => {
  const res = await api.get<ApiResponse<Notification>>(`/notifications/${id}`);
  return res.data;
};

// PATCH {{base_url}}/notifications/:id/read
export const markNotificationRead = async (id: string): Promise<ApiResponse<MarkReadData>> => {
  const res = await api.patch<ApiResponse<MarkReadData>>(`/notifications/${id}/read`);
  return res.data;
};

// PATCH {{base_url}}/notifications/read-all
export const markAllNotificationsRead = async (): Promise<ApiResponse<ReadAllData>> => {
  const res = await api.patch<ApiResponse<ReadAllData>>('/notifications/read-all');
  return res.data;
};

// DELETE {{base_url}}/notifications/:id
export const deleteNotification = async (id: string): Promise<ApiResponse<null>> => {
  const res = await api.delete<ApiResponse<null>>(`/notifications/${id}`);
  return res.data;
};
