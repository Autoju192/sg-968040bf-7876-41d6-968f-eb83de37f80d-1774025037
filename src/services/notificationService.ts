import { supabase } from "@/lib/supabase";

export interface CreateNotificationParams {
  organisationId: string;
  userId?: string | null;
  type: 'new_tender' | 'tender_update' | 'deadline' | 'message' | 'task_assigned' | 'comment' | 'system';
  title: string;
  message?: string;
  tenderId?: string;
  taskId?: string;
}

export const notificationService = {
  /**
   * Create a new notification
   */
  async create(params: CreateNotificationParams) {
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        organisation_id: params.organisationId,
        user_id: params.userId,
        type: params.type,
        title: params.title,
        message: params.message,
        tender_id: params.tenderId,
        task_id: params.taskId,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating notification:', error);
      throw error;
    }

    return data;
  },

  /**
   * Get notifications for a user
   */
  async getForUser(userId: string, organisationId: string, limit = 50) {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .or(`user_id.eq.${userId},user_id.is.null`)
      .eq('organisation_id', organisationId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }

    return data;
  },

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string) {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId);

    if (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId: string) {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', userId)
      .eq('read', false);

    if (error) {
      console.error('Error marking all as read:', error);
      throw error;
    }
  },

  /**
   * Delete a notification
   */
  async delete(notificationId: string) {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId);

    if (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  },

  /**
   * Get unread count for a user
   */
  async getUnreadCount(userId: string, organisationId: string) {
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .or(`user_id.eq.${userId},user_id.is.null`)
      .eq('organisation_id', organisationId)
      .eq('read', false);

    if (error) {
      console.error('Error getting unread count:', error);
      throw error;
    }

    return count || 0;
  },
};