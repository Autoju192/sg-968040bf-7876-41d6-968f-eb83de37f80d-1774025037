import { supabase } from "@/lib/supabase";

export type NotificationType = "deadline" | "tender" | "task" | "update" | "system";

export interface CreateNotificationData {
  user_id?: string;
  organisation_id?: string;
  type: NotificationType;
  title: string;
  message: string;
  tender_id?: string;
  task_id?: string;
}

export async function createNotification(data: CreateNotificationData) {
  const { error } = await supabase.from("notifications").insert({
    ...data,
    read: false,
  });

  if (error) throw error;
}

export async function createDeadlineNotification(
  tenderId: string,
  tenderTitle: string,
  deadline: Date,
  organisationId: string
) {
  const daysUntil = Math.ceil(
    (deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  await createNotification({
    organisation_id: organisationId,
    type: "deadline",
    title: "Deadline Approaching",
    message: `${tenderTitle} deadline is in ${daysUntil} days`,
    tender_id: tenderId,
  });
}

export async function createTenderUpdateNotification(
  tenderId: string,
  tenderTitle: string,
  updateMessage: string,
  organisationId: string
) {
  await createNotification({
    organisation_id: organisationId,
    type: "update",
    title: "Tender Update",
    message: `${tenderTitle}: ${updateMessage}`,
    tender_id: tenderId,
  });
}

export async function createTaskAssignedNotification(
  userId: string,
  taskDescription: string,
  tenderId: string,
  taskId: string
) {
  await createNotification({
    user_id: userId,
    type: "task",
    title: "New Task Assigned",
    message: taskDescription,
    tender_id: tenderId,
    task_id: taskId,
  });
}

export async function markNotificationAsRead(notificationId: string) {
  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("id", notificationId);

  if (error) throw error;
}

export async function markAllNotificationsAsRead(userId: string) {
  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("user_id", userId)
    .eq("read", false);

  if (error) throw error;
}