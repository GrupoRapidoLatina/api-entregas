export enum DeliveryStatus {
  Waiting = 1,
  Accepted = 2,
  InProgress = 3,
  Delivered = 4,
  Available = 5,
  Legacy6 = 6,
  Legacy7 = 7,
  Legacy8 = 8,
  TransporteCancelado = 99,
  PedidoCancelado = 100,
}

export const DeliveryStatusLabel: Record<DeliveryStatus, string> = {
  [DeliveryStatus.Waiting]: 'Aguardando',
  [DeliveryStatus.Accepted]: 'Coleta realizada',
  [DeliveryStatus.InProgress]: 'Em andamento',
  [DeliveryStatus.Delivered]: 'Entregue',
  [DeliveryStatus.Available]: 'Disponível',
  [DeliveryStatus.Legacy6]: 'Problema',
  [DeliveryStatus.Legacy7]: 'Falha na entrega',
  [DeliveryStatus.Legacy8]: 'Devolvido',
  [DeliveryStatus.TransporteCancelado]: 'Transporte cancelado',
  [DeliveryStatus.PedidoCancelado]: 'Pedido cancelado',
};
