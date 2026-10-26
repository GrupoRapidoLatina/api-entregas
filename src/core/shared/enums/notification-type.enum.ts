export enum NotificationType {
  Accept = 'accept',
  Pickup = 'pickup',
  Deliver = 'deliver',
  Cancel = 'cancel',
}

export const NotificationTypeLabel: Record<NotificationType, string> = {
  [NotificationType.Accept]: 'Aceite',
  [NotificationType.Pickup]: 'Coleta',
  [NotificationType.Deliver]: 'Entrega',
  [NotificationType.Cancel]: 'Cancelamento',
};
