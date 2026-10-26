export type CreateNotificationInput = {
  orderId: number;
  fromUserId: number;
  toUserId?: number | null;
  message: string;
  type: string;
};

export function toNotificationCreate(data: CreateNotificationInput) {
  return {
    orderId: data.orderId,
    fromUserId: data.fromUserId,
    toUserId: data.toUserId ?? 0,
    message: data.message || '',
    type: data.type,
  };
}
